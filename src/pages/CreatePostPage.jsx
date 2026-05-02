import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CreatePostPage({ session }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Showcase");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(data);
  }

  async function submit(e) {
    e.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: title.trim(),
          category,
          content: content.trim(),
          image_url: image.trim(),
          user_id: session.user.id,
          author_email: session.user.email,
          author_name: profile?.display_name || session.user.email.split("@")[0],
          author_avatar: profile?.avatar || "🚗",
        },
      ])
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate(`/post/${data.id}`);
  }

  return (
    <section className="form-page">
      <div className="form-card">
        <p className="eyebrow">New Garage Post</p>
        <h1>Post to AutoHub</h1>
        <p className="subtext">
          Share a build, ask a car question, review a part, or show off your setup.
        </p>

        <form className="form" onSubmit={submit}>
          <label>Post Title</label>
          <input
            placeholder="Example: Best exhaust setup for BMW M340i?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Build">Build</option>
            <option value="Question">Question</option>
            <option value="Review">Review</option>
            <option value="Showcase">Showcase</option>
            <option value="Repair">Repair</option>
            <option value="Detailing">Detailing</option>
          </select>

          <label>Description</label>
          <textarea
            placeholder="Describe your build, mod, issue, question, or review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <label>Image URL</label>
          <input
            placeholder="Paste a car image URL here"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          {image && (
            <div className="image-preview">
              <p>Image preview</p>
              <img src={image} alt="Preview" />
            </div>
          )}

          <button>Create Garage Post</button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </section>
  );
}