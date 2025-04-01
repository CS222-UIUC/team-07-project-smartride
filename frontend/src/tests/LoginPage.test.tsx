import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/components/pages/LoginPage";
import { AuthProvider } from "@/components/context/AuthProvider";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("@/api/web/auth", () => ({
  checkLoginStatus: () => {
    return Promise.resolve(true);
  },
}));

vi.mock("@/api/web/login", () => ({
  loginUser: vi.fn(() => {
    return Promise.resolve({ message: "Logged in" });
  }),
}));

describe.each([1, 2, 3, 4, 5])("LoginPage attempt #%i", () => {
  it("Mock Test of whether Successful Logins Always Navigate To Home", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute access="auth">
                  <div>HomePage</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/start"
              element={
                <ProtectedRoute access="public">
                  <div>StartPage</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("HomePage")).toBeInTheDocument();
    });
  });
});
