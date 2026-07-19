import re


def normalize_whitespace(text: str) -> str:
    """
    Replace multiple spaces and tabs with a single space.
    """
    return re.sub(r"[ \t]+", " ", text)


def remove_extra_blank_lines(text: str) -> str:
    """
    Replace multiple blank lines with a single blank line.
    """
    return re.sub(r"\n\s*\n+", "\n\n", text)


def clean_text(text: str) -> str:
    """
    Clean extracted resume text before sending it to the LLM.
    """
    text = normalize_whitespace(text)
    text = remove_extra_blank_lines(text)

    return text.strip()