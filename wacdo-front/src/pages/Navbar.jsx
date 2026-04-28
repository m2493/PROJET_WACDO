import { NavLink, useNavigate } from "react-router-dom";
/*import { LogOut } from "lucide-react";*/
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useContext(AuthContext);

  const linkStyle = ({ isActive }) => ({
    marginRight: "15px",
    textDecoration: "none",
    color: isActive ? "red" : "black",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <NavLink to="/" style={linkStyle}>Accueil</NavLink>
      <NavLink to="/collaborator" style={linkStyle}>Collaborateurs</NavLink>
      <NavLink to="/function" style={linkStyle}>Fonctions</NavLink>
      <NavLink to="/restaurant" style={linkStyle}>Restaurants</NavLink>
      <NavLink to="/affectation" style={linkStyle}>Affectations</NavLink>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "20px",
            padding: "5px 10px",
            cursor: "pointer"
          }}
        >
          Déconnexion
        </button>
      )}
    </nav>
  );
}

export default Navbar;