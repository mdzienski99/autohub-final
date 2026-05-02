import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function EditPostPage({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Showcase");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setMessage("Post not found.");
      return;
    }

    if (data.user_id !== session.user.id) {
      setMessage("You can only edit your own posts.");
      return;
    }

    setTitle(data.title || "");
    setCategory(data.category || "Showcase");
    setContent(data.content || "");
    setImage(data.image_url || "");
  }

  async function save(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("posts")
      .update({
        title: title.trim(),
        category,
        content: content.trim(),
        image_url: image.trim(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate(`/post/${id}`);
  }

  return (
    <section className="form-page">
      <div className="form-card">
        <p className="eyebrow">Edit Garage Post</p>
        <h1>Update your AutoHub discussion</h1>

        <form className="form" onSubmit={save}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

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
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />

          <label>Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} />

          <button>Save Changes</button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </section>
  );
}