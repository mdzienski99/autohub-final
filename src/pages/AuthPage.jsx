import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const avatars = ["🚗", "🏎️", "🏁", "🔧", "🛞", "⛽", "🧽", "🔥", "⚙️", "🛠️"];

export default function AuthPage({ session }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("🚗");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session) loadProfile();
  }, [session]);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) {
      setDisplayName(data.display_name || "");
      setAvatar(data.avatar || "🚗");
    } else if (session?.user) {
      await supabase.from("profiles").insert([
        {
          id: session.user.id,
          display_name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "AutoHub Driver",
          avatar: "🚗",
        },
      ]);

      setDisplayName(
        session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "AutoHub Driver"
      );
    }
  }

  async function login(e) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setMessage(error ? error.message : "Logged in successfully.");
  }

  async function signup(e) {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          display_name: email.split("@")[0],
          avatar: "🚗",
        },
      ]);
    }

    setMessage("Account created successfully.");
  }

  async function loginWithProvider(provider) {
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();

    const { error } = await supabase.from("profiles").upsert([
      {
        id: session.user.id,
        display_name: displayName || session.user.email.split("@")[0],
        avatar,
      },
    ]);

    setMessage(error ? error.message : "Profile saved.");
  }

  if (session) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="eyebrow">Driver Profile</p>
          <h1>Customize your AutoHub profile</h1>
          <p className="subtext">
            Your name and avatar will show next to your posts and comments.
          </p>

          <form className="form" onSubmit={saveProfile}>
            <label>Display Name</label>
            <input
              value={displayName}
              placeholder="Example: Mike"
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <label>Choose Avatar</label>
            <div className="avatar-grid">
              {avatars.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`avatar-choice ${
                    avatar === item ? "selected-avatar" : ""
                  }`}
                  onClick={() => setAvatar(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <button>Save Profile</button>

            {message && <p className="message">{message}</p>}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Join the Garage</p>
        <h1>Login or create an account</h1>
        <p className="subtext">
          Use email/password, Google, or GitHub to post builds, comment, and upvote.
        </p>

        <div className="oauth-row">
          <button
            type="button"
            className="oauth-btn"
            onClick={() => loginWithProvider("google")}
          >
            Continue with Google
          </button>

          <button
            type="button"
            className="oauth-btn github-btn"
            onClick={() => loginWithProvider("github")}
          >
            Continue with GitHub
          </button>
        </div>

        <div className="divider">
          <span>or use email</span>
        </div>

        <form className="form">
          <label>Email</label>
          <input
            type="email"
            placeholder="driver@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="button-row">
            <button onClick={login}>Login</button>
            <button className="secondary" onClick={signup}>
              Sign Up
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </section>
  );
}