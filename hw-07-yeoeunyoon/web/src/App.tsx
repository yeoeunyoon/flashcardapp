import Feed from "@/components/feed";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useStore } from "@nanostores/react";
import { $router } from "@/lib/router";
import Login from "./pages/login";
import Register from "./pages/register";
import CardsPage from "./pages/CardsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserMenu from "./components/user-menu";


function App() {
  const page = useStore($router); // $router에서 현재 페이지 상태 가져오기

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <NotFoundPage />
      </div>
    );
  }

  // 로그인 및 회원가입 페이지 렌더링
  if (page.route === "login" || page.route === "register") {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        {page.route === "login" && <Login />}
        {page.route === "register" && <Register />}
      </div>
    );
  }

  // 메인 앱 구조
  return (
    <Router>
    <div className="flex min-h-dvh">
      <Toaster/>
      <div className="flex-1 min-w-14">
        <Sidebar/>
      </div>
      <div className = "w-full max-w-md mx-auto md:max-w-lg">
        <Routes>
        < Route path="/register" element={<Register />} /> {/* Register 경로 */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Feed />} />
          <Route path="/decks/:deckId" element={<CardsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
    <div className="flex-1"><UserMenu /></div>
    <Toaster />
  </Router>
  );
}

export default App;
