const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiClientError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export interface CVItem {
  id: string;
  fileName: string;
  fileUrl: string;
  rawText: string;
  status: "PROCESSING" | "READY" | "FAILED";
  errorMessage?: string | null;
  createdAt: string;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // If body is NOT FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      data?.code || "UNKNOWN_ERROR",
      data?.error || "Đã có lỗi xảy ra"
    );
  }

  return data as T;
}

// CV API helpers
export async function uploadCv(file: File): Promise<{ cv: CVItem }> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<{ cv: CVItem }>("/api/cv", {
    method: "POST",
    body: formData,
  });
}

export async function getCvs(): Promise<{ cvs: CVItem[] }> {
  return apiFetch<{ cvs: CVItem[] }>("/api/cv");
}

export async function deleteCv(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/cv/${id}`, {
    method: "DELETE",
  });
}

// Job Description API helpers
export interface JobDescriptionItem {
  id: string;
  title?: string | null;
  company?: string | null;
  rawText: string;
  createdAt: string;
}

export async function createJobDescription(data: {
  rawText: string;
  title?: string;
  company?: string;
}): Promise<{ jobDescription: JobDescriptionItem }> {
  return apiFetch<{ jobDescription: JobDescriptionItem }>(
    "/api/job-descriptions",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getJobDescriptions(): Promise<{
  jobDescriptions: JobDescriptionItem[];
}> {
  return apiFetch<{ jobDescriptions: JobDescriptionItem[] }>(
    "/api/job-descriptions"
  );
}

export async function deleteJobDescription(
  id: string
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/job-descriptions/${id}`, {
    method: "DELETE",
  });
}