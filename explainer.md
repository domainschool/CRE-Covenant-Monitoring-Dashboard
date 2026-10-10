# Micro-SaaS Product Blueprint: CRE Covenant Monitoring Engine (CovenantWatch AI)

## 1. The Business Problem

In Commercial Real Estate (CRE) debt portfolios, regional banks, private credit funds, and debt servicers sit on hundreds of billions in floating- and fixed-rate loans secured by physical properties. Every loan agreement mandates ongoing operational floors—known as **loan covenants**—such as maintaining a minimum physical occupancy rate (e.g., $\ge 85\%$), a minimum Debt Service Coverage Ratio (DSCR $\ge 1.25\text{x}$), or a maximum dynamic Loan-to-Value (LTV $\le 70\%$).

The operational friction stems from how property data is ingested and reviewed:

* **The Manual Processing Trap:** Borrowers and property management firms submit monthly or quarterly compliance packages as disparate, unstandardized artifacts—messy Excel spreadsheets, scanned PDFs from Yardi/MRI/RealPage, and trailing twelve-month (T12) operating statements.
* **The "Lag to Default" Risk:** Credit analysts and asset managers manually transcribe these rolls and recompute ratios cell by cell. Because of capacity constraints, compliance checks often occur 60 to 90 days after quarter-end.
* **The Costly Consequence:** If an anchor tenant vacates in February, physical and economic occupancy collapses immediately. Because the lender's review is delayed until May or June, the bank misses its contractual window to enforce early mitigations: triggering a **Cash Sweep** (trapping rental income in a lender-controlled account), requiring an immediate **Equity Cure** (cash paydown by the sponsor), or adjusting loan loss reserves under Current Expected Credit Losses (CECL) guidelines. By the time the bank notices, the property is already facing imminent payment default and capital destruction.

---

## 2. The Industry Logic

Building this product requires mastering core commercial lending workflows, real estate finance math, and an automated data-extraction architecture:

* **CRE Underwriting & Surveillance Metrics:**
  * **Net Operating Income (NOI):** $\text{NOI} = \text{Effective Gross Income (EGI)} - \text{Operating Expenses (OpEx)}$ (excluding debt service, depreciation, and owner CapEx).
  * **Debt Service Coverage Ratio (DSCR):** $\text{DSCR} = \frac{\text{Annualized In-Place NOI}}{\text{Annual Principal \& Interest Debt Service}}$.
  * **Dynamic (Mark-to-Market) LTV:** $\text{LTV} = \frac{\text{Current Unpaid Principal Balance (UPB)}}{\text{Property Value}}$, where $\text{Property Value} = \frac{\text{NOI}}{\text{Market Cap Rate}}$.
  * **Physical vs. Economic Occupancy:** Physical occupancy measures occupied square footage over Gross Leasable Area (GLA). Economic occupancy measures actual gross cash collected versus gross potential rent, penalizing rent concessions and tenant payment delinquencies.

* **Credit Agreement Triggers:** Translating contractual covenants into programmatic if-then rules: *Hard Defaults* vs. *Soft Triggers* (e.g., cash traps, lockbox activation, required capital reserve escrows).
* **Architectural Pattern (Document Extraction + Deterministic Valuation Engine + Rule-Based State Machine):**
  * **Document Parsing Layer:** Ingesting unstructured tabular documents (PDF/CSV/XLSX) using structured schemas to extract standardized tenant arrays and lease terms.
  * **Deterministic Calculation Pipeline:** Mathematical execution in strict TypeScript (never letting an LLM calculate DSCR or LTV to eliminate hallucinations).
  * **State Machine & Alerting Engine:** Evaluating calculated ratios against loan terms, tracking cure-period countdown timers (e.g., 30-day notice to cure), and updating risk ratings automatically.

---

## 3. The Synthetic Data Foundation

### A. The Loan Agreement Contract (`loan_agreement.json`)
```json
{
  "loan_id": "LN-2024-OFFICE-884",
  "borrower_name": "Apex Commercial Real Estate Partners LLC",
  "property_name": "Centennial Center Tower A",
  "property_type": "Commercial Office",
  "gross_leasable_area_sqft": 150000,
  "original_loan_amount": 28000000.00,
  "current_unpaid_principal_balance": 27250000.00,
  "interest_rate_pct": 6.75,
  "annual_debt_service": 2125400.00,
  "market_cap_rate_pct": 7.25,
  "covenants": {
    "min_physical_occupancy_pct": 85.0,
    "min_economic_occupancy_pct": 80.0,
    "min_dscr": 1.25,
    "max_ltv_pct": 70.0,
    "cash_sweep_dscr_threshold": 1.15,
    "cure_period_days": 30
  }
}
```

### B. The Monthly Rent Roll Snapshot
```json
[
  {
    "suite_id": "Suite 100",
    "tenant_name": "Nexus Global Consulting",
    "sqft": 45000,
    "lease_start": "2021-01-01",
    "lease_end": "2026-03-31",
    "monthly_base_rent": 131250.00,
    "status": "Active",
    "payment_delinquency_days": 0
  },
  {
    "suite_id": "Suite 200",
    "tenant_name": "Vanguard FinTech Solutions",
    "sqft": 30000,
    "lease_start": "2022-06-01",
    "lease_end": "2027-05-31",
    "monthly_base_rent": 87500.00,
    "status": "Active",
    "payment_delinquency_days": 65
  },
  {
    "suite_id": "Suite 300",
    "tenant_name": "Vacant / Previous Anchor",
    "sqft": 40000,
    "lease_start": null,
    "lease_end": null,
    "monthly_base_rent": 0.00,
    "status": "Vacant",
    "payment_delinquency_days": 0
  },
  {
    "suite_id": "Suite 400",
    "tenant_name": "BioHealth Diagnostic Labs",
    "sqft": 35000,
    "lease_start": "2023-01-01",
    "lease_end": "2028-12-31",
    "monthly_base_rent": 102083.33,
    "status": "Active",
    "payment_delinquency_days": 0
  }
]
```
