import json
import re
import numpy as np
import pandas as pd
import torch
import faiss
from model import RecruitmentEmbeddingModel

# ==========================================================
# Configuration
# ==========================================================

EMBEDDING_DIM = 128

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("Phase 7 - Generate Job Embeddings")
print("=" * 60)

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

print("Vocabulary Size :", VOCAB_SIZE)

# ==========================================================
# Load Dataset
# ==========================================================

df = pd.read_csv("training_pairs.csv")

print("Jobs :", len(df))

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
# Encode Function
# ==========================================================

def encode(text):

    tokens = tokenize(text)

    ids = [
        vocab.get(token, vocab["<UNK>"])
        for token in tokens
    ]

    length = len(ids)

    token_tensor = torch.tensor(
        [ids],
        dtype=torch.long,
        device=DEVICE
    )

    length_tensor = torch.tensor(
        [length],
        dtype=torch.long,
        device=DEVICE
    )

    with torch.no_grad():

        vector = model.encode(
            token_tensor,
            length_tensor
        )

    return vector.squeeze(0).cpu().numpy()


# ==========================================================
# Generate Job Embeddings
# ==========================================================

job_vectors = []

index_to_id = {}

for index, row in df.iterrows():

    vector = encode(row["Job Description"])

    job_vectors.append(vector)

    index_to_id[index] = int(row["ID"])

job_vectors = np.array(job_vectors)

# ==========================================================
# Save
# ==========================================================

np.save(
    "job_vectors.npy",
    job_vectors
)

with open("index_to_id.json", "w") as f:
    json.dump(index_to_id, f, indent=4)
# ==========================================================
# Phase 8 - Build FAISS Index
# ==========================================================

print("\n" + "=" * 60)
print("Building FAISS Index")
print("=" * 60)

# FAISS expects float32
job_vectors = job_vectors.astype(np.float32)

# L2 Normalize
faiss.normalize_L2(job_vectors)

# Cosine Similarity = Inner Product after normalization
index = faiss.IndexFlatIP(job_vectors.shape[1])

# Add vectors
index.add(job_vectors)

print("Vectors Added :", index.ntotal)
# ==========================================================
# Verification
# ==========================================================

print("\n" + "=" * 60)
print("FAISS Verification")
print("=" * 60)

query = job_vectors[0].reshape(1, -1)

scores, indices = index.search(query, 5)

print("Nearest Jobs To First Job\n")

for rank, (score, idx) in enumerate(zip(scores[0], indices[0]), start=1):

    print(f"{rank}. Internship ID : {index_to_id[idx]}")
    print(f"   Similarity : {score:.4f}")
# Save Index
faiss.write_index(
    index,
    "job_index.faiss"
)

print("Saved : job_index.faiss")
# ==========================================================
# Verification
# ==========================================================

print("\n" + "=" * 60)
print("Verification")
print("=" * 60)

print("Vector Shape :", job_vectors.shape)

print("Embedding Dimension :", job_vectors.shape[1])

print("First Internship ID :", index_to_id[0])

print("First Vector")

print(job_vectors[0][:10])

print("\nSaved Files")

print("job_vectors.npy")

print("index_to_id.json")