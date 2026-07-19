import torch
import torch.nn as nn
import torch.nn.functional as F


class RecruitmentEmbeddingModel(nn.Module):
    """
    Shared embedding model for Roles and Job Descriptions.
    """

    def __init__(self, vocab_size, embedding_dim=128):
        super().__init__()

        # Shared embedding layer
        self.embedding = nn.Embedding(
            num_embeddings=vocab_size,
            embedding_dim=embedding_dim,
            padding_idx=0
        )

    # -----------------------------------------------------
    # Mean Pooling (ignores padding)
    # -----------------------------------------------------
    def mean_pool(self, embeddings, lengths):
        """
        embeddings : (batch, seq_len, embedding_dim)
        lengths    : (batch,)
        """

        # Mask PAD tokens
        mask = (
            torch.arange(embeddings.size(1), device=embeddings.device)
            .unsqueeze(0)
            < lengths.unsqueeze(1)
        )

        mask = mask.unsqueeze(-1).float()

        embeddings = embeddings * mask

        summed = embeddings.sum(dim=1)

        pooled = summed / lengths.unsqueeze(1).float()

        return pooled

    # -----------------------------------------------------
    # Encode
    # -----------------------------------------------------
    def encode(self, tokens, lengths):
        """
        tokens  : (batch, seq_len)
        lengths : (batch,)
        """

        embeddings = self.embedding(tokens)

        pooled = self.mean_pool(embeddings, lengths)

        pooled = F.normalize(pooled, p=2, dim=1)

        return pooled

    # -----------------------------------------------------
    # Forward
    # -----------------------------------------------------
    def forward(
        self,
        role_tokens,
        role_lengths,
        job_tokens,
        job_lengths
    ):

        role_vectors = self.encode(
            role_tokens,
            role_lengths
        )

        job_vectors = self.encode(
            job_tokens,
            job_lengths
        )

        return role_vectors, job_vectors