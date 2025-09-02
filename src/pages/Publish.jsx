// Publish.jsx — Déposer une annonce
// Objectifs :
// - Inputs contrôlés (title, description, price, picture + détails produit)
// - Requête POST avec axios vers l’API Vinted
// - Si succès → redirection vers la Home

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Publish.css";

const Publish = ({ userToken }) => {
  // Champs principaux
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [picture, setPicture] = useState(null);

  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");

  const [exchange, setExchange] = useState(false); // case à cocher

  const navigate = useNavigate(); // redirection après une action: après un POST réussi (création annonce) → je redirige vers la Home

  // Redirection si pas connecté
  useEffect(() => {
    if (!userToken) navigate("/login");
  }, [userToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Création d’un formData pour envoyer texte + image
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("picture", picture);

      formData.append("brand", brand);
      formData.append("size", size);
      formData.append("color", color);
      formData.append("condition", condition);
      formData.append("city", city);
      formData.append("exchange", exchange);

      // Requête POST
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/offer/publish",
        formData,
        { headers: { authorization: `Bearer ${userToken}` } }
      );

      // Si succès → retour à l’accueil
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
          type="file"
          onChange={(event) => setPicture(event.target.files[0])}
          required
        />

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
          type="text"
          placeholder="Marque (ex: Nike)"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
        />
        <input
          type="text"
          placeholder="Taille (ex: L / 40 / 12)"
          value={size}
          onChange={(event) => setSize(event.target.value)}
        />
        <input
          type="text"
          placeholder="Couleur (ex: Gris)"
          value={color}
          onChange={(event) => setColor(event.target.value)}
        />
        <input
          type="text"
          placeholder="État (ex: Neuf, Très bon état)"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
        />
        <input
          type="text"
          placeholder="Lieu (ex: Paris)"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />

        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={exchange}
            onChange={(event) => setExchange(event.target.checked)}
          />
          Je suis intéressé(e) par les échanges
        </label>

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
