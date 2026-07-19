import pandas as pd
import re

# ==========================================================
# Load Dataset
# ==========================================================
df = pd.read_excel("internships_final.xlsx")

print("=" * 60)
print("Dataset Loaded Successfully")
print("=" * 60)
print(f"Rows    : {len(df)}")
print(f"Columns : {len(df.columns)}")

print("\nColumns:")
print(df.columns.tolist())


# ==========================================================
# Required Columns
# ==========================================================
required_columns = [
    "ID",
    "Company",
    "Role",
    "Job Description"
]

print("\n" + "=" * 60)
print("Checking Required Columns")
print("=" * 60)

missing_columns = [
    col for col in required_columns
    if col not in df.columns
]

if missing_columns:
    print("Missing Columns:")
    print(missing_columns)
    raise Exception("Dataset format is incorrect.")

print("All required columns are present.")


# ==========================================================
# Missing Values
# ==========================================================
print("\n" + "=" * 60)
print("Missing Values")
print("=" * 60)

print(df[required_columns].isnull().sum())


# ==========================================================
# Remove Rows Missing Important Information
# ==========================================================
df = df.dropna(subset=[
    "Role",
    "Job Description"
]).copy()


# ==========================================================
# Text Cleaning Function
# ==========================================================
def clean_text(text):

    if pd.isna(text):
        return ""

    text = str(text)

    # Remove extra spaces/newlines
    text = re.sub(r"\s+", " ", text)

    # Remove leading/trailing spaces
    text = text.strip()

    return text


# ==========================================================
# Clean Text Columns
# ==========================================================
text_columns = [
    "Company",
    "Role",
    "Job Description"
]

for col in text_columns:
    df[col] = df[col].apply(clean_text)
# ==========================================================
# Duplicate Analysis (Do NOT Remove)
# ==========================================================

print("\n" + "=" * 60)
print("Duplicate Analysis")
print("=" * 60)

print(f"Total Rows : {len(df)}")
print(f"Unique IDs : {df['ID'].nunique()}")

exact_duplicates = df.duplicated().sum()
print(f"Exact Duplicate Rows : {exact_duplicates}")

role_desc_duplicates = df.duplicated(
    subset=["Role", "Job Description"]
).sum()

print(f"Duplicate Role + Job Description : {role_desc_duplicates}")

if df["ID"].nunique() != len(df):
    print("\n⚠ Warning: Duplicate IDs detected!")
else:
    print("\n✓ All IDs are unique.")
# ==========================================================
# Dataset Preview
# ==========================================================
print("\n" + "=" * 60)
print("Sample Records")
print("=" * 60)

print(
    df[
        ["ID", "Company", "Role", "Job Description"]
    ].head()
)
print("\nMissing Role Rows:")
print(df[df["Role"].isna()][["ID", "Company", "Job Description"]])

# ==========================================================
# Save Clean Dataset
# ==========================================================
output_file = "jobs_clean.csv"

df.to_csv(output_file, index=False)

print("\n" + "=" * 60)
print("Dataset Saved")
print("=" * 60)
print(output_file)

print("\nFinal Dataset Size:", len(df))