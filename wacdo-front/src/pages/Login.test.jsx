import { render, screen, fireEvent } from "@testing-library/react";
/*render = affichage composant dans un faux DOM
screen = permet de rechercher des éléments affichés
*/
import { MemoryRouter } from "react-router-dom"; /*pour simuler au lieu de faire de vrais interactions navigateur avec BrowserRouter*/
import { vi } from "vitest";
/*vi.fn() = fonction mock (fausse fonction pour simuler login)
*/
import Login from "./Login";
/*composant à tester*/
import { AuthContext } from "../auth/AuthContext";

describe("Login component", () => {
    /*Regroupe tous les tests du Login*/

    test("affiche le formulaire de connexion", () => {

        render(
            <AuthContext.Provider value={{ login: vi.fn() }}>
                /*login = fonction mock (ne fait rien réellement)*/
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        expect(
            screen.getByText(/connexion admin/i)
        ).toBeInTheDocument();
        /*cherche un texte dans la page

        /i = ignore majuscules/minuscules
        */
        expect(
            screen.getByPlaceholderText(/admin@mail.com/i)
        ).toBeInTheDocument();
        /*input email existant */
        expect(
            screen.getByPlaceholderText(/••••••••/i)
        ).toBeInTheDocument();
        /*input passaword existant*/

        expect(
            screen.getByRole("button", {
                name: /connexion/i
            })
        ).toBeInTheDocument();
        /*bouton de submit*/
    });



    test("appelle login quand le formulaire est soumis", () => {
        const loginMock = vi.fn();

        render(
            <AuthContext.Provider value={{ login: loginMock }}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByPlaceholderText(/admin@mail.com/i), { /*Chercher l’input email via son placeholder*/
            target: { value: "admin@mail.com" } /*Remplir le champ email comme si l’utilisateur tapait*/
        });

        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
            target: { value: "password123" }
        });

        fireEvent.click(screen.getByRole("button", { name: /connexion/i })); /*trouver le bouton par son texte*/

        expect(loginMock).toHaveBeenCalled(); /*vérifier que loginMock a été appelée*/
    });

    test("ne soumet pas si champs vides", () => {
        const loginMock = vi.fn();

        render(
            <AuthContext.Provider value={{ login: loginMock }}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

        expect(loginMock).not.toHaveBeenCalled();
    });

});