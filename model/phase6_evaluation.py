import json
import re
import torch
import torch.nn.functional as F
import pandas as pd

from model import RecruitmentEmbeddingModel

# ==========================================================
# Configuration
# ==========================================================

EMBEDDING_DIM = 128

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
# Load Dataset
# ==========================================================

df = pd.read_csv("training_pairs.csv")


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

    tokens_tensor = torch.tensor(
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

        embedding = model.encode(
            tokens_tensor,
            length_tensor
        )

    return embedding.squeeze(0)


# ==========================================================
# Encode Entire Dataset
# ==========================================================

role_vectors = []

job_vectors = []

for _, row in df.iterrows():

    role_vectors.append(
        encode(row["Role"])
    )

    job_vectors.append(
        encode(row["Job Description"])
    )

role_vectors = torch.stack(role_vectors)

job_vectors = torch.stack(job_vectors)


# ==========================================================
# Similarity Matrix
# ==========================================================

similarity = torch.matmul(
    role_vectors,
    job_vectors.T
)


# ==========================================================
# Retrieval
# ==========================================================

TOP_K = 5

for i in range(len(df)):

    role = df.iloc[i]["Role"]

    print("=" * 70)
    print("Role :", role)
    print("-" * 70)

    scores, indices = torch.topk(
        similarity[i],
        TOP_K
    )

# ==========================================================
# Interactive Query
# ==========================================================

while True:

    query = input("\nEnter Role (or 'exit'): ")

    if query.lower() == "exit":
        break

    query_vector = encode(query)

    scores = torch.matmul(
        job_vectors,
        query_vector
    )

    top_scores, top_indices = torch.topk(scores, 10)

    print("\nTop Matching Jobs\n")

    for rank, (score, idx) in enumerate(
        zip(top_scores, top_indices),
        start=1
    ):

        idx = idx.item()

        print("=" * 60)
        print(f"Rank : {rank}")
        print(f"Similarity : {score.item():.4f}")
        print("Company :", df.iloc[idx]["Company"])
        print("Role :", df.iloc[idx]["Role"])
        print("Job Description :")
        print(df.iloc[idx]["Job Description"])