export async function adminFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string; status: number }> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { error: json.error ?? "Request failed", status: res.status };
  }

  return { data: json as T, status: res.status };
}
