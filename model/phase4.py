import json
import re
from collections import Counter

import pandas as pd
import torch

# ==========================================================
# Phase 4 - Tokenization & Vocabulary
# ==========================================================

print("=" * 60)
print("Phase 4 - Tokenization")
print("=" * 60)

# ----------------------------------------------------------
# Load Training Data
# ----------------------------------------------------------

df = pd.read_csv("training_pairs.csv")

print(f"Training Pairs : {len(df)}")


# ==========================================================
# Tokenizer
# ==========================================================

def tokenize(text):

    text = str(text).lower()

    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text.split()


# ==========================================================
# Build Vocabulary
# ==========================================================

counter = Counter()

for role in df["Role"]:
    counter.update(tokenize(role))

for description in df["Job Description"]:
    counter.update(tokenize(description))

vocab = {
    "<PAD>": 0,
    "<UNK>": 1
}

for word, _ in counter.most_common():
    vocab[word] = len(vocab)

print(f"Vocabulary Size : {len(vocab)}")


# ==========================================================
# Convert Text → Token IDs
# ==========================================================

role_sequences = []
job_sequences = []

role_lengths = []
job_lengths = []

max_role_length = 0
max_job_length = 0


# ----------------------------
# Roles
# ----------------------------

for role in df["Role"]:

    tokens = tokenize(role)

    ids = [
        vocab.get(token, vocab["<UNK>"])
        for token in tokens
    ]

    role_sequences.append(ids)

    role_lengths.append(len(ids))

    if len(ids) > max_role_length:
        max_role_length = len(ids)


# ----------------------------
# Job Descriptions
# ----------------------------

for description in df["Job Description"]:

    tokens = tokenize(description)

    ids = [
        vocab.get(token, vocab["<UNK>"])
        for token in tokens
    ]

    job_sequences.append(ids)

    job_lengths.append(len(ids))

    if len(ids) > max_job_length:
        max_job_length = len(ids)


print(f"Maximum Role Length : {max_role_length}")
print(f"Maximum Job Length  : {max_job_length}")


# ==========================================================
# Padding
# ==========================================================

def pad(sequence, max_length):

    return sequence + [0] * (max_length - len(sequence))


role_sequences = [
    pad(sequence, max_role_length)
    for sequence in role_sequences
]

job_sequences = [
    pad(sequence, max_job_length)
    for sequence in job_sequences
]


# ==========================================================
# Convert To Tensors
# ==========================================================

role_tensor = torch.tensor(role_sequences, dtype=torch.long)

job_tensor = torch.tensor(job_sequences, dtype=torch.long)

role_lengths = torch.tensor(role_lengths, dtype=torch.long)

job_lengths = torch.tensor(job_lengths, dtype=torch.long)


# ==========================================================
# Save Vocabulary
# ==========================================================

with open("vocab.json", "w") as file:
    json.dump(vocab, file, indent=4)


# ==========================================================
# Save Training Dataset
# ==========================================================

torch.save(
    {
        "roles": role_tensor,
        "jobs": job_tensor,
        "role_lengths": role_lengths,
        "job_lengths": job_lengths
    },
    "training_data.pt"
)


# ==========================================================
# Verification
# ==========================================================

print("\n" + "=" * 60)
print("Verification")
print("=" * 60)

print("Vocabulary Size :", len(vocab))

print("Role Tensor Shape :", role_tensor.shape)
print("Job Tensor Shape  :", job_tensor.shape)

print("Role Length Shape :", role_lengths.shape)
print("Job Length Shape  :", job_lengths.shape)

print("\nFirst Role IDs")
print(role_tensor[0])

print("\nFirst Job IDs")
print(job_tensor[0][:20])

print("\nFirst Role Length :", role_lengths[0].item())
print("First Job Length  :", job_lengths[0].item())

print("\nSaved Files")
print("------------")
print("vocab.json")
print("training_data.pt")