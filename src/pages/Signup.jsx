// 📝 Signup.jsx — Inscription (formulaire simple)
// - Inputs contrôlés (username, email, password, newsletter)
// - axios POST /user/signup → setUser(token) puis navigate("/")
// - Pas de useEffect ici (tout est manuel)

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Signup = ({ setUser }) => {
  // State des inputs (formulaire contrôlé)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  // UI : désactiver le bouton pendant l’envoi
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  return (
    <main className="page auth-page">
      <div className="auth-container">
        <h1>Créer un compte</h1>

        {/* 🧾 Formulaire d'inscription */}
        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault(); // empêcher le rechargement
            setIsSubmitting(true); // désactiver le bouton
            try {
              const { data } = await axios.post(
                "https://lereacteur-vinted-api.herokuapp.com/user/signup",
                { email, username, password, newsletter }
              );
              setUser(data.token); // cookie + state (géré dans App.jsx)
              navigate("/"); // retour accueil
            } catch (error) {
              console.log("Erreur Signup:", error.message);
            } finally {
              setIsSubmitting(false); // réactiver le bouton
            }
          }}
        >
          {/* 👤 Username */}
          <label className="auth-label">
            <span>Nom d’utilisateur</span>
            <input
              className="auth-input"
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

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

          {/* 📨 Newsletter */}
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(event) => setNewsletter(event.target.checked)}
            />
            <span>Je souhaite recevoir les offres par email</span>
          </label>

          {/* Bouton */}
          <button className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        {/* Lien vers login */}
        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;

/* Notes :

- Formulaire contrôlé : chaque frappe met à jour le state (username, email, password, newsletter).
- Soumission : on empêche le rechargement, on POST vers /user/signup, puis
  en cas de succès → setUser(token) (écrit le cookie + met à jour l'état) et navigate("/").
- isSubmitting = état d’interface pour désactiver le bouton pendant l’envoi.
- Pas de useEffect ici : tout est déclenché par l’utilisateur (clic/Enter).
*/
