// Home.jsx — Liste des annonces
// - Récupère les offres au montage et quand les filtres changent (auto)
// - Affiche les annonces en cartes cliquables
// - Bouton "Commencer à vendre" → redirection manuelle
// - Reçoit les filtres depuis App.jsx (props)

import { useState, useEffect } from "react";
import axios from "axios";
import heroImg from "../assets/hero.jpg";
import tearImg from "../assets/tear.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Pages.css";
import "./Home.css";

const Home = ({ title, priceMin, priceMax, sort }) => {
  // State pour les données (offers) et pour l'interface (isLoading)
  // - offers = les annonces renvoyées par l’API
  // - isLoading = état d’affichage : "Chargement..." ou bien la liste des annonces
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Auto : appel API au montage + quand un filtre change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Préparation des query params dynamiques
        // Prépare un objet "params" pour l’API :
        // - ajoute seulement les filtres remplis par l’utilisateur
        // - axios les transforme ensuite en query params dans l’URL (?title=...&priceMin=...)
        const params = {};
        if (title) params.title = title;
        if (priceMin > 0) params.priceMin = priceMin;
        if (priceMax < 500) params.priceMax = priceMax;
        if (sort) params.sort = sort;

        const response = await axios.get(
          "https://lereacteur-vinted-api.herokuapp.com/v2/offers",
          { params }
        );

        setOffers(response.data.offers);
        setIsLoading(false);
      } catch (error) {
        console.log("Erreur Home:", error.message);
      }
    };

    fetchData();
  }, [title, priceMin, priceMax, sort]); // dépendances → relance si filtre change

  // Affichage
  return isLoading ? (
    <p>Chargement…</p>
  ) : (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <img src={heroImg} alt="Vêtements" className="hero-bg" />

        <div className="hero-card">
          <h2 className="hero-title">
            Prêts à faire du tri
            <br />
            dans vos placards ?
          </h2>
          <button className="btn primary" onClick={() => navigate("/login")}>
            Commencer à vendre
          </button>
        </div>

        <img src={tearImg} alt="déchiré" className="hero-tear" />
      </section>

      {/* Liste des annonces */}
      <section className="offers wrapper">
        {offers.map((offer) => (
          <Link key={offer._id} to={`/offer/${offer._id}`} className="card">
            <div className="card-owner">{offer.owner.account.username}</div>
            <div className="card-picture">
              <img src={offer.product_image.url} alt={offer.product_name} />
            </div>
            <div className="card-infos">
              <div className="price">{offer.product_price} €</div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Home;

/* Notes :

- ⏯️ Automatique :
  • useEffect appelle l’API au montage + quand les filtres changent.
  • setIsLoading(true/false) gère l’indicateur de chargement.
- 👉 Manuel :
  • clic "Commencer à vendre" → navigate("/login")
  • clic sur une carte → navigation vers /offer/:id
  • la saisie recherche / prix / tri se fait dans Header → met à jour les states dans App.jsx,
    et Home réagit automatiquement en relançant l’API.
*/
