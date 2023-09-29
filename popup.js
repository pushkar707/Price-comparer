// chrome.webNavigation.onCompleted.addListener((details) => {
//   // Check if this event is for a tab that your extension is active on
//   // You can use the URL or other criteria to identify the tab
//   if (/* Check if this is the tab where your extension should work */) {
//     // Perform a new API request
//     makeApiRequest();
//   }
// });

// function makeApiRequest() {
//   // Perform the API request
//   // Once you have the data, store it in a variable
//   const apiData = scrapeDetails();

//   // Store the data in Chrome's local storage
//   chrome.storage.local.set({ 'cachedData': apiData });

//   // Display the data
//   displayData(apiData);
// }

window.addEventListener('load', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeDetails,
  });
});

function scrapeDetails() {
  let title = document.querySelector('h1#title').textContent;
  title = title.trim();
  title = title.replaceAll("&","%26")
  title = title.replace("%","")
  const price = document.querySelector(".a-price > span.a-offscreen").textContent;

  // FETCHING PRODUCT RESULT FROM FLIPKART
  fetch("http://localhost:8000/flipkart/"+title)
  .then(res => res.json())
  .then(data => {
    if(data.productFound){
      chrome.runtime.sendMessage({ action: 'detailsFound', data});
    }else{
      chrome.runtime.sendMessage({ action: 'detailsNotFound', data});
    }
  })

}
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'detailsFound') {
    const {img, price, title, buyLink} = message.data
    document.getElementById('details').innerHTML = `
    <img src="${img}" width=100 height=100>
    <p>${title}</p>
    <p>${price}</p>
    <a target="_blank" href="https://www.flipkart.com${buyLink}">Buy here</a>
    `;
  }else{
    document.getElementById('details').innerHTML = "Could not find product on Flipkart"
  }
});