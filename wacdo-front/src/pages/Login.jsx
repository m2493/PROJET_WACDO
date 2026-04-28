import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, motDePasse);
      navigate("/restaurant");
    } /*catch {
      *setError("Identifiants incorrects");
      */
     catch (error) {
    console.log(error);
    console.log(error.response);
    setError("Erreur connexion");
        }
  };

  return (
    <div>
      <h2>Connexion Admin</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        <button type="submit">Connexion</button>
      </form>

      <p>{error}</p>
    </div>
  );
}

export default Login;