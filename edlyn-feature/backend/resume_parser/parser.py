import re
from flashtext import KeywordProcessor

skill_processor = KeywordProcessor(case_sensitive=False)
framework_processor = KeywordProcessor(case_sensitive=False)
tool_processor = KeywordProcessor(case_sensitive=False)
role_processor = KeywordProcessor(case_sensitive=False)

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

for skill in SKILLS:
    skill_processor.add_keyword(skill)

for framework in FRAMEWORKS:
    framework_processor.add_keyword(framework)

for tool in TOOLS:
    tool_processor.add_keyword(tool)

for role in ROLES:
    role_processor.add_keyword(role)



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
    return sorted(set(skill.title() for skill in skill_processor.extract_keywords(text)))


def extract_frameworks(text):
    return sorted(set(framework.title() for framework in framework_processor.extract_keywords(text)))


def extract_tools(text):
    return sorted(set(tool.title() for tool in tool_processor.extract_keywords(text)))


def extract_roles(text):
    return sorted(set(role.title() for role in role_processor.extract_keywords(text)))


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