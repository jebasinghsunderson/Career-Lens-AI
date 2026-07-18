from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from uuid import uuid4
from resume_parser.parser import parse_resume

from resume_parser.pdf_extractor import extract_text
from resume_parser.utils import clean_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
def home():
    return {"message": "CareerLens AI Backend Running"}


@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    file_extension = Path(file.filename).suffix
    file_path = UPLOAD_DIR / f"{uuid4()}{file_extension}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = extract_text(str(file_path))
    text = clean_text(text)

    parsed_resume = parse_resume(text)

    print(parsed_resume)

    return parsed_resume