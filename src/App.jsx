// ✅ App.jsx
import { useState } from "react";
import "./App.css";
import MapView from "./components/MapView";
import IAQuery from "./components/IAQuery";
import NewsFeed from "./components/NewsFeed";
import countries from "./data/countries.json";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [reponse, setReponse] = useState("");
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]);
  const [countryCode, setCountryCode] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  function handleIAResponse(reply) {
    setReponse(reply);

    const newMarkers = [];
    let sumLat = 0;
    let sumLng = 0;
    let detectedCount = 0;
    let firstCode = null;

    for (const country of countries) {
      for (const alias of country.aliases) {
        if (reply.toLowerCase().includes(alias.toLowerCase())) {
          newMarkers.push({ position: country.coord, label: country.nom });
          sumLat += country.coord[0];
          sumLng += country.coord[1];
          detectedCount++;

          if (!firstCode) {
            firstCode = country.code;
          }
          break;
        }
      }
    }

    setMarkers(newMarkers);

    if (detectedCount > 0) {
      const avgLat = sumLat / detectedCount;
      const avgLng = sumLng / detectedCount;
      setMapCenter([avgLat, avgLng]);
      setCountryCode(firstCode);
    }
  }

  const themeStyles = {
    backgroundColor: darkMode ? "#1e1e1e" : "#f4f4f5",
    color: darkMode ? "#f9fafb" : "#111",
  };

  return (
    <div style={{ minHeight: "100vh", ...themeStyles, position: "relative" }}>
      {/* Bouton dark mode en haut à droite absolu */}
      <div
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1000 }}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: darkMode ? "#f9fafb" : "#1f2937",
            color: darkMode ? "#1f2937" : "#f9fafb",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {darkMode ? "☀️ Clair" : "🌙 Sombre"}
        </button>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderRadius: "12px",
            padding: "1rem",
            backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.75rem" }}>
            🧠 Carte Interactive IA - Géopolitique
          </h1>
        </div>

        {/* Zone de question */}
        <div
          style={{
            backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <IAQuery onResponse={handleIAResponse} />
        </div>

        {/* Réponse IA */}
        <AnimatePresence>
          {reponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                whiteSpace: "pre-line",
              }}
            >
              <strong>Réponse :</strong>
              <br />
              {reponse}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carte */}
        <div
          style={{
            backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <MapView markers={markers} center={mapCenter} darkMode={darkMode} />
        </div>

        {/* News */}
        <div
          style={{
            backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <NewsFeed countryCode={countryCode} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
