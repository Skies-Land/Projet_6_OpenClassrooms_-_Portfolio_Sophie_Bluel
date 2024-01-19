//#region - /* ===== VÉRIFICATION DE FETCH ===== */
    if (!window.fetch) {
        alert("Your browser does not support fetch API");
    }
//#endregion

//#region - /*===== VARIABLES =====*/
    const emailInput = document.querySelector("form #email");
    const passwordInput = document.querySelector("form #password");
    const loginForm = document.querySelector("form");
    const messageError = document.querySelector(".login p");
//#endregion

//#region - /*===== PROCESS LOGIN =====*/
    /* Ajout un écouteur d'événement pour le formulaire de connexion */
    loginForm.addEventListener("submit", (e) => {
        
        /* Empêche que le formulaire de connexion recharge la page */
        e.preventDefault();

        /* Récupère les valeurs des champs email et password saisies par l'utilisateur */
        const userEmail = emailInput.value;
        const userPassword = passwordInput.value;

        /* Vérification si les champs sont vides. Affiche un message d'erreur 
        si l'un des champs est vide et arrête l'exécution */
        if (!userEmail || !userPassword) {
            messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
            return;
        }

        /* Préparation des données à envoyer au serveur sous forme d'objet JSON */
        const login = {
            email: userEmail,
            password: userPassword,
        };

        /* Convertit l'objet login en une chaîne JSON */
        const user = JSON.stringify(login);

        /* Envoi d'une requête POST au serveur pour l'authentification de l'utilisateur */
        fetch("http://localhost:5678/api/users/login", {
            method: "POST", /* Méthode de la requête HTTP */
            mode: "cors", /* Mode CORS (Cross-Origin Resource Sharing) pour permettre des requêtes depuis un autre domaine */
            credentials: "same-origin", /* Utilise les mêmes informations d'identification que la ressource appelante */
            headers: { "Content-Type": "application/json" }, /* En-têtes de la requête indiquant que le contenu est au format JSON */
            body: user, /* Corps de la requête contenant les données utilisateur au format JSON */
        })

        /* Traitement de la réponse de la requête */
        .then((response) => {
            if (!response.ok) {
                /* Gestion des erreurs en cas de réponse non réussie du serveur */
                return response.json().then((error) => {
                    throw new Error(`Erreur lors de la requête : ${error.message}`);
                });
            }
            return response.json(); /* Passe la réponse HTTP en JSON en cas de succès */
        })

        /* Traitement des données retournées par le serveur après authentification réussie */
        .then((data) => {
            /* Récupation du token et de l'ID de l'utilisateur de la réponse JSON */
            const { userId, token: userToken } = data;
            
            /* Stockage du token et de l'ID de l'utilisateur dans la sessionStorage du navigateur */
            window.sessionStorage.setItem("token", userToken, "userId", userId);
            window.sessionStorage.setItem("loged", "true"); /* Ajout d'une indication de connexion */
            
            /* Redirection de l'utilisateur vers la page index.html après une authentification réussie */
            window.location.href = "../index.html";
        })

        /* Gestion des erreurs lors de la requête ou du traitement des données */
        .catch((error) => {
            console.error("Une erreur s'est produite lors de la récupération des données", error);
        });
    });

//#endregion