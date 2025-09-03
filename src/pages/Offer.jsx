// Offer.jsx — Page détail d’une annonce
// - Route dynamique : /offer/:id (useParams pour lire l’id)
// - useEffect pour charger les données depuis l’API
// - Layout : image à gauche (400x600) et infos produit à droite (400x600)

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Pages.css";
import "./Offer.css";

const Offer = () => {
  // State : données de l’offre + état de chargement
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams(); // lit l’id dans l’URL (/offer/:id)
  const navigate = useNavigate(); // hook pour rediriger

  // Auto : fetch API quand le composant se monte ou si id change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-vinted-api.herokuapp.com/offer/${id}`
        );
        setOffer(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Erreur Offer:", error.message); // debug
      }
    };
    fetchData();
  }, [id]);

  // Affichage conditionnel
  return isLoading ? (
    <p>Chargement…</p>
  ) : (
    <main className="page offer">
      <div className="offer-layout">
        {/* Bloc image */}
        <div className="offer-visual">
          {offer.product_image?.url && (
            <img src={offer.product_image.url} alt={offer.product_name} />
          )}
        </div>

        {/* Bloc infos produit */}
        <div className="offer-panel">
          <p className="offer-price">{offer.product_price} €</p>

          {/* Tableau des détails */}
          <div className="offer-details">
            {offer.product_details?.map((detail, index) => {
              const [label, value] = Object.entries(detail)[0];
              return (
                <div className="offer-detail-row" key={index}>
                  <span className="offer-detail-label">{label}</span>
                  <span className="offer-detail-value">{value}</span>
                </div>
              );
            })}
          </div>

          <hr className="separator" />

          <h1 className="offer-title">{offer.product_name}</h1>
          <p className="offer-desc">{offer.product_description}</p>

          {/* Vendeur */}
          <div className="offer-owner">
            {offer.owner?.account?.avatar?.url && (
              <img
                className="owner-avatar"
                src={offer.owner.account.avatar.url}
                alt={offer.owner.account.username}
              />
            )}
            <span className="owner-name">{offer.owner?.account?.username}</span>
          </div>

          {/* Bouton Acheter → redirection vers /payment avec infos envoyées */}
          <button
            className="btn primary"
            onClick={() => {
              navigate("/payment", {
                state: {
                  title: offer.product_name,
                  price: offer.product_price,
                },
              });
            }}
          >
            Acheter
          </button>
        </div>
      </div>
    </main>
  );
};

export default Offer;

/* Notes :

- ⏯️ Automatique : useEffect charge l’offre dès que la page /offer/:id s’ouvre.
- 👉 Manuel : clic utilisateur sur le bouton "Acheter" (ici décoratif).
- State :
  • offer = données de l’annonce
  • isLoading = état d’affichage ("Chargement…" ou contenu)
- Debug : console.log("Erreur Offer: ...") pour identifier d’où vient une erreur.
*/
