

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
  title = title.replace("%","")
  title = title.replaceAll("&","%26")
  title = title.replace("/","%2F")

  // Brand Name
  let brand = document.getElementById("bylineInfo").innerText
  brand = brand.replace("Visit the ","")
  brand = brand.replace(" Store","")
  brand = brand.replace("Brand: ","")
  const price = document.querySelector(".a-price > span.a-offscreen").textContent;

  // FETCHING PRODUCT RESULT FROM FLIPKART
  fetch(`http://localhost:8000/flipkart?title=${title}&brand=${brand}&price=${price}`)
  .then(res => res.json())
  .then(data => {
    if(data.productFound){
      chrome.runtime.sendMessage({ action: 'detailsFound', data , "amazonTitle":title});
    }else{
      chrome.runtime.sendMessage({ action: 'detailsNotFound', "amazonTitle":title});
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
    moreResults(amazonTitle)
  }else{
    document.getElementById('details').innerHTML = "Could not find product on Flipkart"
    const {amazonTitle} = message
    moreResults(amazonTitle)
  }
});

const moreResults = (title) => {
  const morePrices = document.querySelector("#morePrices")
  morePrices.style.display = "unset"
  fetch(`http://localhost:8000/google?title=${title}`)
  .then(res => res.json())
  .then(data => {
    morePrices.innerHTML = ""
    for (const buyOption of data){
      const {img,buyLink,price,company} = buyOption
      morePrices.innerHTML += `
      <div style="margin-top:15px">
        ${img && `<img src="${img}" width=100 height=100>`}
        <p>${price} -> ${company}</p>
        <a target="_blank" href="${buyLink}">Buy here</a>
      </div>
      `
    }
  })

}
