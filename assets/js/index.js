/*=============== VARIABLES ===============*/
    /*  Sélectionne l'élément du DOM avec la classe "gallery" et le stocke dans la variable gallery */
    const gallery = document.querySelector(".gallery");


/*=============== CONNEXION DE L'API POUR LES WORKS ===============*/
    /* Fonction asynchrone qui effectue une requête HTTP pour récupérer des données depuis l'API */
    async function getWorks() {

        /* Effectue une requête HTTP à l'URL spécifiée */
        const response = await fetch("http://localhost:5678/api/works");

        /* Attend que la réponse de la requête soit convertie en format JSON et la retourne */
        return await response.json();
        
    }
    getWorks();

/*=============== AFFICHAGE WORKS DANS LE DOM ===============*/
    /* Appelle la fonction getWorks pour récupérer les données et effectue le rendu sur la page */
    async function displayWorks() {

        /* Appelle la fonction getWorks pour obtenir un tableau d'œuvres */
        const arrayWorks = await getWorks();

        /* Utilise la méthode forEach pour itérer sur chaque élément du tableau d'œuvres */
        arrayWorks.forEach((work) => {

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
        });
    }

    /* Appelle la fonction displayWorks pour démarrer le processus d'affichage des œuvres */
    displayWorks();