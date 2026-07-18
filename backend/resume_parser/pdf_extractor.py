import fitz  # PyMuPDF

# input -> resume.. output -> entire extracted text from the resume
def extract_text(pdf_path: str) -> str:
    """
    Extracts text from a PDF resume.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        Extracted text as a single string.
    """

    document = fitz.open(pdf_path) # opens the doc

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text.strip()