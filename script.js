const sreadsheetId = "1rTkF6MEuG7v43VAXdnBuQ_3KKtWaMrP03lYvzobzF6k";
const drinksUrl = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/1/public/values?alt=json`;
const placesUrl = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/2/public/values?alt=json`;

// const template = document.querySelector("template").content;
const categoryBtnTemplate = document.getElementById("categoryBtnTemplate")
  .content;

// CATEGORIES JUST NAME AND ITS CONTAINER
const categoryNameTemplate = document.querySelector(".categoryNameTemplate")
  .content;

// DRINKS AND PLACE PAGE
const drinksListPageTemplate = document.querySelector(".categoryNameTemplate")
  .content;
const parentDrinkCategoriesAndDrinks = document.querySelector(
  ".drinkCategoriesAndDrinks"
);

// ONE DRINK TEMPLATE
const oneDrinkTemplate = document.querySelector(".oneDrinkTemplate").content;
// const drinksListContainer = document.querySelector(".drinksListContainer");

// PLACE LIST TEMPLATE FOR ATTACHING INSIDE DRINK CARD
let placeInfo = document.querySelector(".placeInfo").content;

// FILTERS AND SORTING OPTIONS DOM ELEMENT
const alcoholInput = document.getElementById("alcoholInput");
const nonAlco = document.getElementById("non-alcoholInput");
const priceInput = document.querySelector("#priceInput");

let drinkObjectArray = [];
let categoryNamesArr = [];
let places = [];

// FETCH FIRST API OF DRINKS
fetch(drinksUrl)
  .then(res => {
    return res.json();
  })
  .then(dataObject => dataObject.feed.entry.forEach(createDrinkObj))
  .then(addCategoryButtons);

// FIRST FUNCTION  CREATES DRINK OBJECTTS WITH PLACES
const createDrinkObj = drinkObject => {
  // CREATE INITIAL DRINK OBJECT AND PUSH THE CATEGORY NAMES TO CREATE A FILTERED CATEGORY NAME ARRAY
  let drinkObjectCard = new DrinkObject(
    drinkObject.gsx$id.$t,
    drinkObject.gsx$category.$t,
    drinkObject.gsx$drinkname.$t,
    drinkObject.gsx$shortdescription.$t,
    drinkObject.gsx$alcohol.$t,
    drinkObject.gsx$image.$t
  );

  drinkObjectArray.push(drinkObjectCard);
  // drinkObjectCard.placesTest();
  categoryNamesArr.push(drinkObjectCard.category);
};

// SECOND FUNCTION CREATED CATEGORY BUTTONS
function addCategoryButtons() {
  const filteredCategoriesNamesOnly = filteredCategoriesArray();
  filteredCategoriesNamesOnly.forEach(drinkObj => {
    const categoryBtnTemplateClone = categoryBtnTemplate.cloneNode(true);
    categoryBtnTemplateClone.querySelector("button").textContent = drinkObj;
    document
      .querySelector(".categoryContainer")
      .prepend(categoryBtnTemplateClone);
  });
}

// THIRD FUNCTION TO SEPARATE AND ADD DRINK CARDS TO RIGHT CATEGORIES
function addDrinks(drinks) {
  const filteredCategoriesNamesOnly = filteredCategoriesArray();

  filteredCategoriesNamesOnly.forEach(drinkObj => {
    // DRINKS PAGE
    const cloneDrinksPageTemplate = categoryNameTemplate.cloneNode(true);
    cloneDrinksPageTemplate.querySelector(
      ".categoryName"
    ).textContent = drinkObj;
    let drinksListContainer = cloneDrinksPageTemplate.querySelector(
      ".drinksListContainer"
    );

    drinks.forEach(drinkCategory => {
      if (drinkCategory.category == drinkObj) {
        appendDrinkCards(drinkCategory, drinksListContainer);
      }
    });

    parentDrinkCategoriesAndDrinks.appendChild(cloneDrinksPageTemplate);
  });
}

// FILTERING THE CATEGORIES NAMES
let filteredCategoriesArray = () =>
  categoryNamesArr.filter(function(item, index) {
    return categoryNamesArr.indexOf(item) >= index;
  });

let placeArr = [];
// DRINKS OBJECT CONSTRUCTOR
function DrinkObject(
  drinkId,
  category,
  drinkName,
  shotDescription,
  alcohol,
  image
) {
  this.drinkId = drinkId;
  this.category = category;
  this.drinkName = drinkName;
  this.shotDescription = shotDescription;
  this.alcohol = alcohol;
  this.image = image;
  this.places = [];
}

const createNewPlace = place =>
  new PlaceObject(
    place.gsx$placename.$t,
    place.gsx$adddress.$t,
    place.gsx$drinkid.$t,
    place.gsx$drinkprice.$t,
    place.gsx$imageoftheplace.$t,
    place.gsx$starrate.$t,
    place.gsx$linktotheplacewebsite.$t,
    place.gsx$placedescribtion.$t
  );

// SECOND FETCH FOR PLACES
const getPlaces = () =>
  fetch(placesUrl)
    .then(res => res.json())
    .then(place => place.feed.entry.map(createNewPlace));

const addPlacesToDrinks = () => {
  for (let index = 0; index < drinkObjectArray.length; index++) {
    for (let j = 0; j < places.length; j++) {
      if (drinkObjectArray[index].drinkId == places[j].drinkId) {
        drinkObjectArray[index].places.push(places[j]);
      }
    }
  }
};

alcoholInput.addEventListener("click", getTheAlcoholDrinks);
nonAlco.addEventListener("click", getNonAlcoDrinks);

let filteredDrinks = [];
let filteredDrinksNoRepat = () =>
  filteredDrinks.filter(function(item, index) {
    return filteredDrinks.indexOf(item) >= index;
  });

function getNonAlcoDrinks() {
  parentDrinkCategoriesAndDrinks.innerHTML = "";

  let sorted = drinkObjectArray.filter(drink => drink.alcohol == 0);
  sorted.forEach(drink => {
    filteredDrinks.push(drink);
  });

  addDrinks(filteredDrinksNoRepat());
  console.log();
}

const drinkCategryInput = document.querySelectorAll(".drinkCategryInput");
drinkCategryInput.forEach(drinkCategory => {
  drinkCategory.addEventListener("click", getJustCategoryDrinks);
});

function checkIfchecked(checkbox) {
  if (checkbox.checked == true) {
    console.log(true);
  } else {
    console.log(false);
    return false;
  }
}

function getJustCategoryDrinks() {
  // let clickCount = 0;

  let sorted = drinkObjectArray.filter(
    drink => drink.category.toLowerCase() == this.value.toLowerCase()
  );

  if (!checkIfchecked(this)) {
    console.log("nottrue");
    parentDrinkCategoriesAndDrinks.innerHTML = "";
    filteredDrinksNoRepat().filter(el => !sorted.includes(el));

    console.log(filteredDrinksNoRepat());
    addDrinks(filteredDrinksNoRepat());
  }

  parentDrinkCategoriesAndDrinks.innerHTML = "";
  sorted.forEach(drink => {
    filteredDrinks.push(drink);
  });

  addDrinks(filteredDrinksNoRepat());

  console.log(filteredDrinksNoRepat());
}

function getTheAlcoholDrinks() {
  parentDrinkCategoriesAndDrinks.innerHTML = "";
  let sorted = drinkObjectArray.filter(drink => drink.alcohol == 1);

  sorted.forEach(drink => {
    filteredDrinks.push(drink);
  });

  addDrinks(filteredDrinksNoRepat());
}

const filterByPrice = () => {
  let sorted = drinkObjectArray.map(drink => {
    drink.places.filter(place => place.drinkPrice <= priceInput.value);
  });

  console.log(sorted, priceInput.value);
  return sorted;
};

const main = () => {
  getPlaces().then(res => {
    places = res;

    // console.log(drinkObjectArray);
    priceInput.addEventListener("click", filterByPrice);

    addPlacesToDrinks();
    addDrinks(drinkObjectArray);
  });
};

// PLACE OBJECT CONSTRUCTOR
function PlaceObject(
  placeName,
  address,
  drinkId,
  drinkPrice,
  placeImg,
  stars,
  link,
  description
) {
  this.placeName = placeName;
  this.address = address;
  this.drinkId = drinkId;
  this.drinkPrice = drinkPrice;
  this.placeImg = placeImg;
  this.stars = stars;
  this.link = link;
  this.description = description;
}

function appendDrinkCards(drinkObject, drinkCardContainer) {
  //   // CLONE OF DRINKS TEMPLATE

  const clnDrink = oneDrinkTemplate.cloneNode(true);
  clnDrink.querySelector(
    ".drinkImg"
  ).src = `./img-icons/img/${drinkObject.image}.png`;
  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkName;

  const placeList = clnDrink.querySelector(".placeList");

  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkname;

  clnDrink.querySelector(".oneDrinkContainer").onclick = function() {
    placeList.classList.toggle("d-none");
  };

  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkName;

  drinkObject.places.forEach(placeObj => {
    let clnPlaceTempate = placeInfo.cloneNode(true);
    clnPlaceTempate.querySelector(".placeName").textContent =
      placeObj.placeName;
    clnPlaceTempate.querySelector(".drinkPrice").textContent =
      placeObj.drinkPrice;
    placeList.appendChild(clnPlaceTempate);
  });

  drinkCardContainer.appendChild(clnDrink);
}

main();