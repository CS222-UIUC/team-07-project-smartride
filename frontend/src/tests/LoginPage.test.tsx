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

            <Route element={<ProtectedRoute access="auth" />}>
              <Route path="/home" element={<div>HomePage</div>} />
            </Route>

            <Route element={<ProtectedRoute access="public" />}>
              <Route path="/start" element={<div>StartPage</div>} />
            </Route>
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
