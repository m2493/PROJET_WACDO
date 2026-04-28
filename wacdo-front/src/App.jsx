import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";

import Restaurant from "./pages/Restaurant/Restaurants";
import RestaurantDetail from "./pages/Restaurant/RestaurantDetail";
import CreateRestaurantPage from "./pages/Restaurant/CreateRestaurantPage";

import Collaborator from "./pages/Collaborator/Collaborators";
import CollaboratorDetail from "./pages/Collaborator/CollaboratorDetail";
import CreateCollaboratorPage from "./pages/Collaborator/CreateCollaboratorPage";
import EditCollaboratorPage from "./pages/Collaborator/EditCollaboratorPage";

import Function from "./pages/Function/Functions";
import CreateFunctionPage from "./pages/Function/CreateFunctionPage";

import Affectation from "./pages/Affectations";
import Navbar from "./pages/Navbar";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/restaurant"
            element={
              <ProtectedRoute>
                <Restaurant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restaurants/:id"
            element={
              <ProtectedRoute>
                <RestaurantDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restaurants/create"
            element={
              <ProtectedRoute>
                <CreateRestaurantPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collaborator"
            element={
              <ProtectedRoute>
                <Collaborator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collaborators/:id"
            element={
              <ProtectedRoute>
                <CollaboratorDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collaborators/create"
            element={
              <ProtectedRoute>
                <CreateCollaboratorPage />
              </ProtectedRoute>
            }
          />

<Route
            path="/collaborators/:id/edit"
            element={
              <ProtectedRoute>
                <EditCollaboratorPage />
              </ProtectedRoute>
            }
          />



          <Route
            path="/function"
            element={
              <ProtectedRoute>
                <Function />
              </ProtectedRoute>
            }
          />

                    <Route
            path="/function/create"
            element={
              <ProtectedRoute>
                <CreateFunctionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/affectation"
            element={
              <ProtectedRoute>
                <Affectation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;