import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useStore } from "@nanostores/react";
import Login from "./pages/login";
import Register from "./pages/register";
import CardsPage from "./pages/CardsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Routes, Route } from "react-router-dom";
import UserMenu from "./components/user-menu";
import { $user } from "@/lib/store";
import useAuth from "@/hooks/use-auth";
import { useEffect } from "react";

function App() {
  const user = useStore($user);
  const { checkSession } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkSession();
      if (!isValid && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    };
    checkAuth();
  }, [checkSession]);

  return (
    <div className="flex min-h-dvh">
      <Toaster/>
      <div className="flex-1 min-w-14">
        <Sidebar/>
      </div>
      <div className = "w-full max-w-md mx-auto md:max-w-lg">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={user ? <Feed /> : <Login />} />
          <Route path="/decks/:deckId" element={user ? <CardsPage /> : <Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <div className="flex-1"><UserMenu /></div>
      <Toaster />
    </div>
  );
}

export default App;
