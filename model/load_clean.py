import pandas as pd

# ==========================================================
# Load Clean Dataset
# ==========================================================
df = pd.read_csv("jobs_clean.csv")

print("=" * 60)
print("Phase 2 - Job Document Construction")
print("=" * 60)

print(f"Total Jobs : {len(df)}")

# ==========================================================
# Build Document
# ==========================================================
def create_document(row):

    role = str(row["Role"]).strip()
    description = str(row["Job Description"]).strip()

    document = (
        f"Role: {role}\n\n"
        f"Job Description:\n{description}"
    )

    return document


df["Document"] = df.apply(create_document, axis=1)

# ==========================================================
# Keep Required Columns
# ==========================================================
job_documents = df[
    [
        "ID",
        "Company",
        "Role",
        "Document"
    ]
].copy()

# ==========================================================
# Save
# ==========================================================
output_file = "job_documents.csv"

job_documents.to_csv(output_file, index=False)

print("\nSaved:", output_file)

print("\nSample Documents\n")

for i in range(3):
    print("=" * 60)
    print(job_documents.iloc[i]["Document"])
    print()