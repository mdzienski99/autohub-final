import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [sort]);

  async function loadPosts() {
    setLoading(true);

    const { data } = await supabase
      .from("posts")
      .select("*")
      .order(sort, { ascending: false });

    setPosts(data || []);
    setLoading(false);
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || post.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, categoryFilter]);

  const topPosts = [...posts]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  return (
    <section className="home-page">
      <div className="hero autohub-hero">
        <div>
          <p className="eyebrow">Car Community</p>
          <h1>Share your build. Get real feedback.</h1>
          <p>
            AutoHub is a community forum for car people to post builds, mods,
            detailing setups, repair questions, reviews, and garage ideas.
          </p>

          <div className="hero-actions">
            <Link className="primary-link" to="/create">Post Your Build</Link>
            <Link className="ghost-link" to="/auth">Customize Profile</Link>
          </div>
        </div>

        <div className="hero-stat-card">
          <span>🏁</span>
          <h3>{posts.length}</h3>
          <p>Garage posts</p>
        </div>
      </div>

      {topPosts.length > 0 && (
        <div className="trending-section">
          <div className="section-title-row">
            <h2>🔥 Trending in the Garage</h2>
            <p>Most upvoted posts right now</p>
          </div>

          <div className="trending-grid">
            {topPosts.map((post) => (
              <Link to={`/post/${post.id}`} className="trending-card" key={post.id}>
                <span className="tag">{post.category || "Showcase"}</span>
                <h3>{post.title}</h3>
                <p>👍 {post.upvotes} upvotes</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="toolbar">
        <input
          placeholder="Search builds, mods, questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Build">Build</option>
          <option value="Question">Question</option>
          <option value="Review">Review</option>
          <option value="Showcase">Showcase</option>
          <option value="Repair">Repair</option>
          <option value="Detailing">Detailing</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="created_at">Newest First</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state">Loading garage feed...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>Start the garage feed by creating the first AutoHub post.</p>
        </div>
      ) : (
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <Link to={`/post/${post.id}`} className="post-card" key={post.id}>
              <div className="post-card-top">
                <div className="mini-avatar">{post.author_avatar || "🚗"}</div>
                <div>
                  <strong>{post.author_name || post.author_email || "AutoHub User"}</strong>
                  <p>{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="card-title-row">
                <h2>{post.title}</h2>
                <span className="tag">{post.category || "Showcase"}</span>
              </div>

              {post.content && (
                <p className="post-preview">
                  {post.content.length > 120
                    ? post.content.slice(0, 120) + "..."
                    : post.content}
                </p>
              )}

              {post.image_url && <img src={post.image_url} alt={post.title} />}

              <div className="card-stats">
                <span>👍 {post.upvotes} upvotes</span>
                <span>Open post →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}