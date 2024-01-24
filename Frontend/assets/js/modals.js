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

    /* Fonction pour gérer la prévisualisation de l'image */
    function imagePreview() {
        /* Récupération du fichier sélectionné dans l'input de type fichier */
        const file = inputFile.files[0];
        console.log(file);

        /* Vérification si le fichier existe et s'il s'agit d'une image */
        if (file && file.type.startsWith("image/")) {
            /* Création d'un objet FileReader pour lire le contenu du fichier */
            const reader = new FileReader();

            /* Fonction exécutée lorsque la lecture du fichier est terminée */
            reader.onload = function (e) {
                try {
                    /* Attribution de l'URL de la prévisualisation à la source de l'image */
                    previewImg.src = e.target.result;

                    /* Modification du style pour afficher l'image et masquer d'autres éléments */
                    previewImg.style.display = "flex";
                    labelFile.style.display = "none";
                    iconFile.style.display = "none";
                    pFile.style.display = "none";
                } catch (error) {
                    /* Gestion des erreurs lors de la modification de l'interface utilisateur */
                    console.error("Une erreur est survenue lors de la lecture du fichier :", error);
                }
            };

            /* Lecture du contenu du fichier sous forme d'URL data:URL */
            reader.readAsDataURL(file);
        } else {
            /* Affichage d'un message si le fichier n'est pas une image valide */
            console.log("Veuillez sélectionner une image valide.");
        }
    }

    /* Attente que le DOM soit complètement chargé avant d'attacher les écouteurs d'événements */
    document.addEventListener("DOMContentLoaded", function () {
        /* Sélection du formulaire dans le DOM */
        const form = document.querySelector("form");

        /* Ajout d'un écouteur d'événements sur le changement de l'input de type fichier */
        inputFile.addEventListener("change", imagePreview);

        /* Ajout d'un écouteur d'événements sur la soumission du formulaire */
        form.addEventListener("submit", async (e) => {
            /* Empêche le comportement par défaut de soumission du formulaire */
            e.preventDefault();

            /* Récupération des éléments du formulaire */
            const title = document.querySelector("#title");
            const category = document.querySelector("#category-input");
            const playload = new FormData();

            /* Affichage des valeurs du titre, de la catégorie et du fichier dans la console */
            console.log(title.value);
            console.log(category.value);
            console.log(inputFile.files[0]);

            /* Ajout des données au FormData pour l'envoi via la requête HTTP */
            playload.append("title", title.value);
            playload.append("category", category.value);
            playload.append("image", inputFile.files[0]);

            try {
                /* Récupération du token de la session */
                const token = window.sessionStorage.getItem("token");
                /* Envoi de la requête POST au serveur avec les données du formulaire */
                const response = await fetch("http://localhost:5678/api/works/", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: playload,
                });

                /* Vérification si la réponse du serveur est OK */
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                /* Récupération des données JSON de la réponse */
                const data = await response.json();
                /* Affichage d'un message de succès dans la console */
                console.log("Nouvelle image bien chargée !" + data);

            } catch (error) {
                /* Gestion des erreurs lors de l'envoi de la requête */
                console.log("Une erreur est survenue lors de l'envoi de l'image :", error.message);
            }
        });
    });

//#endregion