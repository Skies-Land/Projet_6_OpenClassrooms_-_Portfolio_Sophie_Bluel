/*=============== VARIABLES ===============*/
    /* Sélectionne l'élément du DOM avec la classe "gallery" et le stocke dans la variable gallery */
    const gallery = document.querySelector(".gallery");
    /* Sélectionne l'élément du DOM avec la classe "container-filtres" et le stocke dans la variable filters */
    const filters = document.querySelector(".container-filtres");

/*=============== CONNEXION DE L'API POUR LES WORKS ===============*/
    /* Fonction asynchrone qui effectue une requête HTTP pour récupérer des données depuis l'API */
    async function getWorks() {
        try {
            /* Effectue une requête HTTP à l'URL spécifiée */
            const response = await fetch("http://localhost:5678/api/works");

            /* Vérifie si la réponse HTTP indique une réussite */
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des œuvres depuis la connexion vers API.');
            }

            /* Si la réponse est OK, passe la réponse en tant que JSON et la retourne */
            return await response.json();
        } catch (error) {

            /*  En cas d'erreur, affiche l'erreur dans la console */
            console.error(error.message);
            /* Retourne un tableau vide pour indiquer qu'aucune œuvre n'a été récupérée */
            return [];
        }
    }
    /* Appel de la fonction pour récupérer les données depuis l'API */
    getWorks();

/*=============== AFFICHAGE & CRÉATION DES WORKS DANS LE DOM ===============*/
    /* Fonction asynchrone permettant l'afficher les œuvres */
    async function displayWorks() {
        /* Récupération des œuvres depuis l'API de manière asynchrone */
        const works = await getWorks();

        /* Pour chaque œuvre dans le tableau, appelle la fonction createWorks avec l'œuvre (work) comme argument */
        works.forEach((work) => {
            createWorks(work);
        });
    }
    /* Appel de la fonction pour afficher les œuvres */
    displayWorks();

    /* Fonction permettant de créer des éléments DOM associés à une œuvre */
    function createWorks(work) {
        /* Crée un élément <figure> pour chaque œuvre */
        const figure = document.createElement("figure");

        /* Crée un élément <img> pour afficher l'image de l'œuvre */
        const img = document.createElement("img");

        /* Crée un élément <figcaption> pour afficher le titre de l'œuvre */
        const figcaption = document.createElement("figcaption");

        /* Définit l'attribut src de l'élément img avec l'URL de l'image de l'œuvre */
        img.src = work.imageUrl;

        /* Définit le contenu textuel de l'élément "figcaption" avec le titre de l'œuvre */
        figcaption.textContent = work.title;

        /* Ajoute l'élément img comme enfant de l'élément figure */
        figure.appendChild(img);

        /* Ajoute l'élément figcaption comme enfant de l'élément figure */
        figure.appendChild(figcaption);

        /* Ajoute l'élément figure comme enfant de l'élément avec la classe "gallery" */
        gallery.appendChild(figure);
    }

/*=============== BOUTONS DE CATÉGORIES ===============*/
    /* Récupération des catégories du tableau */
    async function getCategories() {
        try {
            /* Effectue une requête HTTP vers l'API pour obtenir les catégories */
            const response = await fetch("http://localhost:5678/api/categories");

            /* Vérifie si la réponse HTTP indique une réussite */
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories depuis la connexion vers API.');
            }

            /* Si la réponse est OK, passe la réponse en tant que JSON et la retourne */
            return await response.json();
        } catch (error) {

            /*  En cas d'erreur, affiche l'erreur dans la console */
            console.error(error.message);

            /* Retourne un tableau vide pour indiquer qu'aucune catégorie n'a été récupérée */
            return [];
        }
    }

    /* Affichage des catégories du tableau */
    async function displayCategoriesButtons() {

        /* Appel la fonction getCategories pour obtenir les catégories depuis l'API */
        const categories = await getCategories();

        /* Pour chaque catégorie obtenue, crée un bouton et l'ajoute à un élément avec la classe "container-filtres" */
        categories.forEach((category) => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.id = category.id;
            filters.appendChild(btn);
        });
    }
    /* Appel la fonction displayCategoriesButtons pour afficher les boutons des catégories dans le DOM */
    displayCategoriesButtons();

    /* Filtrage des boutons de catégories */
    async function filterCategorie() {
        /* Récupération des œuvres de manière asynchrone */
        const images = await getWorks();

        /* Sélection de tous les boutons dans l'élément avec la classe "container-filtres" */
        const buttons = document.querySelectorAll(".container-filtres button");

        // Ajout d'un écouteur d'événements "click" à chaque bouton */
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                /* Suppression de la classe "active" de tous les boutons */
                buttons.forEach((btn) => {
                    btn.classList.remove("active");
                });

                /* Ajout de la classe "active" uniquement au bouton cliqué */
                button.classList.add("active");

                /* Récupération de l'ID du bouton cliqué */
                const btnId = e.target.id;

                /* Vidage de la galerie d'images */
                gallery.innerHTML = "";

                /* Parcours de toutes les œuvres */
                images.forEach((work) => {
                    /* Si l'ID du bouton correspond à l'ID de la catégorie de l'œuvre
                    ou si l'ID du bouton est "0", afficher l'œuvre dans la galerie */
                    if (btnId == work.categoryId || btnId == "0") {
                        createWorks(work);
                    }
                });
            });
        });
    }
    /* Appel de la fonction pour filtrer les catégories au chargement de la page */
    filterCategorie();
