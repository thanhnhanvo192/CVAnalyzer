const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiClientError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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