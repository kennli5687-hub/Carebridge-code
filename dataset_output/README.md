# Dataset extraction summary

Source archive: `C:\Users\kennl\Downloads\archive.zip`

The archive contains one R data file: `5v_cleandf.rdata`.

## Extracted outputs

- `5v_cleandf.csv.gz`: full table exported from RData to compressed CSV
- `5v_cleandf_sample_1000.csv`: first 1,000 rows for quick inspection
- `5v_cleandf_schema.csv`: one row per column with dtype, non-null count, missing count, and number of unique values
- `5v_cleandf_summary.json`: compact JSON profile with row count, column count, and selected distributions

## What the dataset appears to be

This appears to be an adult emergency department encounter dataset. The evidence is the presence of:

- triage and arrival fields such as `esi`, `arrivalmode`, `arrivalhour_bin`, and `disposition`
- vitals such as `triage_vital_hr`, `triage_vital_sbp`, and `triage_vital_temp`
- prior utilization fields such as `n_edvisits` and `n_admissions`
- diagnosis indicator columns such as `htn`, `asthma`, and `anxietydisorders`
- medication class indicators such as `meds_cardiovascular`
- chief complaint indicators such as `cc_abdominalpain`, `cc_chestpain`, and `cc_shortnessofbreath`

## Shape

- Rows: 560,486
- Columns: 972

## High-level structure

- Demographics and visit context: age, sex, race/ethnicity, language, religion, marital status, employment, insurance, arrival information, and disposition
- Utilization history: prior ED visits, admissions, and surgeries
- Diagnosis indicators: hundreds of mostly binary columns
- Lab summaries: many columns with suffixes like `_last`, `_min`, `_max`, `_median`
- Imaging and test counts: columns ending in `_count`
- Medication classes: columns prefixed with `meds_`
- Chief complaints: columns prefixed with `cc_`

## Selected distributions

- Departments: A 322,283, B 166,497, C 71,706
- Disposition: Discharge 393,848, Admit 166,638
- Gender: Female 309,653, Male 250,833
- ESI: 3 236,229, 2 163,534, 4 125,003, 5 27,992, 1 5,271, missing 2,457
- Arrival mode: Car 223,086, ambulance 190,370, Walk-in 113,731

## Selected numeric summaries

- Age: mean 49.88, median 49, min 18, max 108
- Prior ED visits: mean 3.66, median 1, max 376
- Prior admissions: mean 0.93, median 0, max 50
- Prior surgeries: mean 2.21, median 1, max 47

## Common chief complaints

- `cc_abdominalpain`: 54,345
- `cc_other`: 51,025
- `cc_chestpain`: 35,798
- `cc_shortnessofbreath`: 24,666
- `cc_backpain`: 20,643
- `cc_fall`: 19,026

## Common diagnosis indicators

- `htn`: 217,015
- `hyperlipidem`: 128,251
- `mooddisorders`: 126,568
- `anxietydisorders`: 111,779
- `diabmelnoc`: 106,813
- `asthma`: 106,748

## Notes

- Many lab summary fields are extremely sparse.
- A few columns are entirely empty in this export, including PCP screen summary fields.
- The age range starts at 18, which supports the interpretation that this is an adult-only dataset.
