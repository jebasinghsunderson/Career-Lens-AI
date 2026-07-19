import pandas as pd

# Load dataset
df = pd.read_excel("internships_final.xlsx")

# Basic information
print("Shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

print("\nMissing Values:")
print(df.isnull().sum())

# Keep only the columns required for retrieval
jobs_df = df[[
    "ID",
    "Company",
    "Preferred Skills",
    "Job Description"
]].copy()

print("\nPreview:")
print(jobs_df.head())
# Verify IDs
print("Duplicate IDs:", jobs_df.duplicated(subset=["ID"]).sum())
print("Are IDs unique?", jobs_df["ID"].is_unique)

# Check for duplicate company descriptions
duplicate_jobs = jobs_df.duplicated(
    subset=["Preferred Skills", "Job Description"]
).sum()

print("Duplicate Jobs:", duplicate_jobs)


# # Check empty Preferred Skills
# empty_skills = jobs_df["Preferred Skills"].astype(str).str.strip().eq("").sum()

# print("Empty Preferred Skills:", empty_skills)


# # Check empty Job Description
# empty_desc = jobs_df["Job Description"].astype(str).str.strip().eq("").sum()

# print("Empty Job Descriptions:", empty_desc)


# Print first 5 Preferred Skills
print("\nSample Preferred Skills:\n")
print(jobs_df["Preferred Skills"].head())

print("\n------------------------\n")

# Print first 5 Job Descriptions
print("Sample Job Descriptions:\n")
print(jobs_df["Job Description"].head())

print("Unique Companies :", jobs_df["Company"].nunique())
print("Total Companies  :", len(jobs_df))

print()

print("Unique Preferred Skills :", jobs_df["Preferred Skills"].nunique())
print("Unique Job Descriptions :", jobs_df["Job Description"].nunique())