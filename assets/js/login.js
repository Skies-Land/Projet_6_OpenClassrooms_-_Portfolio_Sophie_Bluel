/*=============== VARIABLES ===============*/
    /* Sélectionne les éléments du DOM composant le formulaire de connexion */
    const emailInput = document.querySelector("form #email");
    const passwordInput = document.querySelector("form #password");
    const loginForm = document.querySelector("form");
    const messageError = document.querySelector(".login p");

/*=============== CONNEXION DE L'API POUR LES IDENTIFIANTS ===============*/
    /* Fonction asynchrone qui récupère l'utilisateur depuis l'API */
    async function getUsersFromApi() {
        try {
            /* Effectue une requête asynchrone vers l'API pour récupérer l'utilisateur */
            const response = await fetch("http://localhost:5678/api/users/login");

            /* Vérifie si la requête a été réussie (statut HTTP 200-299) */
            if (!response.ok) {
                /* En cas d'échec, lance une erreur avec un message */
                throw new Error("Échec de la récupération de l'utilisateur depuis l'API.");
            }

            /* Transforme la réponse JSON de l'API en objet JavaScript et la renvoie */
            return await response.json();
        } catch (error) {
            /* En cas d'erreur lors de la récupération de l'utilisateur, affiche l'erreur dans la console */
            console.error("Une erreur s'est produite lors de la récupération des utilisateurs:", error);
            throw error;
        }
    }

/*=============== FONCTION PERMETTANT LA CONNEXION ===============*/
    /* Fonction asynchrone qui gère le processus d'authentification */
    async function login() {
        try {
            /* Récupère l'utilisateur de manière asynchrone */
            const users = await getUsersFromApi();

            /* Ajoute un écouteur d'événement sur la soumission du formulaire */
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();

                /* Récupère les valeurs de l'email et du mot de passe du formulaire */
                const userEmail = emailInput.value;
                const userPassword = passwordInput.value;

                /* Utilise Array.find() pour rechercher un utilisateur correspondant */
                const foundUser = users.find
                (user => user.email === userEmail && user.password === userPassword && user.admin);

                /* Vérifie si un utilisateur correspondant est trouvé */
                if (foundUser) {
                    /* Stocke l'état de connexion dans sessionStorage */
                    window.sessionStorage.loggedIn = true;
                    /* Redirige vers la page d'accueil */
                    window.location.href = "../index.html";
                } else {
                    /* Affiche un message d'erreur générique en cas d'échec d'authentification */
                    email.classList.add("message-error");
                    password.classList.add("message-error");
                    messageError.textContent = "Échec de l'authentification. Veuillez vérifier vos informations.";
                }
            });

        } catch (error) {
            /*  En cas d'erreur lors de la récupération des utilisateurs, affiche l'erreur dans la console */
            console.error("Une erreur s'est produite lors de la récupération des utilisateurs:", error);
        }
    }
    /* Appel la fonction login lors du chargement de la page */
    login();