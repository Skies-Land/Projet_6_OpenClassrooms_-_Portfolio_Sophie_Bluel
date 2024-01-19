//#region - /* ===== VÉRIFICATION DE FETCH ===== */
    if (!window.fetch) {
        alert("Your browser does not support fetch API");
    }
//#endregion

//#region - /*===== MODALES =====*/
    /* Élément du DOM pour la modale 1 */
    const containerModals = document.querySelector(".container-modals");
    const closeModals = document.querySelector(".container-modals .fa-xmark");
    const projetModal = document.querySelector(".projet-modal");

    /* Création de la modale 1 pour gérer les projets */
    function modal() {
        if (loged === "true") {
            logout.addEventListener("click", () => {
                /* Déconnexion : Mettez à jour la sessionStorage */
                window.sessionStorage.removeItem("loged");
            });
        }
        /* Au click sur "Mode édition" affichage de la modale pour gérer les projets */
        divEdit.addEventListener("click", () => {
            containerModals.style.display = "flex";
        });
        /* Au click sur "la croix dans la modale" ferme l'affichage pour gérer les projets */
        closeModals.addEventListener("click", () => {
            containerModals.remove();
        });
        /* Permet de fermer la modale sans passer par le croix */
        containerModals.addEventListener("click", (e) => {
            if (e.target.className === "container-modals") {
                containerModals.remove();
            }
        });
        /* Permet de fermer la modale en appuyant sur la touche "Echap" */
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                containerModals.remove();
            }
        });
    }
    modal()

    /* Affichage et gestion de la galerie d'images dans la modale 1 */
    async function displayWorkModal() {
        projetModal.innerHTML = "";
        const imageWork = await getWorks();
        imageWork.forEach(projet => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const span = document.createElement("span");
            const trash = document.createElement("i");
            trash.classList.add("fa-solid", "fa-trash-can");
            trash.id = projet.id;

            /* Ajoute un gestionnaire d'événements au clic sur l'icône de corbeille */
            trash.addEventListener("click", (e) =>  {
                /* Empêche la propagation de l'événement pour éviter d'activer d'autres événements */
                e.stopImmediatePropagation();

                /* Récupèration du token d'authentification depuis la sessionStorage */
                const token = window.sessionStorage.getItem("token");
                /* Envoie une requête DELETE au serveur pour supprimer le projet */
                fetch(`http://localhost:5678/api/works/${projet.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then (res => {
                    console.log(res)
                    figure.remove()
                })
                .catch (error => {
                    console.error(error)
                })
            })
            img.src = projet.imageUrl;
            span.appendChild(trash);
            figure.appendChild(span);
            figure.appendChild(img);
            projetModal.appendChild(figure);
        });
    }
    displayWorkModal();

    /*====================================================*/

    /* Élément du DOM pour la modale 2 */
    const btnAddWorkModal = document.querySelector(".modal-projet button");
    const modalAddWork = document.querySelector(".modal-addworks");
    const modalProjet = document.querySelector(".modal-projet");
    const arrowleft = document.querySelector(".modal-addworks .fa-arrow-left");
    const markAdd = document.querySelector(".modal-addworks .fa-xmark");

    /* Fonction permettant l'affichage de la modale 2 */
    function displayAddWorkModal() {
        /* Au clique du boutton de la modale 1 affiche la modale 2 pour ajouter une image */
        btnAddWorkModal.addEventListener("click", () => {
            modalAddWork.style.display = "flex"; /* Affichage de la modale 2 */
            modalProjet.style.display = "none"; /* Masque l'affichage de la modale 1 */
        });
        /* Au clique de la flèche retour à la modale 1 */
        arrowleft.addEventListener("click", () => {
            modalAddWork.style.display = "none"; /* Masque l'affichage de la modale 2 */
            modalProjet.style.display = "flex"; /* Affichage de la modale 1 */
        });
        /* Au clique du boutton "Valider" de la modale 2 fermeture de la fenêtre et retour à l'index */
        markAdd.addEventListener("click", () => {
            containerModals.style.display = "none"; /* Fermeture de la modale */
            window.location = "index.html";
        });
    }
    displayAddWorkModal();

    /* Élément du DOM pour la modale 2 pour la prévisualisation de l'image uploader */
    const previewImg = document.querySelector(".container-file img");
    const inputFile = document.querySelector(".container-file input");
    const labelFile = document.querySelector(".container-file label");
    const iconFile = document.querySelector(".container-file .fa-image");
    const pFile = document.querySelector(".container-file p");

    /*  Ajoute un gestionnaire d'événements au changement de la sélection de fichier */
    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        console.log(file); /* Information du fichier dans la console */

        /* Vérifie si un fichier a été sélectionné et s'il s'agit d'une image */
        if (file && file.type.startsWith("image/")) {
            /* Crée un objet FileReader pour lire le contenu du fichier */
            const reader = new FileReader();

            /* Configure une fonction à exécuter une fois le fichier lu avec succès */
            reader.onload = function (e) {
                try {
                    /* Affecte l'URL de l'image au src de l'élément d'aperçu */
                    previewImg.src = e.target.result;

                    /* Affiche l'élément d'aperçu et masque les autres éléments de l'interface */
                    previewImg.style.display = "flex";
                    labelFile.style.display = "none";
                    iconFile.style.display = "none";
                    pFile.style.display = "none";
                } catch (error) {
                    /* Message dans la console informant une erreur de lecture du fichier */
                    console.error("Une erreur est survenue lors de la lecture du fichier :", error);
                }
            };

            /* Commence la lecture du contenu du fichier sous forme d'URL data */
            reader.readAsDataURL(file);
        } else {
            /* Message dans la console informant le cas où le fichier n'est pas une image */
            console.log("Veuillez sélectionner une image valide.");
        }
    });

    /* Ajoute un gestionnaire d'événements au chargement du DOM 
    avec une fonction anonyme exécutée une fois que le document HTML a été complètement chargé */
    document.addEventListener("DOMContentLoaded", function() {
        /* Élément du DOM du formulaire d'uploade pour la modale 2 */
        const form = document.querySelector("form");
        

        /* Ajoute un gestionnaire d'événements pour l'événement de soumission du formulaire */
        form.addEventListener("submit", async (e) => {
            /* Empêche le comportement par défaut du formulaire -rechargement de la page- */
            e.preventDefault();

            const title = document.querySelector("#title");
            const category = document.querySelector("#category-input");
            const playload = new FormData();

            console.log(title.value);
            console.log(category.value);
            console.log(inputFile.files[0]);

            playload.append("title", title.value);
            playload.append("category", category.value);
            playload.append("image", inputFile.files[0]);

            try {
                /* Récupèration du token d'authentification depuis la sessionStorage */
                const token = window.sessionStorage.getItem("token");
                /* Envoie une requête POST au serveur avec les données du formulaire */
                const response = await fetch("http://localhost:5678/api/works/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: playload,
                })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    /* Affiche un message dans la console une fois que l'image est chargée avec succès */
                    console.log("Nouvelle image bien chargée !" + data);
                });
            } catch (error) {
                /* Affiche un message dans la console en cas d'erreur lors de l'envoi de l'image */
                console.log("Une erreur est survenue lors de l'envoi de l'image");
            }
        });
    });
//#endregion