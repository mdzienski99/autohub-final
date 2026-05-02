import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Layout({ session, children }) {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <Link className="logo" to="/">🏎️ AutoHub </Link>

        <div className="nav-links">
          <Link to="/">Garage Feed</Link>
          <Link to="/create">New Post</Link>
          <Link to="/game">Haul Game</Link>
          <Link to="/auth">{session ? "Profile" : "Login"}</Link>
        </div>

        <div className="nav-user">
          {session ? (
            <>
              <span>{session.user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <span>Built for car people</span>
          )}
        </div>
      </nav>

      <main className="container">{children}</main>
    </div>
  );
}