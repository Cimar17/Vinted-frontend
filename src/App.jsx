// App.jsx — Router + Auth (token cookie)
// - Déclare les routes (Home, Offer, Signup, Login)
// - Gère l'authentification via un token stocké en cookie
// - Les filtres : Header = l’utilisateur écrit les filtres, Home = la page lit les filtres pour afficher les résultats

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Pages
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Publish from "./pages/Publish";

// UI
import Header from "./components/Header";

const App = () => {
  /* ================= AUTH ================= */

  // Token en mémoire (null = non connecté)
  const [userToken, setUserToken] = useState(null);

  // Écrit/supprime le token dans le cookie + synchronise l'état
  const setUser = (token) => {
    if (token) {
      Cookies.set("vintedToken", token, { expires: 7 });
      setUserToken(token);
    } else {
      Cookies.remove("vintedToken");
      setUserToken(null);
    }
  };

  // Auto : au montage → relit le cookie pour rester connecté
  useEffect(() => {
    const saved = Cookies.get("vintedToken");
    setUserToken(saved || null);
  }, []);

  /* =============== FILTRES (Header ↔ Home) =============== */

  // Saisie côté Header, utilisée côté Home pour l'appel API
  const [title, setTitle] = useState("");
  const [priceMin, setPriceMin] = useState(""); // string pour permettre un champ vide ("")
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState(""); // peut valoir "price-asc", "price-desc" ou "" (vide = pas de tri)

  /* ================= ROUTER ================= */

  return (
    <Router>
      <div className="container">
        {/* Header global : reçoit auth + setters de filtres */}
        <Header
          userToken={userToken}
          setUser={setUser}
          title={title}
          setTitle={setTitle}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          sort={sort}
          setSort={setSort}
        />

        {/* Routes de l'app */}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                title={title}
                priceMin={priceMin}
                priceMax={priceMax}
                sort={sort}
              />
            }
          />
          <Route path="/offer/:id" element={<Offer />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/publish" element={<Publish userToken={userToken} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

/* Notes :

- App.jsx est la "colonne vertébrale" du projet : il gère la navigation (Router), 
  l’authentification (token en cookie) et les filtres (stockés dans des states).
- Auth :
  • setUser(token) = écrit ou supprime le cookie + met à jour la mémoire React.
  • Au démarrage, useEffect relit automatiquement le cookie pour rester connecté.
- Filtres :
  • Le Header sert à ÉCRIRE les filtres (saisie utilisateur).
  • Le Home sert à LIRE ces filtres (appel API + affichage).
  • Certains filtres utilisent "" comme valeur initiale (string vide) 
    pour autoriser des champs d’input réellement vides (sinon React mettrait toujours 0).
*/
