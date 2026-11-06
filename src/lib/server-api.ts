export async function serverFetch<T>(path: string, revalidateSeconds = 60): Promise<T | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api${path}`, {
      next: { revalidate: revalidateSeconds }, // cache for 60s, then refresh in the background
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}