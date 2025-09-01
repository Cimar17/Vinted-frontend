// Publish.jsx — Déposer une annonce
// Objectifs :
// - Inputs contrôlés (title, description, price, picture)
// - Requête POST avec axios vers l’API Vinted
// - Si succès → redirection vers la Home

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Publish.css";

const Publish = ({ userToken }) => {
  // States pour les valeurs du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [picture, setPicture] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Création d’un formData pour envoyer texte + image
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("picture", picture);

      // Envoi de la requête POST
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/offer/publish",
        formData,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Si succès → retour à la page d’accueil
      if (response.data) {
        navigate("/");
      }
    } catch (error) {
      console.log("Erreur Publish:", error.message);
    }
  };

  return (
    <main className="publish-page">
      <h1>Déposer une annonce</h1>

      <form className="publish-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <textarea
          placeholder="Décris ton article"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <input
          type="file"
          onChange={(event) => setPicture(event.target.files[0])}
          required
        />

        <button type="submit">Publier</button>
      </form>
    </main>
  );
};

export default Publish;

/* Notes :

   - Tous les champs sont contrôlés avec useState (chaque frappe ou choix de fichier met à jour la mémoire React).
   - On utilise FormData pour pouvoir envoyer du texte + une image dans la même requête.
   - L’API /offer/publish attend un token (userToken) dans les headers → ici envoyé en Bearer.
   - Après succès, navigate("/") redirige automatiquement l’utilisateur vers la Home. 
   👉 Ici tout est manuel (clic, saisie, submit). Aucun useEffect automatique.
*/
