const STORAGE_KEY = "browser-id";

export function getBrowserId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}
