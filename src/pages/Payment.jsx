import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

const Payment = ({ userToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ⛔ Si pas connecté → redirection
  useEffect(() => {
    if (!userToken) navigate("/login");
  }, [userToken, navigate]);

  // Récup des infos envoyées depuis Offer.jsx
  const { title = "Article", price = 0 } = location.state || {};

  return (
    <main className="page">
      <h1>Paiement</h1>
      <p>
        Article : <strong>{title}</strong>
      </p>
      <p>
        Prix : <strong>{price} €</strong>
      </p>

      {/* On passe les données au formulaire */}
      <CheckoutForm title={title} price={price} />
    </main>
  );
};

export default Payment;
