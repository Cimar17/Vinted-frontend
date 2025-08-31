// 🔐 Login.jsx — Connexion utilisateur
// - Inputs contrôlés (email, password)
// - POST /user/login → setUser(token) + navigate("/")
// - Pas de useEffect ici (tout est déclenché par l’utilisateur)

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = ({ setUser }) => {
  // State des inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI : désactiver le bouton pendant l’envoi
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  return (
    <main className="page auth-page">
      <h1>Se connecter</h1>

      <form
        className="auth-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSubmitting(true);
          try {
            const { data } = await axios.post(
              "https://lereacteur-vinted-api.herokuapp.com/user/login",
              { email, password }
            );
            setUser(data.token); // cookie + state (géré dans App.jsx)
            navigate("/"); // retour accueil
          } catch (error) {
            console.log("Erreur Login:", error.message);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {/* 📧 Email */}
        <label className="auth-label">
          <span>Email</span>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        {/* 🔒 Mot de passe */}
        <label className="auth-label">
          <span>Mot de passe</span>
          <input
            className="auth-input"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {/* Bouton */}
        <button className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Lien vers signup */}
      <p className="auth-switch">
        Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
      </p>
    </main>
  );
};

export default Login;

/* Notes :

- Formulaire contrôlé : chaque frappe met à jour le state (email, password).
- Soumission : on POST vers /user/login puis, en cas de succès, setUser(token) et navigate("/").
- isSubmitting gère l’état du bouton pendant l’appel réseau.
- Pas de useEffect : tout est déclenché par l’utilisateur (saisie, submit).
*/
