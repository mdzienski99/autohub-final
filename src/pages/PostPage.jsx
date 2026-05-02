import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function PostPage({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
    if (session) loadProfile();
  }, [id, session]);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(data);
  }

  async function load() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    const { data: commentData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    setPost(data);
    setComments(commentData || []);
  }

  async function upvote() {
    await supabase.rpc("increment_post_upvotes", {
      target_post_id: id,
    });

    load();
  }

  async function addComment(e) {
    e.preventDefault();

    if (!session) {
      setMessage("You must be logged in to comment.");
      return;
    }

    if (!text.trim()) {
      return;
    }

    await supabase.from("comments").insert([
      {
        post_id: id,
        body: text.trim(),
        user_id: session.user.id,
        author_email: session.user.email,
        author_name: profile?.display_name || session.user.email.split("@")[0],
        author_avatar: profile?.avatar || "🚗",
      },
    ]);

    setText("");
    load();
  }

  async function deletePost() {
    const confirmDelete = window.confirm("Delete this garage post?");

    if (!confirmDelete) {
      return;
    }

    await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    navigate("/");
  }

  async function generateSummary() {
    setMessage("");
    setSummary("Generating AI summary...");

    try {
      const response = await fetch("/.netlify/functions/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: {
            title: post.title,
            category: post.category,
            content: post.content,
            image_url: post.image_url,
            upvotes: post.upvotes,
            comment_count: comments.length,
            comments: comments.map((comment) => comment.body),
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not generate summary.");
      }

      setSummary(result.summary);
    } catch (error) {
      setSummary("");
      setMessage(error.message);
    }
  }

  if (!post) {
    return <div className="empty-state">Loading garage post...</div>;
  }

  const isOwner = session?.user?.id === post.user_id;

  return (
    <section className="post-detail">
      <div className="post-panel">
        <div className="post-header-row">
          <div>
            <p className="eyebrow">AutoHub Discussion</p>

            <div className="title-with-tag">
              <h1>{post.title}</h1>
              <span className="tag">{post.category || "Showcase"}</span>
            </div>

            <div className="author-line">
              <span className="mini-avatar">{post.author_avatar || "🚗"}</span>
              <span>
                {post.author_name || post.author_email || "AutoHub user"}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="post-actions">
              <Link className="small-btn" to={`/edit/${post.id}`}>
                Edit
              </Link>

              <button className="small-btn danger" onClick={deletePost}>
                Delete
              </button>
            </div>
          )}
        </div>

        {post.content && <p className="post-body">{post.content}</p>}

        {post.image_url && (
          <img
            className="post-image-large"
            src={post.image_url}
            alt={post.title}
          />
        )}

        <div className="stats-row">
          <button onClick={upvote}>👍 Upvote</button>
          <span>{post.upvotes} upvotes</span>
          <span>{comments.length} comments</span>
        </div>

        <div className="summary-box">
          <div className="summary-top">
            <div>
              <p className="eyebrow">AI Garage Assistant</p>
              <h2>Post Summary</h2>
            </div>

            <button onClick={generateSummary}>Generate Summary</button>
          </div>

          {summary ? (
            <pre>{summary}</pre>
          ) : (
            <p className="subtext">
              Click the button to summarize this car discussion using the
              post, category, upvotes, and comments.
            </p>
          )}
        </div>

        <div className="comments-section">
          <h2>Garage Comments</h2>

          {comments.length === 0 && (
            <p className="subtext">
              No comments yet. Start the garage discussion.
            </p>
          )}

          {comments.map((comment) => (
            <div className="comment-card" key={comment.id}>
              <div className="comment-avatar">
                {comment.author_avatar || "🚗"}
              </div>

              <div>
                <strong>
                  {comment.author_name ||
                    comment.author_email ||
                    "Anonymous Driver"}
                </strong>
                <p>{comment.body}</p>
              </div>
            </div>
          ))}

          {session ? (
            <form className="comment-form" onSubmit={addComment}>
              <textarea
                placeholder="Add your garage advice, opinion, or question..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <button>Add Garage Comment</button>
            </form>
          ) : (
            <p className="subtext">Log in to comment.</p>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </section>
  );
}