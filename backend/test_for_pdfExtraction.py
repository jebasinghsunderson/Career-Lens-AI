from resume_parser.pdf_extractor import extract_text
from resume_parser.utils import clean_text

text = extract_text("sample_resumes/Edlyn Resume.pdf")

cleaned = clean_text(text)

print(cleaned)