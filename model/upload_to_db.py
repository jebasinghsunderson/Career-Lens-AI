import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL environment variable is not set in .env file.")
    exit(1)

# Normalise mysql:// to mysql+pymysql:// for SQLAlchemy
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

print("Connecting to MySQL Database on Railway...")
try:
    engine = create_engine(DATABASE_URL)
    
    csv_path = "jobs_clean.csv"
    if not os.path.exists(csv_path):
        csv_path = "../jobs_clean.csv" # fallback
        
    print(f"Loading {csv_path}...")
    df = pd.read_csv(csv_path)
    
    print("Uploading to Railway MySQL (table 'jobs')...")
    # Using chunksize to prevent payload packet limits on cloud databases
    df.to_sql("jobs", con=engine, if_exists="replace", index=False, chunksize=100)
    print("Upload successful! All data loaded to table 'jobs'.")
except Exception as e:
    print("An error occurred during database upload:", e)
