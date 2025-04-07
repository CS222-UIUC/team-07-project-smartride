import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/context/AuthProvider.tsx";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute.tsx";
import LoginPage from "@/components/pages/LoginPage.tsx";
import HomePage from "@/components/pages/HomePage.tsx";
import StartPage from "@/components/pages/StartPage.tsx";

let authState = true; // true = logged in, false = logging/logged out

vi.mock("@/api/web/auth", () => ({
  checkLoginStatus: () => Promise.resolve(authState),
}));

vi.mock("@/api/web/login", () => ({
  loginUser: vi.fn(() => {
    authState = true;
    return Promise.resolve({ message: "Logged in" });
  }),
}));

vi.mock("@/api/web/logout", () => ({
  logoutUser: vi.fn(() => {
    authState = false;
    return Promise.resolve({ message: "Logged out" });
  }),
}));

function renderApp(initialPath = "/login") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute access="public" />}>
            <Route path="/start" element={<StartPage />} />
          </Route>
          <Route element={<ProtectedRoute access="auth" />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

// --- tests ---
describe("Auth flow: login and logout", () => {
  it("logs in and lands on HomePage", async () => {
    authState = true;
    renderApp("/login");

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Welcome Home/i)).toBeInTheDocument();
    });
  });

  it("logs out and lands on StartPage", async () => {
    authState = true;
    renderApp("/home");

    await waitFor(() => {
      expect(screen.getByText(/Welcome Home/i)).toBeInTheDocument();
    });

    authState = false;
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please login or create/i)).toBeInTheDocument();
    });
  });

  it("kicks to StartPage if user is unauthorized", async () => {
    authState = false;
    renderApp("/home");

    await waitFor(() => {
      expect(screen.getByText(/Please login or create/i)).toBeInTheDocument();
    });
  });
});
