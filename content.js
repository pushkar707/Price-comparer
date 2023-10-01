console.log("erdsaf3erwfrferf");

// function scrapeDetails() {
console.log("ERDSFXdxresdxzvcdf saafserds");
let title = document.querySelector("h1#title").innerText;
title = title.trim();
title = title.replace("%", "");
title = title.replaceAll("&", "%26");
title = title.replace("/", "%2F");

// Brand Name
let brand = document.getElementById("bylineInfo").innerText;
brand = brand.replace("Visit the ", "");
brand = brand.replace(" Store", "");
brand = brand.replace("Brand: ", "");
const price = document.querySelector(".a-price > span.a-offscreen").textContent;

// FETCHING PRODUCT RESULT FROM FLIPKART
fetch(
  `http://localhost:8000/flipkart?title=${title}&brand=${brand}&price=${price}`
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    chrome.storage.local.set({ flipData: data }, function () {
      console.log("Data saved to local storage.");
    });
    //   if(data.productFound){
    //     chrome.runtime.sendMessage({ action: 'detailsFound', data , "amazonTitle":title});
    //   }else{
    //     chrome.runtime.sendMessage({ action: 'detailsNotFound', "amazonTitle":title});
    //   }
  });

// }

// const moreResults = () => {
console.log("RDSFd4rerweasfrsdersdbv grfdc");
// let title = document.querySelector('h1#title').innerText;
fetch(`http://localhost:8000/google?title=${title}`)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    chrome.storage.local.set({ googleData: data }, function () {
      console.log("Data saved to local storage.");
    });
    //   morePrices.innerHTML = ""
    //   for (const buyOption of data){
    //     const {img,buyLink,price,company} = buyOption
    //     morePrices.innerHTML += `
    //     <div style="margin-top:15px">
    //       ${img && `<img src="${img}" width=100 height=100>`}
    //       <p>${price} -> ${company}</p>
    //       <a target="_blank" href="${buyLink}">Buy here</a>
    //     </div>
    //     `
    //   }
  });
// }



// document.addEventListener("DOMContentLoaded", function () {
// Your code here
// scrapeDetails();
// moreResults();
// });
