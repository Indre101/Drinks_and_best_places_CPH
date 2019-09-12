const sreadsheetId = "1rTkF6MEuG7v43VAXdnBuQ_3KKtWaMrP03lYvzobzF6k";
const endPoint = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/1/public/values?alt=json`;
const endPointTwo = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/2/public/values?alt=json`;




// const template = document.querySelector("template").content;
const categoryBtnTemplate = document.getElementById("categoryBtnTemplate").content;


// CATEGORIES JUST NAME AND ITS CONTAINER
const categoryNameTemplate = document.querySelector(".categoryNameTemplate").content;



// DRINKS AND PLACE PAGE
const drinksListPageTemplate = document.querySelector(".categoryNameTemplate").content;
const parentDrinkCategoriesAndDrinks = document.querySelector(".drinkCategoriesAndDrinks");



// ONE DRINK TEMPLATE
const oneDrinkTemplate = document.querySelector(".oneDrinkTemplate").content;
const drinksListContainer = document.querySelector(".drinksListContainer");


// PLACE LIST TEMPLATE FOR ATTACHING INSIDE DRINK CARD
let placeInfo = document.querySelector(".placeInfo").content;



let drinkObjectArray = [];
let categoryNamesArr = [];


// FETCH FIRST API OF DRINKS
fetch(endPoint).then(res => {
  return res.json()
}).then(showStuff)


// FUNCTION TO CREATE NEW OBJECTS FOR DRINKS
function showStuff(dataObject) {

  dataObject.feed.entry.forEach(element => {

    let drinksObject = new DrinkObject(element.gsx$id.$t, element.gsx$category.$t, element.gsx$drinkname.$t, element.gsx$shortdescription.$t, element.gsx$alcohol.$t, element.gsx$image.$t)
    drinkObjectArray.push(drinksObject);
    categoryNamesArr.push(drinksObject.category);

    appendDrinkCards(drinksObject);


  })




  const filteredCategoriesNamesOnly = filteredCategoriesArray();

  filteredCategoriesNamesOnly.forEach(drinkObj => {

    const categoryBtnTemplateClone = categoryBtnTemplate.cloneNode(true);
    categoryBtnTemplateClone.querySelector("button").textContent = drinkObj;
    document.querySelector(".categoryContainer").prepend(categoryBtnTemplateClone);



    const cloneDrinksPageTemplate = categoryNameTemplate.cloneNode(true);
    cloneDrinksPageTemplate.querySelector(".categoryName").textContent = drinkObj;
    parentDrinkCategoriesAndDrinks.appendChild(cloneDrinksPageTemplate);

  })

}




let filteredCategoriesArray = () =>
  categoryNamesArr.filter(function (item, index) {
    return categoryNamesArr.indexOf(item) >= index;
  });








// DRINKS OBJECT CONSTRUCTOR
function DrinkObject(drinkId, category, drinkName, shotDescription, alcohol, image) {
  this.drinkId = drinkId;
  this.category = category;
  this.drinkName = drinkName;
  this.shotDescription = shotDescription;
  this.alcohol = alcohol;
  this.image = image;

}


// PLACE OBJECT CONSTRUCTOR
function PlaceObject(placeName, address, drinkId, drinkPrice, placeImg, stars, link, description) {
  this.placeName = placeName;
  this.address = address;
  this.drinkId = drinkId;
  this.drinkPrice = drinkPrice;
  this.placeImg = placeImg;
  this.stars = stars;
  this.link = link;
  this.description = description;

}



function appendDrinkCards(drinkObject) {

  //   // CLONE OF DRINKS TEMPLATE

  console.log(drinkObject);

  const clnDrink = oneDrinkTemplate.cloneNode(true);
  clnDrink.querySelector(".drinkImg").src = `./img-icons/img/${drinkObject.image}.png`
  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkName;


  const placeList = clnDrink.querySelector(".placeList")


  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkname;
  clnDrink.querySelector(".oneDrinkContainer").onclick = function () {
    placeList.classList.toggle("d-none");
  }



  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkName;

  fetch(endPointTwo)
    .then(res => {
      return res.json()
    })
    .then(placeObject => {

      let placeArray = [];

      placeObject.feed.entry.forEach(place => {

        if (drinkObject.drinkId == place.gsx$drinkid.$t) {
          let newPlace = new PlaceObject(place.gsx$placename.$t, place.gsx$adddress.$t, place.gsx$drinkid.$t, place.gsx$drinkprice.$t, place.gsx$imageoftheplace.$t, place.gsx$starrate.$t, place.gsx$linktotheplacewebsite.$t, place.gsx$placedescribtion.$t)
          placeArray.push(newPlace);


        }
      })

      placeArray.forEach(placeObj => {

        let clnPlaceTempate = placeInfo.cloneNode(true);
        clnPlaceTempate.querySelector(".placeName").textContent = placeObj.placeName
        clnPlaceTempate.querySelector(".drinkPrice").textContent = placeObj.drinkPrice
        placeList.appendChild(clnPlaceTempate);

      })
    })




  drinksListContainer.appendChild(clnDrink);

}