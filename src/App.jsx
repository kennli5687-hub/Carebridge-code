import React, { useState } from "react";
import {
  Volume2,
  Languages,
  ChevronRight,
  ArrowLeft,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  ArrowLeftRight
} from "lucide-react";

const EMPTY_MEDICAL_DATA = {
  name: "",
  birthDate: "",
  idMethod: "scan",
  idNumber: "",
  idScanned: false,
  allergies: [],
  allergiesOther: "",
  history: [],
  historyOther: "",
  onset: "",
  onsetOther: "",
  severity: 5,
  painType: "",
  painTypeOther: "",
  painLocation: [],
  breathingDifficulty: "",
  lostConsciousness: "",
  updateOther: "",
  followUpAnswer: "",
  followUpOther: ""
};

const NONE_VALUES = ["None"];

const content = {
  en: {
    title: "Carebridge Triage",
    next: "Next Step",
    finish: "Show to Nurse",
    verify: "Verify and Continue",
    save: "Save Updates",
    other: "Other",
    otherPlaceholder: "Type details here",
    history: "Medical History",
    allergies: "Allergies",
    historyPrompts: ["Diabetes", "High Blood Pressure", "Heart Disease", "Asthma", "Stroke", "Other", "None"],
    allergyPrompts: ["Penicillin", "Latex", "Peanuts", "Contrast Dye", "Sulfa", "Other", "None"],
    painTypes: ["Sharp", "Dull", "Pressure", "Burning", "Cramping", "Other"],
    onsets: ["Suddenly", "Gradually", "After an injury", "Other"],
    locationLabel: "Where is the issue?",
    followUpTitle: "Focused Question",
    followUpLabel: "Based on the area you selected, answer this next question.",
    followUpSummary: "Focused Answer",
    severityLabel: "Pain Severity (0-10)",
    onsetLabel: "Onset",
    sensationLabel: "Sensation",
    locations: ["Head", "Chest", "Abdomen", "Back", "Limbs", "Skin"],
    loginTitle: "Patient Check-In",
    loginHelp: "Confirm identity before starting triage.",
    editTitle: "Clinical Update",
    editHelp: "Record symptom changes without going back through check-in.",
    updateLocationLabel: "Where is the issue now?",
    updateLostConsciousness: "Has there been any loss of consciousness?",
    updateBreathing: "Is there any difficulty breathing?",
    yes: "Yes",
    no: "No",
    updateOtherLabel: "Other important change",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter patient name",
    birthDateLabel: "Date of Birth",
    idCheckLabel: "ID Check",
    idScan: "Scan ID",
    idManual: "Manual Entry",
    idScanHelp: "Use a photo ID or health card at the kiosk scanner.",
    idScanReady: "ID captured successfully.",
    idScanAction: "Scan ID Now",
    idNumberLabel: "ID Number",
    idNumberPlaceholder: "Enter health card or patient ID",
    selectLanguage: "Select Language",
    selectLanguageHelp: "To provide the most accurate triage info.",
    symptomCheck: "Symptom check",
    presentImmediately: "Present this screen to the nurse immediately upon arrival.",
    status: "Status",
    location: "Location",
    painIndex: "Pain Index",
    feelingOnset: "Feeling and Onset",
    unspecified: "Unspecified",
    noneReported: "None Reported",
    clearSession: "Clear and Start New Session",
    updateInfo: "Update Your Information",
    scale: "Scale",
    painDescriptors: [
      "No pain at rest",
      "Barely noticeable, like a small bruise",
      "Minor ache, like a light headache",
      "Noticeable soreness, like a stubbed toe",
      "Steady pain, like a strong muscle cramp",
      "Hard to ignore, like a bad sprain",
      "Sharp enough to interrupt conversation",
      "Severe pain, hard to focus or sit still",
      "Very severe, limiting movement or deep breaths",
      "Overwhelming pain, close to unbearable",
      "Worst pain imaginable, needs urgent help"
    ],
    triageScore: "Triage Score",
    nurseLogin: "Login as Nurse",
    nurseDashboard: "Nurse Dashboard",
    nurseQueue: "Active Queue",
    nurseEmpty: "No patients are currently waiting in the queue.",
    loadDemoCases: "Load Demo Cases",
    patientView: "Patient View",
    triageOverrideTitle: "Nurse CTAS Override",
    triageOverrideHelp: "Upgrade or downgrade the CTAS level with a short clinical reason.",
    triageOverridePlaceholder: "Short reason for changing CTAS level",
    triageUpgrade: "Upgrade",
    triageDowngrade: "Downgrade",
    triageLocked: "Manual override locked",
    triageOverrideReason: "Override Reason",
    triageNurseAdjusted: "Nurse adjusted",
    discrepancyReview: "Discrepancy Review",
    discrepancyAlert: "Nurse review requested",
    discrepancyClear: "Similarity check within 1 CTAS level.",
    discrepancyReason: "Review Reason",
    similarCase: "Similar Case",
    markWaiting: "Mark Waiting",
    markInReview: "Mark In Review",
    markReady: "Mark Ready",
    lastUpdated: "Last Updated",
    intakeMethod: "Intake Method",
    triageLevel: (severity) => `${6 - Math.min(5, Math.max(1, Math.ceil((severity + 1) / 2)))}/5 TRIAGE REQ.`
  }
};

content.en = {
  ...content.en,
  submitting: "Submitting...",
  updating: "Updating...",
  reasoning: "Reasoning",
  painScaleMin: "0 No pain",
  painScaleMax: "10 Worst",
  optionLabels: {
    Diabetes: "Diabetes",
    "High Blood Pressure": "High Blood Pressure",
    "Heart Disease": "Heart Disease",
    Asthma: "Asthma",
    Stroke: "Stroke",
    Penicillin: "Penicillin",
    Latex: "Latex",
    Peanuts: "Peanuts",
    "Contrast Dye": "Contrast Dye",
    Sulfa: "Sulfa",
    Sharp: "Sharp",
    Dull: "Dull",
    Pressure: "Pressure",
    Burning: "Burning",
    Cramping: "Cramping",
    Suddenly: "Suddenly",
    Gradually: "Gradually",
    "After an injury": "After an injury",
    Head: "Head",
    Chest: "Chest",
    Abdomen: "Abdomen",
    Back: "Back",
    Limbs: "Limbs",
    Skin: "Skin",
    Other: "Other",
    None: "None",
    Yes: "Yes",
    No: "No",
    "Sudden severe headache": "Sudden severe headache",
    "Dizziness or faint feeling": "Dizziness or faint feeling",
    "Blurred vision": "Blurred vision",
    "Mild steady headache": "Mild steady headache",
    "Pressure spreading to arm or jaw": "Pressure spreading to arm or jaw",
    "Pain with deep breathing": "Pain with deep breathing",
    "Fast heartbeat or pounding": "Fast heartbeat or pounding",
    "Mild soreness with movement": "Mild soreness with movement",
    "Nausea or vomiting": "Nausea or vomiting",
    "Sharp pain in one spot": "Sharp pain in one spot",
    "Cramping that comes and goes": "Cramping that comes and goes",
    "Bloated or burning feeling": "Bloated or burning feeling",
    "Pain shooting down a leg": "Pain shooting down a leg",
    "Stiffness after lifting": "Stiffness after lifting",
    "Mid-back ache with breathing": "Mid-back ache with breathing",
    "Lower back spasm": "Lower back spasm",
    "Numbness or tingling": "Numbness or tingling",
    "Swelling after injury": "Swelling after injury",
    "Cannot put weight on it": "Cannot put weight on it",
    "Muscle ache or cramp": "Muscle ache or cramp",
    "New spreading rash": "New spreading rash",
    "Burning or blistering": "Burning or blistering",
    "Cut that will not stop bleeding": "Cut that will not stop bleeding",
    "Itching or irritation": "Itching or irritation"
  },
  followUpQuestions: {
    Head: "Which head symptom fits best?",
    Chest: "Which chest symptom fits best?",
    Abdomen: "Which stomach or abdomen symptom fits best?",
    Back: "Which back symptom fits best?",
    Limbs: "Which arm or leg symptom fits best?",
    Skin: "Which skin symptom fits best?"
  }
};

content.pb = {
  ...content.en,
  title: "ਕੇਅਰਬ੍ਰਿਜ ਟ੍ਰਾਇਅਜ",
  next: "ਅਗਲਾ ਕਦਮ",
  finish: "ਨਰਸ ਨੂੰ ਦਿਖਾਓ",
  verify: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ",
  save: "ਅਪਡੇਟ ਸੰਭਾਲੋ",
  other: "ਹੋਰ",
  otherPlaceholder: "ਇੱਥੇ ਵੇਰਵਾ ਲਿਖੋ",
  history: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
  allergies: "ਐਲਰਜੀਆਂ",
  locationLabel: "ਸਮੱਸਿਆ ਕਿੱਥੇ ਹੈ?",
  followUpTitle: "ਵਾਧੂ ਸਵਾਲ",
  followUpLabel: "ਚੁਣੀ ਹੋਈ ਜਗ੍ਹਾ ਦੇ ਆਧਾਰ 'ਤੇ ਇਹ ਸਵਾਲ ਜਵਾਬ ਦਿਓ।",
  followUpSummary: "ਫੋਕਸ ਜਵਾਬ",
  severityLabel: "ਦਰਦ ਦੀ ਤੀਬਰਤਾ (0-10)",
  onsetLabel: "ਸ਼ੁਰੂਆਤ",
  sensationLabel: "ਅਹਿਸਾਸ",
  loginTitle: "ਮਰੀਜ਼ ਚੈੱਕ-ਇਨ",
  loginHelp: "ਟ੍ਰਾਇਅਜ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਪਛਾਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
  editTitle: "ਕਲੀਨਿਕਲ ਅਪਡੇਟ",
  editHelp: "ਚੈੱਕ-ਇਨ 'ਤੇ ਵਾਪਸ ਗਏ ਬਿਨਾਂ ਲੱਛਣਾਂ ਦੇ ਬਦਲਾਵ ਦਰਜ ਕਰੋ।",
  updateLocationLabel: "ਹੁਣ ਸਮੱਸਿਆ ਕਿੱਥੇ ਹੈ?",
  updateLostConsciousness: "ਕੀ ਬੇਹੋਸ਼ੀ ਹੋਈ ਹੈ?",
  updateBreathing: "ਕੀ ਸਾਹ ਲੈਣ ਵਿੱਚ ਦਿੱਕਤ ਹੈ?",
  yes: "ਹਾਂ",
  no: "ਨਹੀਂ",
  updateOtherLabel: "ਹੋਰ ਮਹੱਤਵਪੂਰਨ ਬਦਲਾਵ",
  fullName: "ਪੂਰਾ ਨਾਮ",
  fullNamePlaceholder: "ਮਰੀਜ਼ ਦਾ ਨਾਮ ਲਿਖੋ",
  birthDateLabel: "ਜਨਮ ਮਿਤੀ",
  idCheckLabel: "ਆਈਡੀ ਜਾਂਚ",
  idScan: "ਆਈਡੀ ਸਕੈਨ ਕਰੋ",
  idManual: "ਹੱਥੋਂ ਦਾਖਲ ਕਰੋ",
  idScanHelp: "ਕਿਓਸਕ ਸਕੈਨਰ 'ਤੇ ਫੋਟੋ ਆਈਡੀ ਜਾਂ ਹੈਲਥ ਕਾਰਡ ਵਰਤੋਂ।",
  idScanReady: "ਆਈਡੀ ਸਫਲਤਾਪੂਰਵਕ ਕੈਪਚਰ ਹੋ ਗਈ।",
  idScanAction: "ਹੁਣ ਆਈਡੀ ਸਕੈਨ ਕਰੋ",
  idNumberLabel: "ਆਈਡੀ ਨੰਬਰ",
  idNumberPlaceholder: "ਹੈਲਥ ਕਾਰਡ ਜਾਂ ਮਰੀਜ਼ ਆਈਡੀ ਭਰੋ",
  selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
  selectLanguageHelp: "ਸਭ ਤੋਂ ਸਹੀ ਟ੍ਰਾਇਅਜ ਜਾਣਕਾਰੀ ਲਈ।",
  symptomCheck: "ਲੱਛਣ ਜਾਂਚ",
  presentImmediately: "ਪਹੁੰਚਦੇ ਹੀ ਇਹ ਸਕ੍ਰੀਨ ਤੁਰੰਤ ਨਰਸ ਨੂੰ ਦਿਖਾਓ।",
  status: "ਸਥਿਤੀ",
  location: "ਸਥਾਨ",
  painIndex: "ਦਰਦ ਸੂਚਕ",
  feelingOnset: "ਅਹਿਸਾਸ ਅਤੇ ਸ਼ੁਰੂਆਤ",
  unspecified: "ਨਿਰਧਾਰਤ ਨਹੀਂ",
  noneReported: "ਕੁਝ ਨਹੀਂ ਦੱਸਿਆ",
  clearSession: "ਸਭ ਮਿਟਾਓ ਅਤੇ ਨਵਾਂ ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ",
  updateInfo: "ਆਪਣੀ ਜਾਣਕਾਰੀ ਅਪਡੇਟ ਕਰੋ",
  scale: "ਪੈਮਾਨਾ",
  submitting: "ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
  updating: "ਅਪਡੇਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
  reasoning: "ਕਾਰਨ",
  painScaleMin: "0 ਕੋਈ ਦਰਦ ਨਹੀਂ",
  painScaleMax: "10 ਸਭ ਤੋਂ ਵੱਧ ਦਰਦ",
  optionLabels: {
    ...content.en.optionLabels,
    Diabetes: "ਸ਼ੂਗਰ",
    "High Blood Pressure": "ਉੱਚ ਰਕਤਚਾਪ",
    "Heart Disease": "ਦਿਲ ਦੀ ਬਿਮਾਰੀ",
    Asthma: "ਦਮਾ",
    Stroke: "ਸਟ੍ਰੋਕ",
    Penicillin: "ਪੇਨਿਸਿਲਿਨ",
    Latex: "ਲੇਟੈਕਸ",
    Peanuts: "ਮੂੰਗਫਲੀ",
    "Contrast Dye": "ਕਾਨਟ੍ਰਾਸਟ ਡਾਈ",
    Sulfa: "ਸਲਫਾ",
    Sharp: "ਤੇਜ਼",
    Dull: "ਮੰਦ",
    Pressure: "ਦਬਾਅ",
    Burning: "ਜਲਣ",
    Cramping: "ਐਂਠਣ",
    Suddenly: "ਅਚਾਨਕ",
    Gradually: "ਹੌਲੀ ਹੌਲੀ",
    "After an injury": "ਚੋਟ ਤੋਂ ਬਾਅਦ",
    Head: "ਸਿਰ",
    Chest: "ਛਾਤੀ",
    Abdomen: "ਪੇਟ",
    Back: "ਪਿੱਠ",
    Limbs: "ਬਾਂਹਾਂ / ਟੰਗਾਂ",
    Skin: "ਚਮੜੀ",
    Other: "ਹੋਰ",
    None: "ਕੋਈ ਨਹੀਂ",
    Yes: "ਹਾਂ",
    No: "ਨਹੀਂ"
  },
  followUpQuestions: {
    Head: "ਸਿਰ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਲੱਛਣ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ?",
    Chest: "ਛਾਤੀ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਲੱਛਣ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ?",
    Abdomen: "ਪੇਟ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਲੱਛਣ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ?",
    Back: "ਪਿੱਠ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਲੱਛਣ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ?",
    Limbs: "ਬਾਂਹ ਜਾਂ ਟੰਗ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਲੱਛਣ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ?",
    Skin: "ਚਮੜੀ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜਾ ਲੱਛਣ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ?"
  }
};
content.zh = {
  ...content.en,
  title: "Carebridge 分诊",
  next: "下一步",
  finish: "出示给护士",
  verify: "确认并继续",
  save: "保存更新",
  other: "其他",
  otherPlaceholder: "请在此输入详情",
  history: "病史",
  allergies: "过敏史",
  locationLabel: "哪里不舒服？",
  followUpTitle: "补充问题",
  followUpLabel: "根据你选择的部位，请回答下一个问题。",
  followUpSummary: "补充回答",
  severityLabel: "疼痛程度 (0-10)",
  onsetLabel: "起病方式",
  sensationLabel: "感觉",
  loginTitle: "患者登记",
  loginHelp: "开始分诊前请先确认身份。",
  editTitle: "临床更新",
  editHelp: "无需回到登记页即可记录症状变化。",
  updateLocationLabel: "现在哪里不舒服？",
  updateLostConsciousness: "是否出现过失去意识？",
  updateBreathing: "是否呼吸困难？",
  yes: "是",
  no: "否",
  updateOtherLabel: "其他重要变化",
  fullName: "姓名",
  fullNamePlaceholder: "请输入患者姓名",
  birthDateLabel: "出生日期",
  idCheckLabel: "证件核验",
  idScan: "扫描证件",
  idManual: "手动输入",
  idScanHelp: "请在自助机扫描照片证件或医保卡。",
  idScanReady: "证件已成功读取。",
  idScanAction: "立即扫描证件",
  idNumberLabel: "证件号码",
  idNumberPlaceholder: "输入医保卡或患者编号",
  selectLanguage: "选择语言",
  selectLanguageHelp: "以提供更准确的分诊信息。",
  symptomCheck: "症状检查",
  presentImmediately: "到达后请立即将此页面出示给护士。",
  status: "状态",
  location: "部位",
  painIndex: "疼痛指数",
  feelingOnset: "感觉与起病",
  unspecified: "未说明",
  noneReported: "未报告",
  clearSession: "清除并开始新会话",
  updateInfo: "更新你的信息",
  scale: "量表",
  submitting: "提交中...",
  updating: "更新中...",
  reasoning: "判定依据",
  painScaleMin: "0 无疼痛",
  painScaleMax: "10 最严重",
  optionLabels: {
    ...content.en.optionLabels,
    Diabetes: "糖尿病",
    "High Blood Pressure": "高血压",
    "Heart Disease": "心脏病",
    Asthma: "哮喘",
    Stroke: "中风",
    Penicillin: "青霉素",
    Latex: "乳胶",
    Peanuts: "花生",
    "Contrast Dye": "造影剂",
    Sulfa: "磺胺",
    Sharp: "刺痛",
    Dull: "钝痛",
    Pressure: "压迫感",
    Burning: "灼烧感",
    Cramping: "绞痛",
    Suddenly: "突然",
    Gradually: "逐渐",
    "After an injury": "受伤后",
    Head: "头部",
    Chest: "胸部",
    Abdomen: "腹部",
    Back: "背部",
    Limbs: "四肢",
    Skin: "皮肤",
    Other: "其他",
    None: "无",
    Yes: "是",
    No: "否"
  },
  followUpQuestions: {
    Head: "以下哪种头部症状最符合？",
    Chest: "以下哪种胸部症状最符合？",
    Abdomen: "以下哪种腹部症状最符合？",
    Back: "以下哪种背部症状最符合？",
    Limbs: "以下哪种四肢症状最符合？",
    Skin: "以下哪种皮肤症状最符合？"
  }
};
content.tl = {
  ...content.en,
  next: "Susunod",
  finish: "Ipakita sa Nurse",
  verify: "Kumpirmahin at Magpatuloy",
  save: "I-save ang Updates",
  other: "Iba pa",
  otherPlaceholder: "I-type ang detalye dito",
  history: "Kasaysayang Medikal",
  allergies: "Mga Allergy",
  locationLabel: "Saan ang problema?",
  followUpTitle: "Dagdag na Tanong",
  followUpLabel: "Batay sa napiling bahagi, sagutin ang susunod na tanong na ito.",
  followUpSummary: "Dagdag na Sagot",
  severityLabel: "Tindi ng Sakit (0-10)",
  onsetLabel: "Pagsisimula",
  sensationLabel: "Pakiramdam",
  loginTitle: "Patient Check-In",
  loginHelp: "Kumpirmahin ang pagkakakilanlan bago magsimula ang triage.",
  editTitle: "Clinical Update",
  editHelp: "I-record ang pagbabago ng sintomas nang hindi bumabalik sa check-in.",
  updateLocationLabel: "Saan na ang problema ngayon?",
  updateLostConsciousness: "Nagkaroon ba ng pagkawala ng malay?",
  updateBreathing: "May hirap ba sa paghinga?",
  yes: "Oo",
  no: "Hindi",
  updateOtherLabel: "Iba pang mahalagang pagbabago",
  fullName: "Buong Pangalan",
  fullNamePlaceholder: "Ilagay ang pangalan ng pasyente",
  birthDateLabel: "Petsa ng Kapanganakan",
  idCheckLabel: "Pag-check ng ID",
  idScan: "I-scan ang ID",
  idManual: "Manwal na Input",
  idScanHelp: "Gamitin ang photo ID o health card sa kiosk scanner.",
  idScanReady: "Matagumpay na nakuha ang ID.",
  idScanAction: "I-scan ang ID Ngayon",
  idNumberLabel: "ID Number",
  idNumberPlaceholder: "Ilagay ang health card o patient ID",
  selectLanguage: "Piliin ang Wika",
  selectLanguageHelp: "Para makapagbigay ng mas tumpak na triage info.",
  symptomCheck: "Pagsuri ng sintomas",
  presentImmediately: "Ipakita agad ang screen na ito sa nurse pagdating.",
  status: "Katayuan",
  location: "Lokasyon",
  painIndex: "Antas ng Sakit",
  feelingOnset: "Pakiramdam at Simula",
  unspecified: "Hindi tinukoy",
  noneReported: "Walang naiulat",
  clearSession: "I-clear at Magsimula ng Bagong Session",
  updateInfo: "I-update ang Iyong Impormasyon",
  scale: "Sukatan",
  submitting: "Isinusumite...",
  updating: "Ina-update...",
  reasoning: "Batayan",
  painScaleMin: "0 Walang sakit",
  painScaleMax: "10 Pinakamasakit",
  nurseLogin: "Mag-login bilang Nurse",
  nurseEmpty: "Walang pasyenteng naghihintay sa queue ngayon.",
  loadDemoCases: "I-load ang Demo Cases",
  optionLabels: {
    ...content.en.optionLabels,
    "High Blood Pressure": "Mataas na Presyon",
    "Heart Disease": "Sakit sa Puso",
    Sharp: "Matalim",
    Dull: "Mapurol",
    Pressure: "May Diin",
    Burning: "Mahapdi",
    Cramping: "Pinupulikat",
    Suddenly: "Biglaan",
    Gradually: "Unti-unti",
    "After an injury": "Pagkatapos ng pinsala",
    Head: "Ulo",
    Chest: "Dibdib",
    Abdomen: "Tiyan",
    Back: "Likod",
    Limbs: "Braso / Binti",
    Skin: "Balat",
    Other: "Iba pa",
    None: "Wala",
    Yes: "Oo",
    No: "Hindi"
  },
  followUpQuestions: {
    Head: "Aling sintomas sa ulo ang pinakaangkop?",
    Chest: "Aling sintomas sa dibdib ang pinakaangkop?",
    Abdomen: "Aling sintomas sa tiyan ang pinakaangkop?",
    Back: "Aling sintomas sa likod ang pinakaangkop?",
    Limbs: "Aling sintomas sa braso o binti ang pinakaangkop?",
    Skin: "Aling sintomas sa balat ang pinakaangkop?"
  }
};

const languageOptions = [
  { id: "en", label: "English", sub: "Default" },
  { id: "pb", label: "ਪੰਜਾਬੀ", sub: "Punjabi" },
  { id: "zh", label: "中文", sub: "Mandarin / Cantonese" },
  { id: "tl", label: "Tagalog", sub: "Filipino" }
];

const statusTone = {
  waiting: "bg-amber-50 text-amber-700 border-amber-200",
  reviewing: "bg-blue-50 text-blue-700 border-blue-200",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200"
};

const BACKEND_URL = "http://127.0.0.1:8787";

const DEMO_CASES = [
  {
    id: "DEMO-001",
    patient: {
      ...EMPTY_MEDICAL_DATA,
      name: "Patient 1",
      birthDate: "1972-04-18",
      idMethod: "manual",
      idNumber: "HC-1001",
      history: ["High Blood Pressure"],
      historyDisplay: ["High Blood Pressure"],
      allergies: ["None"],
      allergyDisplay: ["None"],
      onset: "Suddenly",
      onsetDisplay: "Suddenly",
      severity: 9,
      painType: "Pressure",
      painTypeDisplay: "Pressure",
      painLocation: ["Chest"],
      breathingDifficulty: "Yes",
      lostConsciousness: "No",
      followUpAnswer: "Pressure spreading to arm or jaw",
      followUpDisplay: "Pressure spreading to arm or jaw",
      updateOther: "",
      updateOtherDisplay: ""
    },
    language: "en",
    triageScore: 2,
    nurseStatus: "waiting",
    updatedAt: "2026-05-08T09:10:00.000Z",
    backend: {
      ctas: {
        level: 2,
        title: "Emergent",
        modifiersApplied: [
          "Presenting complaint mapped to Cardiac features / chest pain.",
          "Chest pain with high-risk features."
        ]
      }
    }
  },
  {
    id: "DEMO-002",
    patient: {
      ...EMPTY_MEDICAL_DATA,
      name: "Patient 2",
      birthDate: "1995-11-02",
      idMethod: "scan",
      idScanned: true,
      idNumber: "SCAN-2002",
      history: ["Asthma"],
      historyDisplay: ["Asthma"],
      allergies: ["Peanuts"],
      allergyDisplay: ["Peanuts"],
      onset: "Gradually",
      onsetDisplay: "Gradually",
      severity: 7,
      painType: "Burning",
      painTypeDisplay: "Burning",
      painLocation: ["Chest", "Skin"],
      breathingDifficulty: "Yes",
      lostConsciousness: "No",
      followUpAnswer: "Pain with deep breathing",
      followUpDisplay: "Pain with deep breathing",
      updateOther: "Using rescue inhaler more often today.",
      updateOtherDisplay: "Using rescue inhaler more often today."
    },
    language: "en",
    triageScore: 3,
    nurseStatus: "reviewing",
    updatedAt: "2026-05-08T09:18:00.000Z",
    backend: {
      ctas: {
        level: 3,
        title: "Urgent",
        modifiersApplied: [
          "Presenting complaint mapped to Shortness of breath.",
          "Respiratory compromise modifier."
        ]
      }
    }
  },
  {
    id: "DEMO-003",
    patient: {
      ...EMPTY_MEDICAL_DATA,
      name: "Patient 3",
      birthDate: "2008-07-23",
      idMethod: "manual",
      idNumber: "HC-3003",
      history: ["None"],
      historyDisplay: ["None"],
      allergies: ["Latex"],
      allergyDisplay: ["Latex"],
      onset: "After an injury",
      onsetDisplay: "After an injury",
      severity: 6,
      painType: "Sharp",
      painTypeDisplay: "Sharp",
      painLocation: ["Limbs"],
      breathingDifficulty: "No",
      lostConsciousness: "No",
      followUpAnswer: "Cannot put weight on it",
      followUpDisplay: "Cannot put weight on it",
      updateOther: "Rolled ankle during basketball.",
      updateOtherDisplay: "Rolled ankle during basketball."
    },
    language: "en",
    triageScore: 4,
    nurseStatus: "waiting",
    updatedAt: "2026-05-08T09:26:00.000Z",
    backend: {
      ctas: {
        level: 4,
        title: "Less urgent",
        modifiersApplied: [
          "Presenting complaint mapped to Limb pain / minor limb injury."
        ]
      }
    }
  },
  {
    id: "DEMO-004",
    patient: {
      ...EMPTY_MEDICAL_DATA,
      name: "Patient 4",
      birthDate: "1986-01-14",
      idMethod: "scan",
      idScanned: true,
      idNumber: "SCAN-4004",
      history: ["Diabetes"],
      historyDisplay: ["Diabetes"],
      allergies: ["Sulfa"],
      allergyDisplay: ["Sulfa"],
      onset: "Suddenly",
      onsetDisplay: "Suddenly",
      severity: 8,
      painType: "Dull",
      painTypeDisplay: "Dull",
      painLocation: ["Head"],
      breathingDifficulty: "No",
      lostConsciousness: "Yes",
      followUpAnswer: "Dizziness or faint feeling",
      followUpDisplay: "Dizziness or faint feeling",
      updateOther: "Brief blackout at home before arrival.",
      updateOtherDisplay: "Brief blackout at home before arrival."
    },
    language: "en",
    triageScore: 2,
    nurseStatus: "waiting",
    updatedAt: "2026-05-08T09:31:00.000Z",
    backend: {
      ctas: {
        level: 2,
        title: "Emergent",
        modifiersApplied: [
          "Presenting complaint mapped to Stroke-like neurologic complaint.",
          "Altered mental status."
        ]
      }
    }
  },
  {
    id: "DEMO-005",
    patient: {
      ...EMPTY_MEDICAL_DATA,
      name: "Patient 5",
      birthDate: "1961-09-30",
      idMethod: "manual",
      idNumber: "HC-5005",
      history: ["Heart Disease", "Other"],
      historyOther: "Prior bypass surgery",
      historyDisplay: ["Heart Disease", "Prior bypass surgery"],
      allergies: ["Contrast Dye"],
      allergyDisplay: ["Contrast Dye"],
      onset: "Gradually",
      onsetDisplay: "Gradually",
      severity: 5,
      painType: "Cramping",
      painTypeDisplay: "Cramping",
      painLocation: ["Abdomen", "Back"],
      breathingDifficulty: "No",
      lostConsciousness: "No",
      followUpAnswer: "Sharp pain in one spot",
      followUpDisplay: "Sharp pain in one spot",
      updateOther: "Pain worsened after breakfast.",
      updateOtherDisplay: "Pain worsened after breakfast."
    },
    language: "en",
    triageScore: 3,
    nurseStatus: "ready",
    updatedAt: "2026-05-08T09:40:00.000Z",
    backend: {
      ctas: {
        level: 3,
        title: "Urgent",
        modifiersApplied: [
          "Presenting complaint mapped to Abdominal or pelvic pain.",
          "Abdominal complaint with moderate pain or high-risk GI features."
        ]
      }
    }
  }
];

const followUpByLocation = {
  Head: {
    question: "Which head symptom fits best?",
    options: ["Sudden severe headache", "Dizziness or faint feeling", "Blurred vision", "Mild steady headache", "Other"]
  },
  Chest: {
    question: "Which chest symptom fits best?",
    options: ["Pressure spreading to arm or jaw", "Pain with deep breathing", "Fast heartbeat or pounding", "Mild soreness with movement", "Other"]
  },
  Abdomen: {
    question: "Which stomach or abdomen symptom fits best?",
    options: ["Nausea or vomiting", "Sharp pain in one spot", "Cramping that comes and goes", "Bloated or burning feeling", "Other"]
  },
  Back: {
    question: "Which back symptom fits best?",
    options: ["Pain shooting down a leg", "Stiffness after lifting", "Mid-back ache with breathing", "Lower back spasm", "Other"]
  },
  Limbs: {
    question: "Which arm or leg symptom fits best?",
    options: ["Numbness or tingling", "Swelling after injury", "Cannot put weight on it", "Muscle ache or cramp", "Other"]
  },
  Skin: {
    question: "Which skin symptom fits best?",
    options: ["New spreading rash", "Burning or blistering", "Cut that will not stop bleeding", "Itching or irritation", "Other"]
  },
  Everywhere: {
    question: "Which whole-body symptom fits best?",
    options: ["Fever or chills", "Weakness all over", "Widespread body aches", "Shortness of breath with fatigue", "Other"]
  }
};

function App() {
  const [lang, setLang] = useState(null);
  const [step, setStep] = useState("language");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [medicalData, setMedicalData] = useState(EMPTY_MEDICAL_DATA);
  const [view, setView] = useState("patient");
  const [cases, setCases] = useState([]);
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [isSubmittingTriage, setIsSubmittingTriage] = useState(false);
  const [triageError, setTriageError] = useState("");
  const [triageOverrideDrafts, setTriageOverrideDrafts] = useState({});

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const t = lang && content[lang] ? { ...content.en, ...content[lang] } : content.en;
  const translateOption = (value) => t.optionLabels?.[value] || value;
  const formatTranslatedList = (items) => items.map((item) => translateOption(item)).join(", ");
  const activeCase = cases.find((item) => item.id === activeCaseId) || null;
  const sortedCases = [...cases].sort((a, b) => {
    if (a.triageScore !== b.triageScore) {
      return a.triageScore - b.triageScore;
    }
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });
  const selectedLocations = medicalData.painLocation;
  const followUpLocations = selectedLocations.length > 0 ? selectedLocations : ["Head"];
  const followUpQuestion =
    followUpLocations.length === 1
      ? t.followUpQuestions?.[followUpLocations[0]] || followUpByLocation[followUpLocations[0]]?.question || "Which symptom best matches what you feel?"
      : `${t.followUpTitle}: ${formatTranslatedList(followUpLocations)}`;
  const followUpOptions = Array.from(
    new Set(
      followUpLocations.flatMap((location) => followUpByLocation[location]?.options || []).concat(["Other"])
    )
  );

  const getTriageScore = (severity) => 6 - Math.min(5, Math.max(1, Math.ceil((severity + 1) / 2)));
  const getCaseTriageLabel = (caseItem) => {
    if (!caseItem) return t.triageLevel(medicalData.severity);
    const title = caseItem.manualTriageOverride?.reason ? t.triageNurseAdjusted : caseItem.backend?.ctas?.title;
    return title ? `CTAS ${caseItem.triageScore} | ${title}` : `CTAS ${caseItem.triageScore}`;
  };

  const speakText = async (text) => {
    if (!text || isSpeaking || !apiKey) return;

    setIsSpeaking(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Kore"
                  }
                }
              }
            }
          })
        }
      );

      const result = await response.json();
      const audioData = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) throw new Error("No audio data returned from TTS.");

      const audioBlob = pcmToWav(audioData, 24000);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      };
      await audio.play();
    } catch (error) {
      console.error("Speech error", error);
      setIsSpeaking(false);
    }
  };

  const pcmToWav = (base64, sampleRate) => {
    const buffer = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)).buffer;
    const wav = new Uint8Array(44 + buffer.byteLength);
    const viewData = new DataView(wav.buffer);

    viewData.setUint32(0, 0x52494646, false);
    viewData.setUint32(4, 36 + buffer.byteLength, true);
    viewData.setUint32(8, 0x57415645, false);
    viewData.setUint32(12, 0x666d7420, false);
    viewData.setUint16(16, 16, true);
    viewData.setUint16(20, 1, true);
    viewData.setUint16(22, 1, true);
    viewData.setUint32(24, sampleRate, true);
    viewData.setUint32(28, sampleRate * 2, true);
    viewData.setUint16(32, 2, true);
    viewData.setUint16(34, 16, true);
    viewData.setUint32(36, 0x64617461, false);
    viewData.setUint32(40, buffer.byteLength, true);
    wav.set(new Uint8Array(buffer), 44);

    return new Blob([wav], { type: "audio/wav" });
  };

  const toggleSelection = (key, value) => {
    setMedicalData((prev) => {
      const list = prev[key];
      if (NONE_VALUES.includes(value)) {
        return { ...prev, [key]: [value] };
      }

      const nextList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list.filter((item) => !NONE_VALUES.includes(item)), value];

      return { ...prev, [key]: nextList };
    });
  };

  const toggleLocationSelection = (value) => {
    setMedicalData((prev) => {
      const list = prev.painLocation;
      const nextList = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...prev, painLocation: nextList, followUpAnswer: "", followUpOther: "" };
    });
  };

  const getDisplayList = (items, otherValue) => {
    const baseItems = items.filter((item) => item !== "Other");
    return otherValue.trim() ? [...baseItems, otherValue.trim()] : baseItems;
  };

  const updateData = (key, value) => {
    setMedicalData((prev) => ({ ...prev, [key]: value }));
  };

  const maskIdNumber = (value) => {
    if (!value) return t.unspecified;
    const trimmed = value.trim();
    if (trimmed.length <= 4) return trimmed;
    return `**** ${trimmed.slice(-4)}`;
  };

  const formatTime = (value) => new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const getPainDescriptor = (severity) => t.painDescriptors?.[severity] || `${severity}/10`;

  const buildSubmissionPayload = () => {
    const historyDisplay = getDisplayList(medicalData.history, medicalData.historyOther);
    const allergyDisplay = getDisplayList(medicalData.allergies, medicalData.allergiesOther);
    const onsetDisplay = medicalData.onset === "Other" ? medicalData.onsetOther.trim() : medicalData.onset;
    const painTypeDisplay = medicalData.painType === "Other" ? medicalData.painTypeOther.trim() : medicalData.painType;
    const followUpDisplay =
      medicalData.followUpAnswer === "Other" ? medicalData.followUpOther.trim() : medicalData.followUpAnswer;
    const updateOtherDisplay = medicalData.updateOther.trim();

    return {
      ...medicalData,
      caseId: activeCaseId || null,
      preferredLanguage: lang || "en",
      historyDisplay,
      allergyDisplay,
      onsetDisplay,
      painTypeDisplay,
      followUpDisplay,
      updateOtherDisplay
    };
  };

  const syncCaseRecord = (backendResult = null) => {
    const now = new Date().toISOString();
    const nextCaseId = activeCaseId || `CB-${Date.now().toString().slice(-6)}`;
    const existingCase = cases.find((item) => item.id === nextCaseId);
    const existingStatus = existingCase?.nurseStatus || "waiting";
    const submissionPayload = buildSubmissionPayload();
    const lockedOverride = existingCase?.manualTriageOverride?.reason ? existingCase.manualTriageOverride : null;

    const payload = {
      id: nextCaseId,
      patient: submissionPayload,
      language: lang || "en",
      triageScore: lockedOverride ? existingCase.triageScore : backendResult?.ctas?.level ?? getTriageScore(medicalData.severity),
      backend: lockedOverride ? existingCase.backend : backendResult,
      manualTriageOverride: lockedOverride,
      nurseStatus:
        existingStatus !== "waiting"
          ? existingStatus
          : backendResult?.similarityReview?.nurseReviewRequired
            ? "reviewing"
            : existingStatus,
      updatedAt: now
    };

    setCases((prev) => {
      const exists = prev.some((item) => item.id === nextCaseId);
      if (exists) {
        return prev.map((item) => (item.id === nextCaseId ? payload : item));
      }
      return [payload, ...prev];
    });

    setActiveCaseId(nextCaseId);
  };

  const submitTriage = async () => {
    setIsSubmittingTriage(true);
    setTriageError("");
    try {
      const response = await fetch(`${BACKEND_URL}/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSubmissionPayload())
      });

      if (!response.ok) {
        throw new Error(`Backend triage request failed with ${response.status}`);
      }

      const backendResult = await response.json();
      syncCaseRecord(backendResult);
      setStep("summary");
    } catch (error) {
      console.error(error);
      setTriageError("Backend triage is unavailable right now. Please verify the local Python service is running.");
      syncCaseRecord(null);
      setStep("summary");
    } finally {
      setIsSubmittingTriage(false);
    }
  };

  const resetSession = () => {
    setLang(null);
    setStep("language");
    setView("patient");
    setActiveCaseId(null);
    setMedicalData(EMPTY_MEDICAL_DATA);
  };

  const handleLanguageSelect = (languageId) => {
    setLang(languageId);
    setStep("login");
  };

  const updateCaseStatus = (caseId, status) => {
    if (!caseId) return;
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId ? { ...item, nurseStatus: status, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const updateTriageOverrideDraft = (caseId, value) => {
    setTriageOverrideDrafts((prev) => ({
      ...prev,
      [caseId]: value
    }));
  };

  const applyTriageOverride = (caseId, direction) => {
    const draftReason = triageOverrideDrafts[caseId]?.trim();
    if (!caseId || !draftReason) return;

    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;
        const delta = direction === "upgrade" ? -1 : 1;
        const nextScore = Math.min(5, Math.max(1, item.triageScore + delta));
        if (nextScore === item.triageScore) return item;

        return {
          ...item,
          triageScore: nextScore,
          manualTriageOverride: {
            direction,
            reason: draftReason,
            previousLevel: item.triageScore,
            appliedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
      })
    );

    setTriageOverrideDrafts((prev) => ({
      ...prev,
      [caseId]: ""
    }));
  };

  const loadDemoCases = () => {
    setCases((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const nextCases = DEMO_CASES.filter((item) => !existingIds.has(item.id));
      return [...prev, ...nextCases];
    });
    setActiveCaseId((current) => current || DEMO_CASES[0]?.id || null);
    setView("nurse");
  };

  const canContinueToSummary = Boolean(
    medicalData.painLocation.length > 0 &&
      medicalData.onset &&
      medicalData.painType &&
      (medicalData.followUpAnswer === "Other" ? medicalData.followUpOther.trim() : medicalData.followUpAnswer)
  );
  const canVerifyPatient = Boolean(
    medicalData.name.trim() &&
      medicalData.birthDate &&
      (medicalData.idMethod === "scan" ? medicalData.idScanned : medicalData.idNumber.trim())
  );
  const canSaveClinicalUpdate = Boolean(
    medicalData.painLocation.length > 0 &&
      medicalData.lostConsciousness &&
      medicalData.breathingDifficulty &&
      medicalData.severity >= 0
  );
  const speakerLabel =
    step === "profile" ? t.history : step === "symptoms" || step === "followup" ? t.symptomCheck : t.title;
  const showBackNav = !["language", "login", "summary", "edit"].includes(step);

  const renderIntakeForm = (mode) => (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <ShieldAlert size={48} className="mx-auto mb-4 text-red-600" />
        <h2 className="text-2xl font-bold">{mode === "edit" ? t.editTitle : t.loginTitle}</h2>
        <p className="text-slate-500">{mode === "edit" ? t.editHelp : t.loginHelp}</p>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.fullName}</label>
          <input
            type="text"
            value={medicalData.name}
            onChange={(event) => updateData("name", event.target.value)}
            placeholder={t.fullNamePlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.birthDateLabel}</label>
          <input
            type="date"
            value={medicalData.birthDate}
            onChange={(event) => updateData("birthDate", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.idCheckLabel}</label>
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => updateData("idMethod", "scan")}
              className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                medicalData.idMethod === "scan" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              {t.idScan}
            </button>
            <button
              type="button"
              onClick={() => setMedicalData((prev) => ({ ...prev, idMethod: "manual", idScanned: false }))}
              className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                medicalData.idMethod === "manual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              {t.idManual}
            </button>
          </div>
        </div>

        {medicalData.idMethod === "scan" ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm text-slate-600">{t.idScanHelp}</p>
            <button
              type="button"
              onClick={() =>
                setMedicalData((prev) => ({
                  ...prev,
                  idScanned: true,
                  idNumber: prev.idNumber || "SCAN-4821"
                }))
              }
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            >
              {medicalData.idScanned ? t.idScanReady : t.idScanAction}
            </button>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.idNumberLabel}</label>
            <input
              type="text"
              value={medicalData.idNumber}
              onChange={(event) => updateData("idNumber", event.target.value)}
              placeholder={t.idNumberPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
        {medicalData.idMethod === "scan" && medicalData.idScanned
          ? t.idScanReady
          : medicalData.idMethod === "manual" && medicalData.idNumber.trim()
            ? `${t.idNumberLabel}: ${maskIdNumber(medicalData.idNumber)}`
            : t.idScanHelp}
      </div>

      <button
        type="button"
        disabled={!canVerifyPatient}
        onClick={() => {
          if (mode === "edit") {
            setStep("profile");
          } else {
            setStep("profile");
          }
        }}
        className={`flex w-full items-center justify-center gap-3 rounded-3xl py-5 font-black shadow-xl transition-all ${
          canVerifyPatient ? "bg-red-600 text-white shadow-red-100" : "bg-slate-200 text-slate-400"
        }`}
      >
        {mode === "edit" ? t.save : t.verify} <ChevronRight size={20} />
      </button>

      {mode === "login" && (
        <button
          type="button"
          onClick={() => setView("nurse")}
          className="flex w-full items-center justify-center gap-3 rounded-3xl border-2 border-slate-900 bg-slate-900 py-5 font-black text-white"
        >
          <ClipboardList size={18} /> {t.nurseLogin}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-panel backdrop-blur">
        <div className="flex shrink-0 items-center justify-between bg-red-600 p-6 pt-12 text-white">
          <div className="flex items-center gap-3">
            <ShieldAlert size={28} />
            <h1 className="text-xl font-black uppercase italic tracking-tight">{view === "nurse" ? t.nurseDashboard : t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {lang && view === "patient" && (
              <button
                type="button"
                onClick={() => speakText(speakerLabel)}
                disabled={!apiKey}
                title={apiKey ? "Speak section title" : "Add VITE_GEMINI_API_KEY to enable speech"}
                className={`rounded-full p-3 transition-colors ${
                  isSpeaking
                    ? "animate-pulse bg-white text-red-600"
                    : apiKey
                      ? "bg-red-500 text-white shadow-lg"
                      : "cursor-not-allowed bg-red-400/70 text-white/80"
                }`}
              >
                <Volume2 size={20} />
              </button>
            )}
            {view === "nurse" && (
              <button
                type="button"
                onClick={() => setView("patient")}
                className="rounded-full bg-red-500 p-3 text-white shadow-lg"
                title={t.patientView}
              >
                <ArrowLeftRight size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {view === "nurse" ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <h2 className="text-lg font-black text-slate-900">{t.nurseQueue}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {cases.length > 0 ? `${cases.length} patient case${cases.length > 1 ? "s" : ""} in queue.` : t.nurseEmpty}
                </p>
                <button
                  type="button"
                  onClick={loadDemoCases}
                  className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white"
                >
                  {t.loadDemoCases}
                </button>
              </div>

              {sortedCases.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  {t.nurseEmpty}
                </div>
              ) : (
                sortedCases.map((item) => (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-3xl border transition ${
                      activeCaseId === item.id ? "border-red-300 bg-red-50" : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 p-5">
                      <div>
                        <button
                          type="button"
                          onClick={() => setActiveCaseId((current) => (current === item.id ? null : item.id))}
                          className="text-left text-lg font-black text-slate-900"
                        >
                          {item.patient.name || t.unspecified}
                        </button>
                        <div className="mt-1 text-sm text-slate-500">
                          {item.id} | {formatTranslatedList(item.patient.painLocation) || t.unspecified} | CTAS {item.triageScore}
                        </div>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusTone[item.nurseStatus]}`}>
                        {item.backend?.similarityReview?.nurseReviewRequired ? t.discrepancyAlert : item.nurseStatus}
                      </span>
                    </div>

                    {activeCaseId === item.id && (
                      <div className="border-t border-red-100 bg-white p-5">
                        <div className="text-sm text-slate-500">
                          {item.id} | {t.lastUpdated} {formatTime(item.updatedAt)}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.triageScore}</div>
                            <div className="mt-1 text-lg font-bold text-red-600">
                              {getCaseTriageLabel(item)}
                            </div>
                            {item.manualTriageOverride?.reason && (
                              <div className="mt-2 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-700">
                                {t.triageLocked}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.intakeMethod}</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{item.patient.idMethod === "scan" ? t.idScan : t.idManual}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.location}</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{formatTranslatedList(item.patient.painLocation) || t.unspecified}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.painIndex}</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{item.patient.severity}/10</div>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-700">
                          {item.backend?.ctas?.modifiersApplied?.length > 0 && (
                            <div>{t.reasoning}: {item.backend.ctas.modifiersApplied.join(" | ")}</div>
                          )}
                          {item.backend?.similarityReview && (
                            <div>
                              {t.discrepancyReview}: {item.backend.similarityReview.reason}
                              {item.backend.similarityReview.similarCase
                                ? ` ${t.similarCase}: ${item.backend.similarityReview.similarCase.caseId} (CTAS ${item.backend.similarityReview.similarCase.ctasLevel}, score ${item.backend.similarityReview.similarCase.similarityScore}).`
                                : ""}
                            </div>
                          )}
                          {item.manualTriageOverride?.reason && (
                            <div>
                              {t.triageOverrideReason}: CTAS {item.manualTriageOverride.previousLevel} to CTAS {item.triageScore} | {item.manualTriageOverride.reason}
                            </div>
                          )}
                          <div>{translateOption(item.patient.painTypeDisplay || t.unspecified)} | {translateOption(item.patient.onsetDisplay || t.unspecified)}</div>
                          <div>{t.updateLostConsciousness}: {translateOption(item.patient.lostConsciousness || t.unspecified)}</div>
                          <div>{t.updateBreathing}: {translateOption(item.patient.breathingDifficulty || t.unspecified)}</div>
                          <div>{t.updateOtherLabel}: {item.patient.updateOtherDisplay || t.noneReported}</div>
                          <div>{t.followUpSummary}: {translateOption(item.patient.followUpDisplay || t.unspecified)}</div>
                          <div>{t.history}: {item.patient.historyDisplay.length > 0 ? formatTranslatedList(item.patient.historyDisplay) : t.noneReported}</div>
                          <div>{t.allergies}: {item.patient.allergyDisplay.length > 0 ? formatTranslatedList(item.patient.allergyDisplay) : t.noneReported}</div>
                        </div>

                        <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.triageOverrideTitle}</div>
                          <p className="mt-2 text-sm text-slate-600">{t.triageOverrideHelp}</p>
                          <textarea
                            value={triageOverrideDrafts[item.id] || ""}
                            onChange={(event) => updateTriageOverrideDraft(item.id, event.target.value)}
                            placeholder={t.triageOverridePlaceholder}
                            disabled={Boolean(item.manualTriageOverride?.reason)}
                            className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                              item.manualTriageOverride?.reason
                                ? "border-slate-200 bg-slate-100 text-slate-400"
                                : "border-slate-200 bg-white text-slate-900 focus:border-red-400"
                            }`}
                          />
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={Boolean(item.manualTriageOverride?.reason) || !triageOverrideDrafts[item.id]?.trim() || item.triageScore <= 1}
                              onClick={() => applyTriageOverride(item.id, "upgrade")}
                              className={`rounded-2xl px-3 py-3 text-xs font-black uppercase ${
                                item.manualTriageOverride?.reason || !triageOverrideDrafts[item.id]?.trim() || item.triageScore <= 1
                                  ? "bg-slate-200 text-slate-400"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {t.triageUpgrade}
                            </button>
                            <button
                              type="button"
                              disabled={Boolean(item.manualTriageOverride?.reason) || !triageOverrideDrafts[item.id]?.trim() || item.triageScore >= 5}
                              onClick={() => applyTriageOverride(item.id, "downgrade")}
                              className={`rounded-2xl px-3 py-3 text-xs font-black uppercase ${
                                item.manualTriageOverride?.reason || !triageOverrideDrafts[item.id]?.trim() || item.triageScore >= 5
                                  ? "bg-slate-200 text-slate-400"
                                  : "bg-slate-900 text-white"
                              }`}
                            >
                              {t.triageDowngrade}
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <button type="button" onClick={() => updateCaseStatus(item.id, "waiting")} className="rounded-2xl bg-amber-500 px-3 py-3 text-xs font-black uppercase text-white">
                            {t.markWaiting}
                          </button>
                          <button type="button" onClick={() => updateCaseStatus(item.id, "reviewing")} className="rounded-2xl bg-blue-600 px-3 py-3 text-xs font-black uppercase text-white">
                            {t.markInReview}
                          </button>
                          <button type="button" onClick={() => updateCaseStatus(item.id, "ready")} className="rounded-2xl bg-emerald-600 px-3 py-3 text-xs font-black uppercase text-white">
                            {t.markReady}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {step === "language" && (
                <div className="space-y-6">
                  <div className="mb-8 text-center">
                    <Languages size={48} className="mx-auto mb-4 text-red-600" />
                    <h2 className="text-2xl font-bold">{t.selectLanguage}</h2>
                    <p className="text-slate-500">{t.selectLanguageHelp}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {languageOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleLanguageSelect(option.id)}
                        className="group flex items-center justify-between rounded-2xl border-2 border-slate-100 p-5 text-left transition-all hover:border-red-500 hover:bg-red-50"
                      >
                        <div>
                          <div className="text-lg font-bold">{option.label}</div>
                          <div className="text-xs font-bold uppercase text-slate-400">{option.sub}</div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-red-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "login" && renderIntakeForm("login")}

              {step === "edit" && (
                <div className="space-y-8">
                  <div className="mb-4 text-center">
                    <Activity size={48} className="mx-auto mb-4 text-red-600" />
                    <h2 className="text-2xl font-bold">{t.editTitle}</h2>
                    <p className="text-slate-500">{t.editHelp}</p>
                  </div>

                  <section>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.updateLocationLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {t.locations.map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => toggleLocationSelection(location)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${
                            medicalData.painLocation.includes(location)
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-slate-100 bg-white text-slate-600"
                          }`}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.severityLabel}</label>
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <span className="text-5xl font-black text-red-600">{medicalData.severity}</span>
                        <p className="mt-1 text-sm font-bold text-slate-500">{getPainDescriptor(medicalData.severity)}</p>
                      </div>
                      <span className="mb-2 text-xs font-bold text-slate-400">{t.scale}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={medicalData.severity}
                      onChange={(event) => updateData("severity", parseInt(event.target.value, 10))}
                      className="h-4 w-full cursor-pointer appearance-none rounded-full bg-slate-100"
                    />
                  </section>

                  <section className="rounded-3xl border border-slate-100 bg-white p-6">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t.updateLostConsciousness}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[t.yes, t.no].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateData("lostConsciousness", option)}
                          className={`rounded-2xl border-2 p-4 text-center font-bold transition-all ${
                            medicalData.lostConsciousness === option
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-slate-100"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-100 bg-white p-6">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t.updateBreathing}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[t.yes, t.no].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateData("breathingDifficulty", option)}
                          className={`rounded-2xl border-2 p-4 text-center font-bold transition-all ${
                            medicalData.breathingDifficulty === option
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-slate-100"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-100 bg-white p-6">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t.updateOtherLabel}
                    </label>
                    <textarea
                      value={medicalData.updateOther}
                      onChange={(event) => updateData("updateOther", event.target.value)}
                      placeholder={t.otherPlaceholder}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </section>

                  <button
                    type="button"
                    disabled={!canSaveClinicalUpdate}
                    onClick={submitTriage}
                    className={`flex w-full items-center justify-center gap-3 rounded-3xl py-5 font-black shadow-xl transition-all ${
                      canSaveClinicalUpdate ? "bg-red-600 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isSubmittingTriage ? t.updating : t.save} <CheckCircle2 size={20} />
                  </button>
                </div>
              )}

              {step === "profile" && (
                <div className="space-y-6">
                  <div className="mb-6 rounded-3xl bg-slate-900 p-6 text-white">
                    <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">{t.history}</h2>
                    <div className="flex flex-wrap gap-2">
                      {t.historyPrompts.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSelection("history", item)}
                          className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                            medicalData.history.includes(item) ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {translateOption(item)}
                        </button>
                      ))}
                    </div>
                    {medicalData.history.includes("Other") && (
                      <textarea
                        value={medicalData.historyOther}
                        onChange={(event) => updateData("historyOther", event.target.value)}
                        placeholder={t.otherPlaceholder}
                        className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                      />
                    )}
                  </div>

                  <div className="rounded-3xl border-2 border-slate-100 bg-white p-6">
                    <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">{t.allergies}</h2>
                    <div className="flex flex-wrap gap-2">
                      {t.allergyPrompts.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSelection("allergies", item)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${
                            medicalData.allergies.includes(item)
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-100 text-slate-500"
                          }`}
                        >
                          {translateOption(item)}
                        </button>
                      ))}
                    </div>
                    {medicalData.allergies.includes("Other") && (
                      <textarea
                        value={medicalData.allergiesOther}
                        onChange={(event) => updateData("allergiesOther", event.target.value)}
                        placeholder={t.otherPlaceholder}
                        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("symptoms")}
                    className="flex w-full items-center justify-center gap-3 rounded-3xl bg-red-600 py-5 font-black text-white shadow-xl shadow-red-100"
                  >
                    {t.next} <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {step === "symptoms" && (
                <div className="space-y-8 pb-20">
                  <section>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.locationLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {t.locations.map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => toggleLocationSelection(location)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${
                            medicalData.painLocation.includes(location)
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-slate-100 bg-white text-slate-600"
                          }`}
                        >
                          {translateOption(location)}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.severityLabel}</label>
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <span className="text-5xl font-black text-red-600">{medicalData.severity}</span>
                        <p className="mt-1 text-sm font-bold text-slate-500">{getPainDescriptor(medicalData.severity)}</p>
                      </div>
                      <span className="mb-2 text-xs font-bold text-slate-400">{t.scale}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={medicalData.severity}
                      onChange={(event) => updateData("severity", parseInt(event.target.value, 10))}
                      className="h-4 w-full cursor-pointer appearance-none rounded-full bg-slate-100"
                    />
                    <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <span>{t.painScaleMin}</span>
                      <span>{t.painScaleMax}</span>
                    </div>
                  </section>

                  <section>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.onsetLabel}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {t.onsets.map((onset) => (
                        <button
                          key={onset}
                          type="button"
                          onClick={() => updateData("onset", onset)}
                          className={`rounded-2xl border-2 p-4 text-left font-bold transition-all ${
                            medicalData.onset === onset ? "border-red-600 bg-red-50 text-red-700" : "border-slate-100"
                          }`}
                        >
                          {translateOption(onset)}
                        </button>
                      ))}
                    </div>
                    {medicalData.onset === "Other" && (
                      <textarea
                        value={medicalData.onsetOther}
                        onChange={(event) => updateData("onsetOther", event.target.value)}
                        placeholder={t.otherPlaceholder}
                        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
                      />
                    )}
                  </section>

                  <section>
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.sensationLabel}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {t.painTypes.map((painType) => (
                        <button
                          key={painType}
                          type="button"
                          onClick={() => updateData("painType", painType)}
                          className={`rounded-2xl border-2 p-4 text-center font-bold transition-all ${
                            medicalData.painType === painType
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-slate-100"
                          }`}
                        >
                          {translateOption(painType)}
                        </button>
                      ))}
                    </div>
                    {medicalData.painType === "Other" && (
                      <textarea
                        value={medicalData.painTypeOther}
                        onChange={(event) => updateData("painTypeOther", event.target.value)}
                        placeholder={t.otherPlaceholder}
                        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
                      />
                    )}
                  </section>

                  <button
                    type="button"
                    disabled={medicalData.painLocation.length === 0 || !medicalData.onset || !medicalData.painType}
                    onClick={() => {
                      updateData("followUpAnswer", "");
                      setStep("followup");
                    }}
                    className={`flex w-full items-center justify-center gap-3 rounded-3xl py-5 font-black shadow-xl transition-all ${
                      medicalData.painLocation.length > 0 && medicalData.onset && medicalData.painType
                        ? "bg-red-600 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {t.next} <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {step === "followup" && (
                <div className="space-y-6">
                  <section className="rounded-3xl border border-slate-100 bg-white p-6">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t.followUpTitle}
                    </label>
                    <h3 className="text-xl font-black text-slate-900">{followUpQuestion}</h3>
                    <p className="mt-2 text-sm text-slate-500">{t.followUpLabel}</p>
                  </section>

                  <section className="grid grid-cols-1 gap-3">
                    {followUpOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateData("followUpAnswer", option)}
                        className={`rounded-2xl border-2 p-4 text-left font-bold transition-all ${
                          medicalData.followUpAnswer === option
                            ? "border-red-600 bg-red-50 text-red-700"
                            : "border-slate-100 bg-white text-slate-700"
                        }`}
                      >
                        {translateOption(option)}
                      </button>
                    ))}
                  </section>

                  {medicalData.followUpAnswer === "Other" && (
                    <textarea
                      value={medicalData.followUpOther}
                      onChange={(event) => updateData("followUpOther", event.target.value)}
                      placeholder={t.otherPlaceholder}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  )}

                  <button
                    type="button"
                    disabled={!canContinueToSummary}
                    onClick={submitTriage}
                    className={`flex w-full items-center justify-center gap-3 rounded-3xl py-5 font-black shadow-xl transition-all ${
                      canContinueToSummary ? "bg-red-600 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isSubmittingTriage ? t.submitting : t.finish} <CheckCircle2 size={20} />
                  </button>
                </div>
              )}

              {step === "summary" && (
                <div className="space-y-6">
                  {triageError && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                      {triageError}
                    </div>
                  )}
                  {activeCase?.backend?.similarityReview?.nurseReviewRequired && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {t.discrepancyAlert}: {activeCase.backend.similarityReview.reason}
                    </div>
                  )}
                  {activeCase?.backend?.similarityReview && !activeCase.backend.similarityReview.nurseReviewRequired && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                      {t.discrepancyClear}
                    </div>
                  )}
                  <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <AlertTriangle size={24} className="shrink-0" />
                    <p className="text-xs font-bold uppercase leading-tight">{t.presentImmediately}</p>
                  </div>

                  <div className="relative space-y-6 rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl">
                    <div className="absolute right-8 top-6 opacity-20">
                      <Activity size={40} />
                    </div>

                    <div>
                      <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.triageScore}</h3>
                      <p className="text-2xl font-black text-red-500">
                        {activeCase ? getCaseTriageLabel(activeCase) : t.triageLevel(medicalData.severity)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-4">
                      <div className="col-span-2">
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.fullName}</h3>
                        <p className="text-lg font-bold uppercase">{medicalData.name || t.unspecified}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.birthDateLabel}</h3>
                        <p className="text-sm font-bold text-slate-300">{medicalData.birthDate || t.unspecified}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.idCheckLabel}</h3>
                        <p className="text-sm font-bold text-slate-300">
                          {medicalData.idMethod === "scan" ? t.idScanReady : maskIdNumber(medicalData.idNumber)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.location}</h3>
                        <p className="text-xl font-bold uppercase">
                          {medicalData.painLocation.length > 0 ? formatTranslatedList(medicalData.painLocation) : t.unspecified}
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.painIndex}</h3>
                        <p className="text-xl font-bold">{medicalData.severity}/10</p>
                      </div>
                      <div className="col-span-2">
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.feelingOnset}</h3>
                        <p className="text-xl font-bold uppercase">
                          {translateOption((medicalData.painType === "Other" ? medicalData.painTypeOther : medicalData.painType) || t.unspecified)} â€¢ {translateOption((medicalData.onset === "Other" ? medicalData.onsetOther : medicalData.onset) || t.unspecified)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-800 pt-4">
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.updateLostConsciousness}</h3>
                        <p className="text-sm font-bold text-slate-300">{translateOption(medicalData.lostConsciousness || t.unspecified)}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.updateBreathing}</h3>
                        <p className="text-sm font-bold text-slate-300">{translateOption(medicalData.breathingDifficulty || t.unspecified)}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.updateOtherLabel}</h3>
                        <p className="text-sm font-bold text-slate-300">{medicalData.updateOther || t.noneReported}</p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.followUpSummary}</h3>
                        <p className="text-sm font-bold text-slate-300">
                          {translateOption((medicalData.followUpAnswer === "Other" ? medicalData.followUpOther : medicalData.followUpAnswer) || t.unspecified)}
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.history}</h3>
                        <p className="text-sm font-bold text-slate-300">
                          {getDisplayList(medicalData.history, medicalData.historyOther).length > 0
                            ? formatTranslatedList(getDisplayList(medicalData.history, medicalData.historyOther))
                            : t.noneReported}
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.allergies}</h3>
                        <p className="text-sm font-bold text-slate-300">
                          {getDisplayList(medicalData.allergies, medicalData.allergiesOther).length > 0
                            ? formatTranslatedList(getDisplayList(medicalData.allergies, medicalData.allergiesOther))
                            : t.noneReported}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("edit")}
                    className="w-full rounded-2xl border-2 border-red-100 bg-red-50 py-4 text-xs font-bold uppercase tracking-widest text-red-600"
                  >
                    {t.updateInfo}
                  </button>

                  <button
                    type="button"
                    onClick={resetSession}
                    className="w-full rounded-2xl border-2 border-slate-100 py-4 text-xs font-bold uppercase tracking-widest text-slate-400"
                  >
                    {t.clearSession}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {view === "patient" && showBackNav && (
          <div className="flex shrink-0 items-center gap-4 border-t border-slate-100 bg-white p-6">
            <button
              type="button"
              onClick={() => {
                if (step === "login") setStep("language");
                if (step === "profile") setStep("language");
                if (step === "symptoms") setStep("profile");
                if (step === "followup") setStep("symptoms");
              }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="h-2 flex-grow overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-red-600 transition-all duration-500"
                style={{
                  width:
                    step === "login"
                      ? "20%"
                      : step === "profile"
                        ? "40%"
                        : step === "symptoms"
                          ? "60%"
                          : step === "followup"
                            ? "80%"
                            : "20%"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


