import json
import re

import faiss
import numpy as np
import torch

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
# Tokenizer
# ==========================================================

def tokenize(text):

    text = str(text).lower()

    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text.split()


# ==========================================================
# Load Vocabulary
# ==========================================================

with open("vocab.json", "r") as f:
    vocab = json.load(f)

VOCAB_SIZE = len(vocab)

# ==========================================================
# Load Model
# ==========================================================

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

# ==========================================================
# Load FAISS
# ==========================================================

index = faiss.read_index("job_index.faiss")

with open("index_to_id.json", "r") as f:
    index_to_id = json.load(f)

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
# Search
# ==========================================================

def recommend(role, top_k=TOP_K):

    query_vector = encode_role(role)

    scores, indices = index.search(
        query_vector,
        top_k
    )

    results = []

    for score, idx in zip(scores[0], indices[0]):

        results.append(
            {
                "internship_id": index_to_id[str(idx)],
                "score": float(score)
            }
        )

    return results


# ==========================================================
# Demo
# ==========================================================

if __name__ == "__main__":

    while True:

        role = input("\nEnter Role (or exit): ")

        if role.lower() == "exit":
            break

        results = recommend(role)

        print("\nRecommendations\n")

        for r in results:

            print(r)