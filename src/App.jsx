/**
 * Secure App Component with Security Headers and Protection
 */

import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import SecurityHeaders from "./middleware/SecurityHeaders";
import { lazy, Suspense, useEffect, useState } from "react";
import ProfileCompletionModal from "./components/Profile/ProfileCompletionModal";

// Layout
import Layout from "./components/Layout/Layout";
import UserGuard from "./components/Layout/UserGuard";

// Guards
import CoreMemberGuard from "./components/Guards/CoreMemberGuard";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events-new";
import EventDetailPage from "./pages/EventDetailPage"; // Import the detail page
import Team from "./pages/Team-new";
import Profile from "./pages/Profile-new";
import Recruit from "./pages/Recruit-new";
import NotFound from "./pages/NotFound";
import CoreMemberProfile from "./pages/CoreMemberProfile";
import EventRegistration from "./pages/EventRegistration";

// Admin Components
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminGuard = lazy(() => import("./components/Admin/AdminGuard"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers-clean"));
const AdminEvents = lazy(() => import("./pages/Admin/AdminEvents"));
const AdminEMembers = lazy(() => import("./pages/Admin/AdminEMembers-clean"));

const AdminLoading = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const { user, isProfileIncomplete, checkProfileCompletion } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (user && isProfileIncomplete) {
      setShowProfileModal(true);
    } else {
      setShowProfileModal(false);
    }
  }, [user, isProfileIncomplete]);

  const handleProfileComplete = async () => {
    await checkProfileCompletion();
    setShowProfileModal(false);
  };

  return (
    <>
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onComplete={handleProfileComplete}
        onClose={() => setShowProfileModal(false)}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#1f2937",
              color: "#fff",
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            {/* TWEAK: Standardized the parameter to :id */}
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="team" element={<Team />} />
            <Route path="recruit" element={<Recruit />} />
            {/* TWEAK: This is the single, correct route for registration */}
            <Route path="events/:id/register" element={<EventRegistration />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <UserGuard>
                <Layout />
              </UserGuard>
            }
          >
            <Route index element={<Profile />} />
          </Route>

          {/* Core Member Profile Route */}
          <Route
            path="/core-profile"
            element={
              <CoreMemberGuard>
                <Layout />
              </CoreMemberGuard>
            }
          >
            <Route index element={<CoreMemberProfile />} />
          </Route>

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              </Suspense>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="members" element={<AdminEMembers />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <SecurityHeaders>
            <AppContent />
          </SecurityHeaders>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
