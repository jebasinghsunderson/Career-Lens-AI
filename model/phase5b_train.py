import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from model import RecruitmentEmbeddingModel

# ==========================================================
# Configuration
# ==========================================================

EMBEDDING_DIM = 128
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 1e-3
TEMPERATURE = 0.07

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("Phase 5 - Training Recruitment Embedding Model")
print("=" * 60)

print("Device :", DEVICE)

# ==========================================================
# Load Vocabulary
# ==========================================================

with open("vocab.json", "r") as f:
    vocab = json.load(f)

VOCAB_SIZE = len(vocab)

print("Vocabulary Size :", VOCAB_SIZE)

# ==========================================================
# Load Training Data
# ==========================================================

data = torch.load("training_data.pt")

roles = data["roles"]
jobs = data["jobs"]

role_lengths = data["role_lengths"]
job_lengths = data["job_lengths"]

print("Training Samples :", len(roles))


# ==========================================================
# Dataset
# ==========================================================

class RecruitmentDataset(Dataset):

    def __init__(self):
        self.roles = roles
        self.jobs = jobs
        self.role_lengths = role_lengths
        self.job_lengths = job_lengths

    def __len__(self):
        return len(self.roles)

    def __getitem__(self, idx):

        return (
            self.roles[idx],
            self.role_lengths[idx],
            self.jobs[idx],
            self.job_lengths[idx]
        )


dataset = RecruitmentDataset()

loader = DataLoader(
    dataset,
    batch_size=BATCH_SIZE,
    shuffle=True
)

# ==========================================================
# Model
# ==========================================================

model = RecruitmentEmbeddingModel(
    vocab_size=VOCAB_SIZE,
    embedding_dim=EMBEDDING_DIM
).to(DEVICE)

# ==========================================================
# Optimizer
# ==========================================================

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)

criterion = nn.CrossEntropyLoss()

# ==========================================================
# Training
# ==========================================================

print("\nStarting Training...\n")

for epoch in range(EPOCHS):

    model.train()

    total_loss = 0

    for role_tokens, role_len, job_tokens, job_len in loader:

        role_tokens = role_tokens.to(DEVICE)
        role_len = role_len.to(DEVICE)

        job_tokens = job_tokens.to(DEVICE)
        job_len = job_len.to(DEVICE)

        optimizer.zero_grad()

        role_vectors, job_vectors = model(
            role_tokens,
            role_len,
            job_tokens,
            job_len
        )

        # ---------------------------------------
        # Similarity Matrix
        # Shape : (batch, batch)
        # ---------------------------------------

        logits = torch.matmul(
            role_vectors,
            job_vectors.T
        )

        logits = logits / TEMPERATURE

        labels = torch.arange(
            logits.size(0),
            device=DEVICE
        )

        loss_role = criterion(logits, labels)

        loss_job = criterion(logits.T, labels)

        loss = (loss_role + loss_job) / 2

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(loader)

    print(
        f"Epoch {epoch+1:03d}/{EPOCHS} | Loss = {avg_loss:.4f}"
    )

# ==========================================================
# Save Model
# ==========================================================

torch.save(
    model.state_dict(),
    "recruitment_embedding_model.pt"
)

print("\nTraining Finished.")

print("Model Saved : recruitment_embedding_model.pt")