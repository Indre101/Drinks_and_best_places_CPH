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
const searchTxt = document.getElementById("search-txt");
const searchBtn = document.getElementById("search-btn");
const isAlcoInputs = document.querySelectorAll(".isAlco");
const inputsFilters = document.querySelectorAll(".inputsFilters");

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

  const categoriesHeadings = document.querySelectorAll(".categoryName");
  const navigationButtons = document.querySelectorAll(".categoryLink");

  // ASSIGN ID
  categoriesHeadings.forEach(e => {
    e.id = e.textContent.split(" ").join("");
  });

  // ASSIGN ID'S AS LINKS
  navigationButtons.forEach(btn => {
    btn.href = `#${btn.textContent.split(" ").join("")}`;
  });

  // SEARCH TAB
  const drinkNames = document.querySelectorAll(".oneDrink");
  searchBtn.addEventListener("click", filterByName);
  function filterByName() {
    for (let index = 0; index < drinkNames.length; index++) {
      if (
        drinkNames[index].innerHTML
          .toLowerCase()
          .includes(searchTxt.value.toLowerCase())
      ) {
        drinkNames[index].style.display = "block";
      } else {
        drinkNames[index].style.display = "none";
      }
    }
  }

  function doc_keyUp(e) {
    // this would test for whichever key is 40 and the ctrl key at the same time
    if (e.keyCode == 13) {
      filterByName();
    }
  }
  // register the handler
  document.addEventListener("keydown", doc_keyUp, false);
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

let alcoAndNonAlcofilteredDrinks = [];
let alcoAndNonAlcofilteredDrinksNoRepeat = () =>
  alcoAndNonAlcofilteredDrinks.filter(function(item, index) {
    return alcoAndNonAlcofilteredDrinks.indexOf(item) >= index;
  });

let filterResults = [];

let filteredDrinks = [];
// filteredDrinks = filteredDrinks.concat(alcoAndNonAlcofilteredDrinksNoRepeat());
let filteredDrinksNoRepat = () =>
  filteredDrinks.filter(function(item, index) {
    return filteredDrinks.indexOf(item) >= index;
  });

// FILTER ACCORDING TO THE CATEGORY
const drinkCategryInput = document.querySelectorAll(".drinkCategryInput");

function testIngf(inputArrays) {
  let elements = Array.from(inputArrays);
  if (elements.every(item => item.checked != true)) {
    return true;
  } else {
    return false;
  }
}

function checkIfchecked(checkbox) {
  if (checkbox.checked === true) {
    return true;
  } else {
    // console.log("klm");

    return false;
  }
}

// FILTER IF WITH ALCOHOL
alcoholInput.addEventListener("click", getTheAlcoholDrinks);
nonAlco.addEventListener("click", getNonAlcoDrinks);

function getTheAlcoholDrinks() {
  parentDrinkCategoriesAndDrinks.innerHTML = "";

  if (testIngf(isAlcoInputs) && !testIngf(drinkCategryInput)) {
    let sorted = filteredDrinksNoRepat().filter(drink => {
      drinkCategryInput.forEach(inputCat => {
        if (inputCat.checked) {
          drink.category.toLowerCase() == inputCat.value.toLowerCase();
        }
      });
    });

    sorted.forEach(drink => {
      filteredDrinks.push(drink);
    });

    addDrinks(filteredDrinksNoRepat());
  } else if (testIngf(inputsFilters)) {
    addDrinks(drinkObjectArray);
  } else if (testIngf(drinkCategryInput) && !this.checked) {
    let sorted = filteredDrinksNoRepat().filter(drink => drink.alcohol == 1);
    myArray = filteredDrinksNoRepat().filter(function(el) {
      return !sorted.includes(el);
    });

    addDrinks(myArray);
  } else if (testIngf(drinkCategryInput) && this.checked) {
    let sorted = drinkObjectArray.filter(drink => drink.alcohol == 1);

    sorted.forEach(drink => {
      filteredDrinks.push(drink);
    });

    addDrinks(filteredDrinksNoRepat());
  } else if (!testIngf(isAlcoInputs) && !testIngf(drinkCategryInput)) {
    let uncheckedAlcoInputs = [];
    const getUncheckedAlcoInputs = () => {
      for (let index = 0; index < isAlcoInputs.length; index++) {
        if (!isAlcoInputs[index].checked) {
          uncheckedAlcoInputs.push(isAlcoInputs[index]);
        }
      }
    };

    getUncheckedAlcoInputs();
    const drinksToRemove = [];

    let sorted = filteredDrinksNoRepat().filter(drink => {
      drinkCategryInput.forEach(inp => {
        if (
          inp.checked &&
          drink.alcohol == this.value &&
          drink.category.toLowerCase() == inp.value.toLowerCase()
        ) {
          // let valuesToRemove = filteredDrinksNoRepat();
          filteredDrinks.push(drink);
          filterResults.push(drink);
        }
      });
    });

    filteredDrinksNoRepat().filter(drink => {
      uncheckedAlcoInputs.forEach(alc => {
        if (drink.alcohol == alc.value) {
          drinksToRemove.push(drink);
        }
      });
    });

    filterResults = filteredDrinksNoRepat().filter(function(el) {
      return !drinksToRemove.includes(el);
    });

    addDrinks(filterResults);
  }
}

function pushDrinkObjects(param) {
  let sorted = drinkObjectArray.filter(drink => drink.alcohol == param);
  sorted.forEach(e => {
    filteredDrinks.push(e);
  });
}

// NONE ALCO
function getNonAlcoDrinks() {
  parentDrinkCategoriesAndDrinks.innerHTML = "";

  if (testIngf(isAlcoInputs) && !testIngf(drinkCategryInput)) {
    let sorted = filteredDrinksNoRepat().filter(drink => {
      drinkCategryInput.forEach(inputCat => {
        if (inputCat.checked) {
          drink.category.toLowerCase() == inputCat.value.toLowerCase();
        }
      });
    });

    sorted.forEach(drink => {
      filteredDrinks.push(drink);
    });

    addDrinks(filteredDrinksNoRepat());
  } else if (testIngf(inputsFilters)) {
    addDrinks(drinkObjectArray);
  } else if (testIngf(drinkCategryInput) && !checkIfchecked(this)) {
    let sorted = filteredDrinksNoRepat().filter(drink => drink.alcohol == 0);

    myArray = filteredDrinksNoRepat().filter(function(el) {
      return !sorted.includes(el);
    });

    addDrinks(myArray);
  } else if (testIngf(drinkCategryInput) && checkIfchecked(this)) {
    let sorted = drinkObjectArray.filter(drink => drink.alcohol == 0);

    sorted.forEach(drink => {
      filteredDrinks.push(drink);
    });

    addDrinks(filteredDrinksNoRepat());
  } else if (!testIngf(isAlcoInputs) && !testIngf(drinkCategryInput)) {
    let uncheckedAlcoInputs = [];
    const getUncheckedAlcoInputs = () => {
      for (let index = 0; index < isAlcoInputs.length; index++) {
        if (!isAlcoInputs[index].checked) {
          uncheckedAlcoInputs.push(isAlcoInputs[index]);
        }
      }
    };

    getUncheckedAlcoInputs();
    const drinksToRemove = [];

    let sorted = filteredDrinksNoRepat().filter(drink => {
      drinkCategryInput.forEach(inp => {
        if (
          inp.checked &&
          drink.alcohol == this.value &&
          drink.category.toLowerCase() == inp.value.toLowerCase()
        ) {
          // let valuesToRemove = filteredDrinksNoRepat();
          filteredDrinks.push(drink);
          filterResults.push(drink);
        }
      });
    });

    filteredDrinksNoRepat().filter(drink => {
      uncheckedAlcoInputs.forEach(alc => {
        if (drink.alcohol == alc.value) {
          drinksToRemove.push(drink);
        }
      });
    });

    filterResults = filteredDrinksNoRepat().filter(function(el) {
      return !drinksToRemove.includes(el);
    });

    addDrinks(filterResults);
  }

  // else if (!testIngf(drinkCategryInput) && !this.checked) {
  //   console.log(alcoAndNonAlcofilteredDrinksNoRepeat());

  //   let sorted = alcoAndNonAlcofilteredDrinksNoRepeat().filter(
  //     drink => drink.alcohol == 0
  //   );

  //   myArray = alcoAndNonAlcofilteredDrinksNoRepeat().filter(function(el) {
  //     return !sorted.includes(el);
  //   });

  //   addDrinks(myArray);
  // }

  console.log(filteredDrinksNoRepat());
}

// console.log(testIngf(isAlcoInputs));

drinkCategryInput.forEach(drinkCategory => {
  drinkCategory.addEventListener("click", getJustCategoryDrinks);
});

function getJustCategoryDrinks() {
  // let clickCount = 0;
  parentDrinkCategoriesAndDrinks.innerHTML = "";

  if (testIngf(inputsFilters)) {
    addDrinks(drinkObjectArray);
  } else if (this.checked && testIngf(isAlcoInputs)) {
    console.log("this checked first");

    console.log(this);
    let sorted = drinkObjectArray.filter(
      drink => drink.category.toLowerCase() == this.value.toLowerCase()
    );

    sorted.forEach(drink => {
      filteredDrinks.push(drink);
      // filterResults.push(drink);
    });

    addDrinks(filteredDrinksNoRepat());
  } else if (!this.checked && testIngf(isAlcoInputs)) {
    let uncheckedCategoryInputs = [];
    const getUnChecked = () => {
      uncheckedCategoryInputs = [];

      for (let index = 0; index < drinkCategryInput.length; index++) {
        if (!drinkCategryInput[index].checked) {
          uncheckedCategoryInputs.push(drinkCategryInput[index]);
        }
      }
    };
    getUnChecked();
    let sorted = [];

    filteredDrinksNoRepat().filter(drink => {
      // sorted = [];
      uncheckedCategoryInputs.forEach(inpCat => {
        if (drink.category.toLowerCase() == inpCat.value.toLowerCase()) {
          sorted.push(drink);
        }
      });
    });

    filteredDrinks = filteredDrinksNoRepat().filter(function(el) {
      return !sorted.includes(el);
    });

    addDrinks(filteredDrinks);
  } else if (!testIngf(isAlcoInputs) && !testIngf(drinkCategryInput)) {
    pushDrinkObjects(0);

    let sorted = filteredDrinksNoRepat().filter(drink => {
      isAlcoInputs.forEach(inp => {
        if (
          inp.checked &&
          drink.alcohol == inp.value &&
          drink.category.toLowerCase() == this.value.toLowerCase()
        ) {
          filteredDrinks.push(drink);
          filterResults.push(drink);
        }
      });
    });
    addDrinks(filterResults);
  }
}

// FILTER BY PRICE
const filterByPrice = drinks => {
  const filtered = drinks.map(drink => {
    return drink.places.filter(place => {
      console.log(Number(place.drinkPrice), Number(priceInput.value));

      return parseInt(place.drinkPrice) <= parseInt(priceInput.value);
    });
  });

  return filtered;
};

priceInput.addEventListener("click", showFilteredByPrice);

// FILTER BY PRICE
let filteredDrinksByPrice = [];

function showFilteredByPrice() {
  parentDrinkCategoriesAndDrinks.innerHTML = "";
  console.log(filterByPrice(drinkObjectArray));

  if (filteredDrinksNoRepat().length == 0) {
    filteredDrinksByPrice = [];
    const filteredByPriceCall = filterByPrice(drinkObjectArray);

    for (let index = 0; index < drinkObjectArray.length; index++) {
      if (filteredByPriceCall[index].length != 0) {
        filteredDrinksByPrice.push(drinkObjectArray[index]);
      }
    }
  } else if (filteredDrinksNoRepat().length > 0) {
    filteredDrinksByPrice = [];
    const filteredByPriceCallFIltered = filterByPrice(filteredDrinksNoRepat());

    for (let index = 0; index < filteredDrinksNoRepat().length; index++) {
      if (filteredByPriceCallFIltered[index].length != 0) {
        filteredDrinksByPrice.push(filteredDrinksNoRepat()[index]);
      }
    }
  }

  addDrinks(filteredDrinksByPrice);
}

const main = () => {
  getPlaces().then(res => {
    places = res;

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
    clnPlaceTempate.querySelector(
      ".drinkPrice"
    ).textContent = `${placeObj.drinkPrice},-`;

    clnPlaceTempate.querySelector(".placeAdress").textContent =
      placeObj.address;

    clnPlaceTempate.querySelector(".stars").textContent = `☆ ${placeObj.stars}`;
    clnPlaceTempate.querySelector(".stars").style.color = "yellow";
    clnPlaceTempate.querySelector(".describtion").textContent =
      placeObj.description;
    clnPlaceTempate.querySelector(".linkToWebsite").href = placeObj.link;

    const placeDescribtion = clnPlaceTempate.querySelector(".placeDescribtion");
    const closeModalBtn = clnPlaceTempate.querySelector(".closeButton");

    clnPlaceTempate
      .querySelector(".placeInfoContainer")
      .addEventListener("click", showModal);

    function showModal() {
      placeDescribtion.classList.toggle("d-none");
    }

    placeList.appendChild(clnPlaceTempate);
  });

  drinkCardContainer.appendChild(clnDrink);
}

main();

//
