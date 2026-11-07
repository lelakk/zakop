import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { FeedView } from "./views/FeedView";
import { PostDetailsView } from "./views/PostDetailsView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";

export function AppContent() {
  const [currentView, setCurrentView] = useState<"feed" | "post" | "login" | "register">("feed");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleSelectPost = (id: number) => {
    setSelectedPostId(id);
    setCurrentView("post");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onNavigate={(v) => setCurrentView(v)} />

      <main className="flex-1">
        {currentView === "feed" && (
          <FeedView
            onSelectPost={handleSelectPost}
            onRequireLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "post" && selectedPostId !== null && (
          <PostDetailsView
            postId={selectedPostId}
            onBack={() => setCurrentView("feed")}
            onRequireLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "login" && (
          <LoginView
            onSuccess={() => setCurrentView("feed")}
            onNavigateRegister={() => setCurrentView("register")}
          />
        )}

        {currentView === "register" && (
          <RegisterView
            onSuccess={() => setCurrentView("feed")}
            onNavigateLogin={() => setCurrentView("login")}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
