import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppSidebar from "./components/AppSidebar";
import MobileBottomNav from "./components/MobileBottomNav";
import Overview from "./pages/Overview";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Library from "./pages/Library";
import Features from "./pages/Features";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AIChat from "./pages/AIChat";
import Settings from "./pages/Settings";
import { useAuth } from "./contexts/AuthContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <main className="page-shell">
        <div className="container">
          <p className="section-lead">Loading account...</p>
        </div>
      </main>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

/** Marketing / public pages use top navbar. App pages use the left sidebar. */
const MARKETING_PATHS = new Set(["/", "/auth", "/features", "/about"]);

function AppLayout() {
  const { pathname } = useLocation();
  const isMarketing = MARKETING_PATHS.has(pathname);
  const hideSidebar = isMarketing;
  const hideFooter = pathname === "/ai-chat" || pathname === "/auth";
  const hideMobileNav = pathname === "/auth";

  return (
    <div
      className={`app-shell ${hideSidebar ? "is-marketing" : "has-desktop-sidebar"} ${hideFooter ? "no-footer" : ""} ${hideMobileNav ? "no-mobile-nav" : ""}`.trim()}
    >
      <ScrollToTop />
      <div className="app-shell-body">
        {hideSidebar ? null : <AppSidebar />}
        <div className="app-shell-main">
          <Navbar />
          <div className="app-shell-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          {hideFooter ? null : <Footer />}
        </div>
      </div>
      {hideMobileNav ? null : <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
