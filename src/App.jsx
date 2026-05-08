import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./store/AuthContext";
import theme from "./theme/theme";

// Pages (lazy loaded for performance)
import AuthPage from "./pages/AuthPage";
import BookingSummaryPage from "./pages/BookingSummaryPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import DashboardPage from "./pages/DashboardPage";
import ManageAppointmentsPage from "./pages/ManageAppointmentsPage";
import NewBookingPage from "./pages/NewBookingPage";
import OTPPage from "./pages/OTPPage";

function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      }}
    >
      <CircularProgress color="primary" size={48} />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/otp" element={<OTPPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <DashboardPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <ManageAppointmentsPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <NewBookingPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/summary"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <BookingSummaryPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/confirmation"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <ConfirmationPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
