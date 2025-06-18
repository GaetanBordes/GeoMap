import { useEffect, useState } from "react";

export default function NewsFeed({ countryCode }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      if (!countryCode) return;

      try {
        const res = await fetch(
          `https://newsdata.io/api/1/news?apikey=${
            import.meta.env.VITE_NEWS_API_KEY
          }&country=${countryCode}&language=fr&category=politics`
        );
        const data = await res.json();
        if (data.results) {
          setArticles(data.results.slice(0, 5)); // les 5 premiers articles
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error("Erreur actualités :", err);
        setArticles([]);
      }
    }

    fetchNews();
  }, [countryCode]);

  if (!countryCode) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📰 Actualités géopolitiques</h2>
      {articles.length === 0 ? (
        <p>Aucune actualité trouvée pour ce pays.</p>
      ) : (
        <ul>
          {articles.map((article, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
