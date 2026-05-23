import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";

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

import Affectation from "./pages/Affectation/Affectations.jsx";
import EditAffectationPage from "./pages/Affectation/EditAffectationPage";

import Navbar from "./pages/Navbar";

/* Wrapper pour gérer la logique auth + navbar */
function AppLayout() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            {/* Navbar uniquement si connecté */}
            {isAuthenticated && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/collaborator" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route path="/login" element={<Login />} />

                {/* PROTECTED ROUTES */}
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

                <Route
                    path="/affectations/:id/edit"
                    element={<EditAffectationPage />}
                />
            </Routes>
        </>
    );
}

/* Root App */
export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    );
}