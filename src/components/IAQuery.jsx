import { useState } from "react";

export default function IAQuery({ onResponse }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant spécialisé en géopolitique. Réponds toujours en français de manière claire et concise.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content || "Pas de réponse de l'IA.";
      onResponse(reply);
    } catch (err) {
      console.error("Erreur Mistral :", err);
      onResponse("Erreur lors de l'appel à l'IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Pose une question géopolitique..."
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
          fontSize: "1rem",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem 1.25rem",
          backgroundColor: loading ? "#94a3b8" : "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {loading ? "Chargement..." : "Envoyer"}
      </button>
    </form>
  );
}
