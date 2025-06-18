import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import backgroundImage from "./assets/bg.jpeg";
import logoImage from "./assets/logo.png";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LibraryPage from "./pages/LibraryPage";
import InformationPage from "./pages/InformationPage";
import GameSetup from "./pages/GameSetup";
import PlayerDraw from "./pages/PlayerDraw";
import PlayerWordCardScreen from "./pages/PlayerWordCardScreen";
import LoginUsername from "./pages/LoginUsername";
import PlayerShowWord from "./pages/PlayerShowWord";
import VoteScreen from "./pages/VoteScreen";
import Leaderboard from "./pages/Leaderboard";
import MrWhiteGuess from "./pages/MrWhiteGuess";
import LeaderboardPage from "./pages/LeaderboardPage";

// Komponen wrapper untuk loading logic
function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        onComplete={() => setIsLoading(false)}
        backgroundImage={backgroundImage}
        logoImage={logoImage}
      />
    );
  }

  // Setelah loading selesai, redirect ke dashboard jika sudah login, ke login jika belum
  if (location.pathname === "/") {
    return <Navigate to={currentUser ? "/dashboard" : "/login"} replace />;
  }

  return (
    <Routes>
      {/* Admin & dashboard routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/information" element={<InformationPage />} />

      {/* Game flow routes */}
      <Route path="/gamesetup" element={<GameSetup />} />
      <Route path="/playerdraw" element={<PlayerDraw />} />
      <Route path="/playerwordcard" element={<PlayerWordCardScreen />} />
      <Route path="/login-username" element={<LoginUsername />} />
      <Route path="/playershowword" element={<PlayerShowWord />} />
      <Route path="/votescreen" element={<VoteScreen />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/mrwhiteguess" element={<MrWhiteGuess />} />
      <Route path="/leaderboardpage" element={<LeaderboardPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AppWrapper />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
