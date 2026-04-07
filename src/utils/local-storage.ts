function isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }
  
  export function setLocalStorage(
    key: string,
    value: string
  ): void {
    if (!isBrowser()) return;
    localStorage.setItem(key, value);
  }
  
  export function getLocalStorage(
    key: string
  ): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(key);
  }
  
  export function deleteLocalStorage(key: string): void {
    if (!isBrowser()) return;
    localStorage.removeItem(key);
  }
  