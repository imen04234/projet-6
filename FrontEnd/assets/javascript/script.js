// le fichier api.js va servir à récupérer les données de l'API et les afficher dans la page
// également permettre de trier les projets par catégorie dans la galerie

// ne pas oublier de lancer le backend avec npm start

// Besoins de trois fonction asycnhrones :
// 1. Récupérer les données des travaux depuis l'API
// 2. Récupérer les données des catégories depuis l'API
// 3. Filtrer les travaux par catégorie sélecionnée

// Fonction asynchrone pour récupérer les données des travaux depuis l'API
// `async` est utilisé pour rendre la fonction asynchrone, permettant d'utiliser `await` à l'intérieur
async function getWorks() {
  // La méthode `fetch()` permet de faire des requêtes HTTP asynchrones vers une API.
  // Ici, nous envoyons une requête GET à l'URL de l'API pour récupérer les travaux.
  await fetch("http://localhost:5678/api/works")
    // Une fois que la réponse est reçue, on utilise `.then()` pour la convertir en JSON.
    // `response.json()` convertit le flux de données reçu en un format lisible par JavaScript (JSON).
    .then((response) => response.json())
    // Une fois les données converties, on les manipule avec une autre méthode `.then()`
    .then((dataWorks) => {
      // `console.table(dataWorks)` affiche les données sous forme de tableau dans la console,
      // ce qui permet de visualiser plus facilement les travaux récupérés.
      console.table(dataWorks); // Affiche les travaux sous forme de tableau

      // Sélection de l'élément HTML ayant la classe `.gallery`, qui contiendra les travaux.
      // `document.querySelector` permet de cibler un élément dans le DOM.
      const gallery = document.querySelector(".gallery");
      // On vide la galerie actuelle en réinitialisant son contenu avec `innerHTML = ""`.
      // Cela permet d'éviter d'ajouter les travaux plusieurs fois si la fonction est appelée plusieurs fois.
      gallery.innerHTML = "";

      // `forEach()` est une méthode qui permet de parcourir un tableau (`dataWorks` ici) et d'exécuter une fonction pour chaque élément.
      dataWorks.forEach((work) => {
        // `document.createElement()` crée un nouvel élément HTML du type spécifié.
        // Ici, nous créons une balise `figure` qui va contenir l'image et le titre de chaque travail.
        const card = document.createElement("figure");
        // Création d'une balise `img` qui contiendra l'image du travail.
        const imgCard = document.createElement("img");
        // Création d'une balise `figcaption` qui contiendra le titre du travail (comme une légende pour l'image).
        const titleCard = document.createElement("figcaption");

        // On assigne l'URL de l'image (récupérée depuis l'API) à l'attribut `src` de l'élément `img`.
        imgCard.src = work.imageUrl;
        // On assigne le titre du travail à l'attribut `alt` de l'image. Cela permet d'afficher un texte descriptif si l'image ne se charge pas.
        imgCard.alt = work.title;
        // On utilise `setAttribute` pour assigner un attribut personnalisé `category` qui correspond à la catégorie du travail.
        // Cela servira plus tard pour filtrer les travaux par catégorie.
        imgCard.setAttribute("category", work.categoryId);
        // Le texte de la balise `figcaption` est défini comme étant le titre du travail (reçu via l'API).
        titleCard.innerText = work.title;

        // Les balises `img` et `figcaption` sont ajoutées à la balise parent `figure` (carte du travail).
        card.appendChild(imgCard);
        card.appendChild(titleCard);

        // La carte complète (contenant l'image et le titre) est ajoutée à la galerie.
        gallery.appendChild(card);
      });
    });
}

// Fonction pour récupérer les catégories depuis l'API
// Cette fonction est similaire à `getWorks()` mais pour récupérer les catégories.
async function getCategories() {
  // On utilise `fetch()` pour envoyer une requête GET à l'API pour récupérer les catégories.
  await fetch("http://localhost:5678/api/categories")
    // La réponse est convertie en JSON avec `.json()` comme précédemment.
    .then((response) => response.json())
    // Une fois les catégories reçues, on les traite ici.
    .then((categories) => {
      // Sélection de l'élément HTML qui contiendra le menu des catégories.
      // Cet élément a la classe `.filters` (en référence au style CSS fourni).
      const categoryMenu = document.querySelector(".filters");

      // Création d'un bouton "Tous" qui permet d'afficher tous les travaux.
      // Cela permet de ne pas filtrer les travaux selon une catégorie spécifique.
      const allButton = document.createElement("button");
      // Le texte du bouton est défini comme étant "Tous".
      allButton.innerText = "Tous";
      // Ajout de la classe `filtersNone` pour que ce bouton respecte le style CSS défini par l'utilisateur.
      allButton.classList.add("filtersNone");
      // Ajout de la classe filterActive pour le bouton "Tous" par défaut
      allButton.classList.add("filterActive");

      // Ajout d'un écouteur d'événements sur le bouton.
      // Quand ce bouton est cliqué, on appelle la fonction `getWorks()` pour afficher tous les travaux.
      allButton.addEventListener("click", () => {
        // Retirer la classe `filterActive` de tous les boutons pour réinitialiser l'état.
        document
          .querySelectorAll(".filters button")
          .forEach((button) => button.classList.remove("filterActive"));
        // Ajouter la classe `filterActive` au bouton "Tous" pour indiquer qu'il est actif.
        allButton.classList.add("filterActive");
        // Appel de la fonction qui affiche tous les travaux.
        getWorks();
      });

      // On ajoute le bouton "Tous" au menu des filtres (catégories).
      categoryMenu.appendChild(allButton);

      // Boucle sur chaque catégorie pour créer un bouton correspondant à chaque catégorie de travaux.
      categories.forEach((category) => {
        // Création d'un bouton pour chaque catégorie.
        const categoryButton = document.createElement("button");
        // Le texte du bouton est défini comme étant le nom de la catégorie.
        categoryButton.innerText = category.name;
        // Ajout de la classe `filtersNone` pour appliquer le style CSS.
        categoryButton.classList.add("filtersNone");

        // Ajout d'un écouteur d'événements pour chaque bouton.
        // Lorsqu'une catégorie est cliquée, la fonction `filterWorksByCategory()` est appelée avec l'ID de la catégorie en paramètre.
        categoryButton.addEventListener("click", () => {
          // Retirer la classe `filterActive` de tous les boutons pour réinitialiser l'état.
          document
            .querySelectorAll(".filters button")
            .forEach((button) => button.classList.remove("filterActive"));
          // Ajouter la classe `filterActive` au bouton de la catégorie cliquée pour indiquer qu'il est actif.
          categoryButton.classList.add("filterActive");
          // Appel de la fonction pour filtrer les travaux en fonction de la catégorie sélectionnée.
          filterWorksByCategory(category.id);
        });

        // On ajoute le bouton de la catégorie au menu des filtres.
        categoryMenu.appendChild(categoryButton);
      });
    });
}

// Fonction pour filtrer les travaux en fonction de la catégorie sélectionnée
// `categoryId` est l'ID de la catégorie sélectionnée, passé en argument.
async function filterWorksByCategory(categoryId) {
  // On récupère à nouveau les travaux depuis l'API pour les filtrer selon la catégorie.
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((dataWorks) => {
      // Sélection de l'élément HTML où les travaux seront affichés (galerie).
      const gallery = document.querySelector(".gallery");
      // On vide la galerie actuelle pour afficher les travaux filtrés.
      gallery.innerHTML = "";

      // `filter()` permet de filtrer le tableau `dataWorks` en ne conservant que les travaux dont l'ID de catégorie correspond à `categoryId`.
      const filteredWorks = dataWorks.filter(
        (work) => work.categoryId === categoryId
      );

      // Pour chaque travail filtré, on crée et affiche une carte de travail comme dans la fonction `getWorks()`.
      filteredWorks.forEach((work) => {
        const card = document.createElement("figure");
        const imgCard = document.createElement("img");
        const titleCard = document.createElement("figcaption");

        imgCard.src = work.imageUrl;
        imgCard.alt = work.title;
        titleCard.innerText = work.title;

        card.appendChild(imgCard);
        card.appendChild(titleCard);
        gallery.appendChild(card);
      });
      // console.log("Filtrage des travaux terminé avec succès."); // Log pour indiquer que le filtrage est terminé
    });
}

// Appel de la fonction pour récupérer et afficher le menu des catégories.
getCategories();
// Appel de la fonction pour récupérer et afficher les travaux au chargement de la page.
getWorks();



