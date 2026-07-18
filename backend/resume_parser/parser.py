import re

SKILLS = {
    "python", "java", "c", "c++", "sql", "javascript",
    "html", "css", "react", "node.js", "fastapi",
    "flask", "django", "spring boot", "mysql",
    "mongodb", "postgresql", "git", "github",
    "docker", "aws", "figma", "pandas",
    "numpy", "scikit-learn", "tensorflow", "pytorch"
}

FRAMEWORKS = {
    "fastapi", "flask", "django", "react",
    "spring boot", "angular", "vue"
}

TOOLS = {
    "git", "github", "figma", "postman",
    "vscode", "jupyter", "docker"
}

ROLES = {
    "backend developer",
    "frontend developer",
    "full stack developer",
    "software engineer",
    "python developer",
    "java developer",
    "data analyst",
    "machine learning engineer",
    "ai engineer"
}


def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else ""


def extract_phone(text):
    match = re.search(r'(\+91[\s-]?)?[6-9]\d{9}', text)
    return match.group(0) if match else ""


def extract_cgpa(text):
    match = re.search(r'CGPA[:\s]*([0-9]+(?:\.[0-9]+)?)', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None


def extract_skills(text):
    text_lower = text.lower()
    return sorted([
        skill.title()
        for skill in SKILLS
        if skill in text_lower
    ])


def extract_frameworks(text):
    text_lower = text.lower()
    return sorted([
        framework.title()
        for framework in FRAMEWORKS
        if framework in text_lower
    ])


def extract_tools(text):
    text_lower = text.lower()
    return sorted([
        tool.title()
        for tool in TOOLS
        if tool in text_lower
    ])


def extract_roles(text):
    text_lower = text.lower()
    return sorted([
        role.title()
        for role in ROLES
        if role in text_lower
    ])


def parse_resume(text):

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    name = lines[0] if lines else ""

    return {
        "name": name,
        "email": extract_email(text),
        "phone": extract_phone(text),
        "cgpa": extract_cgpa(text),
        "skills": extract_skills(text),
        "frameworks": extract_frameworks(text),
        "tools": extract_tools(text),
        "roles": extract_roles(text)
    }