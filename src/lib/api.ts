export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const send = (path: string, init: RequestInit) =>
  fetch(`/api${path}`, {
    ...init,
    credentials: "include", 
    headers: { "Content-Type": "application/json", ...init.headers },
  });

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  };

  let res = await send(path, init);

  if (res.status === 401) {
    const refreshed = await send("/jwt", { method: "POST" });
    if (refreshed.ok) res = await send(path, init);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message ?? "Something went wrong. Please try again.", res.status);
  }
  return data as T;
}

export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong. Please try again.";