const sreadsheetId = "1rTkF6MEuG7v43VAXdnBuQ_3KKtWaMrP03lYvzobzF6k";
const endPoint = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/1/public/values?alt=json`;
const endPointTwo = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/2/public/values?alt=json`;





fetch(endPoint).then(res => {
  return res.json()
}).then(showStuff);

fetch(endPointTwo).then(res => {
  return res.json()
}).then(showStuff);

function showStuff(element) {


  console.log(element.feed.entry)
  console.log(element.feed.entry)





}