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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f5",
        color: "#111",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "1.75rem",
            marginBottom: "1.5rem",
            color: "#1f2937",
          }}
        >
          🧠 Carte Interactive IA - Géopolitique
        </h1>

        <IAQuery onResponse={handleIAResponse} />

        <AnimatePresence>
          {reponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundColor: "#e5e7eb",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                whiteSpace: "pre-line",
              }}
            >
              <strong>Réponse :</strong>
              <br />
              {reponse}
            </motion.div>
          )}
        </AnimatePresence>

        <MapView markers={markers} center={mapCenter} />
        <NewsFeed countryCode={countryCode} />
      </div>
    </div>
  );
}

export default App;
