import json
import re

import faiss
import numpy as np
import torch
from fastapi import FastAPI
from pydantic import BaseModel

from model import RecruitmentEmbeddingModel

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

    return {
        "role": request.role,
        "internship_ids": internship_ids,
        "scores": similarity_scores
    }

# ==========================================================
# Health Check
# ==========================================================

@app.get("/")
def home():
    return {
        "status": "API Running"
    }