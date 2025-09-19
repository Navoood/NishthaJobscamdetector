🟢 Problem Statement

Current MVP already detects scams via job text + user-entered stats. But asking users to manually enter followers/engagement breaks flow and feels unrealistic. We need a way to auto-fill these stats without altering the core MVP pipeline.

🎯 Goal

Add a Company Stats Addon that:

Accepts company name or LinkedIn page URL.

Looks up or generates followers/employee/engagement values.

Auto-fills these into the existing MVP fields.

Works as a supporting feature → does not remove manual entry (fallback stays).

👤 User Flow

User pastes a job ad (as they do now).

User optionally enters company name / LinkedIn URL.

System fetches/mock-generates stats → auto-fills followers/employees/engagement fields.

Scam detector runs exactly as before → no pipeline changes.

🟡 Core Features

Optional Input

Add a field: “Company name / LinkedIn URL (optional)”.

Stats Lookup Module

Checks a local CSV/JSON of mock company data.

Example:

company,followers,employees,engagement
Infosys,5000000,340000,12000
TCS,4000000,300000,10000
RandomStartup,80,5,2
FakeLtd,10,1,0


Fallback Behavior

If company not found → auto-generate small random values (looks scammy).

If user skips company input → keep manual stat fields (MVP original flow stays intact).

UI Presentation

Show “Company Stats Found” card → Followers, Employees, Engagement.

If company is unknown → show: “Low company presence detected.”

📂 Tech Addon

company_stats.csv → new mock dataset (lives in the project folder).

company_stats.py → small helper script with:

def get_company_stats(company_name_or_url): 
    # lookup in CSV 
    # if not found → generate mock stats 
    return {"followers": ..., "employees": ..., "engagement": ...}


Integration → Just auto-fills the existing fields in the frontend form.

✅ Success Criteria

If user enters “Infosys” → stats autofill with millions of followers → job flagged legit.

If user enters “Fake Ltd” → stats autofill with <100 followers → job flagged scammy.

If no company input → MVP works as before (manual fields available).
