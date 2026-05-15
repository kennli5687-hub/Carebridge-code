from __future__ import annotations

import importlib.util
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock
from typing import Any


HOST = "127.0.0.1"
PORT = 8787

CTAS_ENGINE_PATH = Path(r"C:\Users\kennl\OneDrive\Desktop\Kenn Li\formal\Education\ML course not antigrav\ctas proj\ctas_engine.py")
GEMMA_CLIENT_PATH = Path(r"C:\Users\kennl\OneDrive\Desktop\Kenn Li\formal\Education\ML course not antigrav\ctas proj\gemma4_client.py")
CASE_DB_PATH = Path(__file__).with_name("triage_case_store.json")
CASE_DB_LOCK = Lock()


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
      raise RuntimeError(f"Unable to load module from {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


ctas_engine = load_module("ctas_engine_external", CTAS_ENGINE_PATH)
gemma_client = load_module("gemma4_client_external", GEMMA_CLIENT_PATH)


def join_values(values: list[str]) -> str:
    return ", ".join(item.strip() for item in values if item and item.strip())


def normalize_token(value: Any) -> str:
    return "".join(char.lower() if char.isalnum() else " " for char in str(value or "")).strip()


def tokenize(value: Any) -> set[str]:
    normalized = normalize_token(value)
    return {token for token in normalized.split() if token}


def make_transcript(payload: dict[str, Any]) -> str:
    locations = payload.get("painLocation") or []
    history = payload.get("historyDisplay") or payload.get("history") or []
    allergies = payload.get("allergyDisplay") or payload.get("allergies") or []

    parts = [
        f"Patient name: {payload.get('name') or 'Unknown'}",
        f"Preferred language: {payload.get('preferredLanguage') or 'English'}",
        f"Date of birth: {payload.get('birthDate') or 'Unknown'}",
        f"Pain locations: {join_values(locations) or 'Not specified'}",
        f"Pain score: {payload.get('severity') if payload.get('severity') is not None else 'Unknown'} out of 10",
        f"Onset: {payload.get('onsetDisplay') or payload.get('onset') or 'Unknown'}",
        f"Sensation: {payload.get('painTypeDisplay') or payload.get('painType') or 'Unknown'}",
        f"Focused answer: {payload.get('followUpDisplay') or payload.get('followUpAnswer') or 'Unknown'}",
        f"History: {join_values(history) or 'None reported'}",
        f"Allergies: {join_values(allergies) or 'None reported'}",
        f"Loss of consciousness: {payload.get('lostConsciousness') or 'Unknown'}",
        f"Difficulty breathing: {payload.get('breathingDifficulty') or 'Unknown'}",
        f"Other update: {payload.get('updateOtherDisplay') or payload.get('updateOther') or 'None'}",
    ]
    return ". ".join(parts)


def load_case_store() -> list[dict[str, Any]]:
    if not CASE_DB_PATH.exists():
        return []
    try:
        return json.loads(CASE_DB_PATH.read_text(encoding="utf-8"))
    except Exception:
        return []


def save_case_store(cases: list[dict[str, Any]]) -> None:
    CASE_DB_PATH.write_text(json.dumps(cases, ensure_ascii=False, indent=2), encoding="utf-8")


def build_similarity_terms(structured: dict[str, Any]) -> set[str]:
    terms: set[str] = set()
    for key in ["chiefComplaint", "complaintCategory", "onset", "allergies", "notes"]:
        terms.update(tokenize(structured.get(key)))

    for key in ["symptoms", "redFlags"]:
        value = structured.get(key) or []
        if isinstance(value, list):
            for item in value:
                terms.update(tokenize(item))

    vitals = structured.get("vitals") or {}
    pain_score = vitals.get("painScore")
    if pain_score is not None:
        terms.add(f"pain_{pain_score}")

    return terms


def compute_similarity_score(left: set[str], right: set[str]) -> float:
    if not left or not right:
        return 0.0
    overlap = left & right
    union = left | right
    jaccard = len(overlap) / len(union)
    complaint_bonus = 0.15 if any(token in overlap for token in {"chest", "head", "abdomen", "back", "limbs", "skin"}) else 0.0
    red_flag_bonus = 0.15 if any(token in overlap for token in {"breathing", "consciousness", "stroke", "seizure", "syncope"}) else 0.0
    return min(1.0, jaccard + complaint_bonus + red_flag_bonus)


def find_similar_case(structured: dict[str, Any]) -> dict[str, Any] | None:
    current_terms = build_similarity_terms(structured)
    best_match: dict[str, Any] | None = None
    best_score = 0.0

    with CASE_DB_LOCK:
        stored_cases = load_case_store()

    for case in stored_cases:
        case_terms = set(case.get("similarityTerms") or [])
        score = compute_similarity_score(current_terms, case_terms)
        if score > best_score:
            best_score = score
            best_match = case

    if not best_match or best_score < 0.25:
        return None

    return {
        "caseId": best_match.get("caseId"),
        "ctasLevel": best_match.get("ctasLevel"),
        "presentingComplaint": best_match.get("presentingComplaint"),
        "similarityScore": round(best_score, 3),
    }


def persist_case_record(case_id: str | None, structured: dict[str, Any], ctas_result: dict[str, Any]) -> None:
    record = {
        "caseId": case_id,
        "ctasLevel": ctas_result.get("level"),
        "presentingComplaint": ctas_result.get("presentingComplaint"),
        "similarityTerms": sorted(build_similarity_terms(structured)),
    }

    with CASE_DB_LOCK:
        stored_cases = load_case_store()
        stored_cases.append(record)
        save_case_store(stored_cases[-500:])


def merge_frontend_facts(extracted: dict[str, Any], payload: dict[str, Any], transcript: str) -> dict[str, Any]:
    pain_score = payload.get("severity")
    symptoms = [item for item in payload.get("painLocation") or [] if item]
    sensation = payload.get("painTypeDisplay") or payload.get("painType")
    onset = payload.get("onsetDisplay") or payload.get("onset")
    follow_up = payload.get("followUpDisplay") or payload.get("followUpAnswer")

    merged = dict(extracted)
    merged["preferredLanguage"] = payload.get("preferredLanguage") or extracted.get("preferredLanguage") or "English"
    merged["sourceText"] = transcript
    merged["chiefComplaint"] = join_values(payload.get("painLocation") or []) or extracted.get("chiefComplaint")
    merged["patientSummary"] = extracted.get("patientSummary") or transcript
    merged["onset"] = onset or extracted.get("onset")
    merged["allergies"] = join_values(payload.get("allergyDisplay") or payload.get("allergies") or []) or extracted.get("allergies")
    merged["notes"] = "\n".join(
        item
        for item in [
            extracted.get("notes"),
            f"Sensation: {sensation}" if sensation else "",
            f"Focused detail: {follow_up}" if follow_up else "",
            f"Loss of consciousness: {payload.get('lostConsciousness')}" if payload.get("lostConsciousness") else "",
            f"Difficulty breathing: {payload.get('breathingDifficulty')}" if payload.get("breathingDifficulty") else "",
            f"Other update: {payload.get('updateOtherDisplay') or payload.get('updateOther')}" if (payload.get("updateOtherDisplay") or payload.get("updateOther")) else "",
        ]
        if item
    )

    merged_symptoms = list(extracted.get("symptoms") or [])
    merged_symptoms.extend(symptoms)
    if sensation:
        merged_symptoms.append(str(sensation))
    if follow_up:
        merged_symptoms.append(str(follow_up))
    merged["symptoms"] = list(dict.fromkeys(item for item in merged_symptoms if item))

    red_flags = list(extracted.get("redFlags") or [])
    if str(payload.get("lostConsciousness")).lower() == "yes":
        red_flags.append("loss of consciousness")
    if str(payload.get("breathingDifficulty")).lower() == "yes":
        red_flags.append("difficulty breathing")
    merged["redFlags"] = list(dict.fromkeys(red_flags))

    vitals = dict(extracted.get("vitals") or {})
    vitals["painScore"] = pain_score
    merged["vitals"] = vitals
    return merged


def build_similarity_review(case_id: str | None, structured: dict[str, Any], ctas_result: dict[str, Any]) -> dict[str, Any]:
    similar_case = find_similar_case(structured)
    if not similar_case:
        return {
            "matched": False,
            "nurseReviewRequired": False,
            "reason": "No sufficiently similar prior case was found in the case database.",
        }

    initial_level = ctas_result.get("level")
    matched_level = similar_case.get("ctasLevel")
    discrepancy = abs(int(initial_level) - int(matched_level))
    nurse_review_required = discrepancy > 1

    return {
        "matched": True,
        "nurseReviewRequired": nurse_review_required,
        "reason": (
            f"Initial CTAS {initial_level} differed from similar case CTAS {matched_level} by {discrepancy} level(s)."
            if nurse_review_required
            else f"Initial CTAS {initial_level} was within 1 level of similar case CTAS {matched_level}."
        ),
        "discrepancyLevels": discrepancy,
        "similarCase": similar_case,
        "initialCtas": {
            "level": initial_level,
            "title": ctas_result.get("title"),
            "presentingComplaint": ctas_result.get("presentingComplaint"),
        },
        "reviewStatus": "pending_nurse_review" if nurse_review_required else "not_required",
        "lockAutoUpdate": nurse_review_required,
        "caseId": case_id,
    }


class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self) -> None:
        self._set_headers(204)

    def do_GET(self) -> None:
        if self.path == "/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
            return
        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))

    def do_POST(self) -> None:
        if self.path != "/triage":
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8") or "{}")
        case_id = payload.get("caseId")
        transcript = make_transcript(payload)
        preferred_language = payload.get("preferredLanguage") or "English"

        try:
            extracted, raw_model = gemma_client.extract_with_gemma4(
                transcript,
                preferred_language=preferred_language,
                timeout=15,
                retries=1,
            )
            extraction_source = "gemma4"
        except Exception as exc:
            extracted = ctas_engine.fallback_extraction(transcript, preferred_language=preferred_language)
            raw_model = f"fallback_extraction_used: {exc}"
            extraction_source = "fallback"

        structured = merge_frontend_facts(extracted, payload, transcript)
        ctas_result = ctas_engine.evaluate_ctas(structured)
        similarity_review = build_similarity_review(case_id, structured, ctas_result)
        persist_case_record(case_id, structured, ctas_result)

        response = {
            "transcript": transcript,
            "extractionSource": extraction_source,
            "rawModelOutput": raw_model,
            "structured": structured,
            "ctas": ctas_result,
            "similarityReview": similarity_review,
        }
        self._set_headers(200)
        self.wfile.write(json.dumps(response).encode("utf-8"))


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Backend listening on http://{HOST}:{PORT}")
    server.serve_forever()
