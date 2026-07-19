const API_BASE_URL = "https://career-lens-ai-backend.onrender.com";

export interface ResumeParseResponse {
  name: string;
  email: string;
  phone: string;
  cgpa: number | null;
  skills: string[];
  frameworks: string[];
  tools: string[];
  roles: string[];
}

export async function uploadResume(file: File): Promise<ResumeParseResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Resume parsing failed: ${response.status}`);
  }

  return response.json();
}
