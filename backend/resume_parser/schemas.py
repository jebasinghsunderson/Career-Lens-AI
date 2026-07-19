from pydantic import BaseModel, Field

class ResumeResponse(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

    education: List[Education] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    sector_interest: List[str] = Field(default_factory=list)