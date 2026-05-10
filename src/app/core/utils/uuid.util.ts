// Utility used only for local testing/fallback when backend is unavailable.
// In production the backend generates IDs and the frontend must not set them.
export function generateUuid(): string {
  // simples gerador de UUID v4 — suficiente para mocks locais
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
