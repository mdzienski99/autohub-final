export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY." }),
      };
    }

    const { post } = JSON.parse(event.body || "{}");

    if (!post?.title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing post data." }),
      };
    }

    const prompt = `
You are the AI Garage Assistant for AutoHub, a car community forum.

Create a clean, helpful summary of this post.

Use this format:

Overview:
2 short sentences.

Garage Highlights:
- bullet 1
- bullet 2
- bullet 3

Engagement:
1 short sentence about upvotes and comments.

Post data:
Title: ${post.title}
Category: ${post.category || "Showcase"}
Description: ${post.content || "No description provided."}
Upvotes: ${post.upvotes}
Comment count: ${post.comment_count}
Comments:
${(post.comments || []).map((c, i) => `${i + 1}. ${c}`).join("\n") || "No comments"}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data?.error?.message || "OpenAI request failed.",
        }),
      };
    }

    let summary = data.output_text;

    if (!summary && Array.isArray(data.output)) {
      summary = data.output
        .flatMap((item) => item.content || [])
        .map((content) => content.text || "")
        .join("\n")
        .trim();
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: summary || "Summary was generated, but no text was returned.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Server error.",
      }),
    };
  }
}