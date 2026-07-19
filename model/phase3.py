import pandas as pd

# ==========================================================
# Phase 3 - Create Training Pairs
# ==========================================================

print("=" * 60)
print("Phase 3 - Training Pair Creation")
print("=" * 60)

# ----------------------------------------------------------
# Load Dataset
# ----------------------------------------------------------
df = pd.read_csv("jobs_clean.csv")

print(f"Loaded {len(df)} jobs.\n")

# ----------------------------------------------------------
# Keep Only Required Columns
# ----------------------------------------------------------
training_pairs = df[
    [
        "ID",
        "Company",
        "Role",
        "Job Description"
    ]
].copy()

# ----------------------------------------------------------
# Remove Extra Spaces
# ----------------------------------------------------------
training_pairs["Role"] = (
    training_pairs["Role"]
    .astype(str)
    .str.strip()
)

training_pairs["Job Description"] = (
    training_pairs["Job Description"]
    .astype(str)
    .str.strip()
)

# ----------------------------------------------------------
# Verify Missing Values
# ----------------------------------------------------------
print("=" * 60)
print("Missing Values")
print("=" * 60)

print(training_pairs.isnull().sum())

# ----------------------------------------------------------
# Verify Empty Strings
# ----------------------------------------------------------
empty_role = (
    training_pairs["Role"]
    .eq("")
    .sum()
)

empty_description = (
    training_pairs["Job Description"]
    .eq("")
    .sum()
)

print("\nEmpty Roles           :", empty_role)
print("Empty Job Descriptions:", empty_description)

# ----------------------------------------------------------
# Save Training Pairs
# ----------------------------------------------------------
output_file = "training_pairs.csv"

training_pairs.to_csv(output_file, index=False)

# ----------------------------------------------------------
# Verification
# ----------------------------------------------------------
print("\n" + "=" * 60)
print("Verification")
print("=" * 60)

print("Total Training Pairs :", len(training_pairs))
print("Unique Roles         :", training_pairs["Role"].nunique())
print("Unique Companies     :", training_pairs["Company"].nunique())

print("\nSample Training Pairs\n")

for i in range(min(5, len(training_pairs))):
    print("-" * 60)
    print("ID :", training_pairs.iloc[i]["ID"])
    print("Company :", training_pairs.iloc[i]["Company"])
    print("Role :", training_pairs.iloc[i]["Role"])
    print("Job Description :")
    print(training_pairs.iloc[i]["Job Description"])
    print()

print("=" * 60)
print(f"Saved as '{output_file}'")
print("=" * 60)