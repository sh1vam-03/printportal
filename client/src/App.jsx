import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

import TeacherRoutes from "./pages/teacher";
import AdminRoutes from "./pages/admin";
import PrintingRoutes from "./pages/printing";
import HelpCenter from "./pages/public/HelpCenter";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import LandingPage from "./pages/public/LandingPage";

const App = () => {
  const { user, loading } = useContext(AuthContext);

  // ⛔ Prevent white screen while auth is loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Role-based redirect */}
        <Route
          path="/dashboard"
          element={
            user?.role === "TEACHER" ? (
              <Navigate to="/teacher" />
            ) : user?.role === "ADMIN" ? (
              <Navigate to="/admin" />
            ) : user?.role === "PRINTING" ? (
              <Navigate to="/printing" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Dashboards */}
        <Route path="/teacher/*" element={<TeacherRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/printing/*" element={<PrintingRoutes />} />

        {/* Public Pages */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
