

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
  title = title.replace("/","%2F")
  const price = document.querySelector(".a-price > span.a-offscreen").textContent;

  // FETCHING PRODUCT RESULT FROM FLIPKART
  fetch("http://localhost:8000/flipkart/"+title)
  .then(res => res.json())
  .then(data => {
    if(data.productFound){
      chrome.runtime.sendMessage({ action: 'detailsFound', data , "amazonTitle":title});
    }else{
      chrome.runtime.sendMessage({ action: 'detailsNotFound'});
    }
  })

}
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'detailsFound') {
    const {img, price, title, buyLink} = message.data
    const {amazonTitle} = message
    // console.log(calculateLevenshteinDistance(title,amazonTitle));
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