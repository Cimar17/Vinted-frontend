import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

const CheckoutForm = ({ title, price }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) return; // Stripe pas prêt
    setIsLoading(true);

    // 1) Valide le formulaire Stripe (numéro de carte, etc...)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    try {
      // 2) Appel de l’API
      //    Elle renvoie un client_secret pour confirmer le paiement.
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/v2/payment",
        {
          title, // ex: "Robe Zara"
          amount: Number(price), // ex: 12 (le prix affiché dans l’annonce)
        }
      );

      const clientSecret = response.data.client_secret;

      // 3) Confirmation du paiement côté Stripe
      const stripeResponse = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: "http://localhost:5173/" },
        redirect: "if_required",
      });

      if (stripeResponse.error) {
        setErrorMessage(stripeResponse.error.message);
      } else if (stripeResponse.paymentIntent?.status === "succeeded") {
        setCompleted(true);
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (completed) {
    return <p>Paiement effectué</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements || isLoading}>
        {isLoading ? "Paiement..." : "Pay"}
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
