const LOGIN_MARK_KEY = "has_logged_in";

export function markLoggedIn(): void {
  localStorage.setItem(LOGIN_MARK_KEY, "true");
}

export function clearLoginMark(): void {
  localStorage.removeItem(LOGIN_MARK_KEY);
}

export function hasLoggedInBefore(): boolean {
  return localStorage.getItem(LOGIN_MARK_KEY) === "true";
}
