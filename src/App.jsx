import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage";

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/auth" />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Layout session={session}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage session={session} />} />
        <Route path="/game" element={<GamePage />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute session={session}>
              <CreatePostPage session={session} />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<PostPage session={session} />} />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute session={session}>
              <EditPostPage session={session} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}