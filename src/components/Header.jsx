// Header.jsx — Bandeau avec logo, recherche, filtres et actions
// - Header affiche les contrôles (l'utilisateur écrit ici)
// - App stocke les valeurs (state)
// - Home lit ces valeurs pour filtrer l'API

import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";

const Header = ({
  // Auth
  userToken,
  setUser,
  // Filtres (écriture côté Header)
  title,
  setTitle,
  priceMin,
  setPriceMin, // string pour permettre un champ vide ("")
  priceMax,
  setPriceMax, // string pour permettre un champ vide ("")
  sort,
  setSort, // peut valoir "price-asc", "price-desc" ou "" (pas de tri)
}) => {
  const navigate = useNavigate();

  // Déconnexion (efface cookie + state) puis retour accueil
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Vendre : si connecté → /publish, sinon → /login
  const handleSell = () => {
    userToken ? navigate("/publish") : navigate("/login");
  };

  return (
    <header className="site-header">
      {/* Logo → Home */}
      <Link to="/" className="brand">
        <img src={logo} alt="Vinted logo" className="logo-img" />
      </Link>

      {/* Centre : recherche au-dessus, filtres en dessous */}
      <div className="header-center">
        {/* Recherche par titre */}
        <input
          className="search-input"
          type="text"
          placeholder="Recherche des articles"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        {/* Filtres simples : prix min/max + tri + reset */}
        <div className="filters-row">
          <input
            type="text"
            placeholder="Prix min"
            value={priceMin}
            onChange={(event) => setPriceMin(event.target.value)}
          />
          <input
            type="text"
            placeholder="Prix max"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="">Tri par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>

          {/* Remettre la liste complète */}
          <button
            className="btn ghost"
            onClick={() => {
              setPriceMin("");
              setPriceMax("");
              setSort("");
            }}
          >
            Tout voir
          </button>
        </div>
      </div>

      {/* Actions à droite : auth + vendre */}
      <div className="header-actions">
        {!userToken ? (
          <>
            <Link to="/signup" className="btn ghost">
              S’inscrire
            </Link>
            <Link to="/login" className="btn ghost">
              Se connecter
            </Link>
          </>
        ) : (
          <button className="btn ghost" onClick={handleLogout}>
            Se déconnecter
          </button>
        )}
        <button className="btn primary" onClick={handleSell}>
          Vends tes articles
        </button>
      </div>
    </header>
  );
};

export default Header;

/* Notes  :

- Header écrit les filtres (via onChange), Home lit ces filtres pour appeler l’API (via useEffect).
- priceMin / priceMax commencent avec "" (string vide) : ça permet à l’input d’être vraiment vide,
  alors que si on mettait 0 il serait impossible d’effacer le champ (React remettrait toujours 0).
- sort accepte "" (pas de tri), "price-asc" (croissant) ou "price-desc" (décroissant).
*/
