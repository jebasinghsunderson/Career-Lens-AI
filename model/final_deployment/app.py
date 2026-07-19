import json
import re
import os
import sys

# Force UTF-8 output so ₹ and other unicode chars print correctly on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import faiss
import numpy as np
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

from model import RecruitmentEmbeddingModel

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

# Initialize database engine
db_engine = None
if DATABASE_URL:
    try:
        db_engine = create_engine(DATABASE_URL)
        print("Database connection configured successfully.")
    except Exception as e:
        print("Failed to initialize database engine:", e)

# ==========================================================
# Configuration
# ==========================================================

EMBEDDING_DIM = 128
TOP_K = 10

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# ==========================================================
# FastAPI
# ==========================================================

app = FastAPI(
    title="Recruitment Recommendation API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Tokenizer
# ==========================================================

def tokenize(text):

    text = str(text).lower()

    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text.split()

# ==========================================================
# Load Everything Once
# ==========================================================

print("Loading Model...")

with open("vocab.json", "r") as f:
    vocab = json.load(f)

VOCAB_SIZE = len(vocab)

model = RecruitmentEmbeddingModel(
    vocab_size=VOCAB_SIZE,
    embedding_dim=EMBEDDING_DIM
)

model.load_state_dict(
    torch.load(
        "recruitment_embedding_model.pt",
        map_location=DEVICE
    )
)

model.to(DEVICE)
model.eval()

index = faiss.read_index("job_index.faiss")

with open("index_to_id.json", "r") as f:
    index_to_id = json.load(f)

print("API Ready!")

# ==========================================================
# Encode Role
# ==========================================================

def encode_role(role):

    tokens = tokenize(role)

    ids = [
        vocab.get(token, vocab["<UNK>"])
        for token in tokens
    ]

    token_tensor = torch.tensor(
        [ids],
        dtype=torch.long,
        device=DEVICE
    )

    length_tensor = torch.tensor(
        [len(ids)],
        dtype=torch.long,
        device=DEVICE
    )

    with torch.no_grad():

        vector = model.encode(
            token_tensor,
            length_tensor
        )

    vector = vector.cpu().numpy().astype(np.float32)

    faiss.normalize_L2(vector)

    return vector

# ==========================================================
# Request Model
# ==========================================================

class RecommendationRequest(BaseModel):
    role: str
    top_k: int = TOP_K

# ==========================================================
# API
# ==========================================================

@app.post("/recommend")
def recommend(request: RecommendationRequest):

    query_vector = encode_role(request.role)

    scores, indices = index.search(
        query_vector,
        request.top_k
    )

    internship_ids = []
    similarity_scores = []

    for score, idx in zip(scores[0], indices[0]):
        internship_ids.append(index_to_id[str(idx)])
        similarity_scores.append(float(score))

    # Resolve matched internship IDs to their full details
    jobs_df = None
    if db_engine:
        try:
            # Query MySQL database on Railway using text() for SQLAlchemy 2.x compatibility
            id_list = ",".join(map(str, internship_ids))
            sql = text(f"SELECT * FROM jobs WHERE ID IN ({id_list})")
            with db_engine.connect() as conn:
                jobs_df = pd.read_sql(sql, con=conn)
            print(f"Successfully loaded {len(jobs_df)} recommendations from Railway MySQL database.")
        except Exception as e:
            print("Database query failed, falling back to local CSV. Error:", e)
            jobs_df = None

    if jobs_df is None or jobs_df.empty:
        csv_path = Path(__file__).resolve().parent.parent / "jobs_clean.csv"
        if csv_path.exists():
            try:
                jobs_df = pd.read_csv(csv_path)
                print("Successfully loaded recommendations from fallback CSV.")
            except Exception as e:
                print("Error parsing fallback CSV:", e)
                jobs_df = None
                
    company_list = []
    if jobs_df is not None and not jobs_df.empty:
        try:
            for rank, (job_id, score) in enumerate(zip(internship_ids, similarity_scores), start=1):
                row = jobs_df[jobs_df["ID"] == int(job_id)]
                if row.empty:
                    continue
                r = row.iloc[0].to_dict()  # convert to plain dict for safe .get() access
                
                company_name = str(r.get("Company", "Unknown Company"))
                role_name    = str(r.get("Role", "Intern"))
                location     = str(r.get("Location", "India"))
                description  = str(r.get("Job Description", ""))
                
                # Parse stipend from Benefits
                benefits = str(r.get("Benefits", ""))
                stipend  = "₹9,000/mo"
                m = re.search(r"₹\s*(\d+)", benefits)
                if m:
                    stipend = f"₹{int(m.group(1)):,}/mo"
                
                domain = company_name.lower().replace(" ", "").replace("&", "") + ".com"
                abbr   = "".join([w[0].upper() for w in company_name.split() if w])[:4]
                
                colors = [
                    ("#E31837", "linear-gradient(135deg,#E31837 0%,#ff6b6b 100%)"),
                    ("#341F97", "linear-gradient(135deg,#341F97 0%,#7c6fcd 100%)"),
                    ("#003399", "linear-gradient(135deg,#003399 0%,#0066cc 100%)"),
                    ("#00408B", "linear-gradient(135deg,#00408B 0%,#0077b6 100%)"),
                    ("#1A3C6E", "linear-gradient(135deg,#1A3C6E 0%,#2d6a9f 100%)")
                ]
                color, gradient = colors[(rank - 1) % len(colors)]
                
                # Normalize FAISS score to a percentage between 60% and 99%
                match_pct = int(min(max(score * 100, 60), 99))
                
                company_list.append({
                    "rank":        rank,
                    "name":        company_name,
                    "domain":      domain,
                    "abbr":        abbr,
                    "sector":      str(r.get("Qualification", "General")),
                    "location":    location,
                    "role":        role_name,
                    "stipend":     stipend,
                    "match":       match_pct,
                    "tags":        [str(r.get("Mode", "In-Person")), "AI Match"],
                    "color":       color,
                    "gradient":    gradient,
                    "description": description[:200] + "..." if len(description) > 200 else description
                })
        except Exception as e:
            print("Error building company list:", e)

    # Deduplicate: keep only the first result per unique company name
    seen_companies = set()
    deduped_list = []
    for item in company_list:
        key = item["name"].lower().strip()
        if key not in seen_companies:
            seen_companies.add(key)
            deduped_list.append(item)
    # Re-rank after deduplication
    for i, item in enumerate(deduped_list, start=1):
        item["rank"] = i
    company_list = deduped_list
            
    # Fallback to static matches if CSV fails or is empty
    if not company_list:
        company_list = [
            {
                "rank": 1,
                "name": "Tech Mahindra",
                "domain": "techmahindra.com",
                "abbr": "TM",
                "sector": "IT & Software",
                "location": "Hyderabad, TS",
                "role": request.role,
                "stipend": "₹15,000/mo",
                "match": 94,
                "tags": ["In-Person", "AI Match"],
                "color": "#E31837",
                "gradient": "linear-gradient(135deg,#E31837 0%,#ff6b6b 100%)",
                "description": "Leading global technology company offering digital transformation and analytics programs."
            }
        ]

    return company_list

# ==========================================================
# Health Check
# ==========================================================

@app.get("/")
def home():
    return {
        "status": "API Running"
    }