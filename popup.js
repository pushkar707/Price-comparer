window.addEventListener('load', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeDetails,
    
  });
});

function scrapeDetails() {
  // let title = document.querySelector('h1#title').innerText;
  // title = title.trim();
  // title = title.replace("%","")
  // title = title.replaceAll("&","%26")
  // title = title.replace("/","%2F")

  // // Brand Name
  // let brand = document.getElementById("bylineInfo").innerText
  // brand = brand.replace("Visit the ","")
  // brand = brand.replace(" Store","")
  // brand = brand.replace("Brand: ","")
  // const price = document.querySelector(".a-price > span.a-offscreen").textContent;

  // // FETCHING PRODUCT RESULT FROM FLIPKART
  // fetch(`http://localhost:8000/flipkart?title=${title}&brand=${brand}&price=${price}`)
  // .then(res => res.json())
  // .then(data => {
    chrome.storage.local.get(["flipData"], function (data) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        // Handle the error
      } else {
        // Use the retrieved data in your code
        if(data.flipData.productFound){
          chrome.runtime.sendMessage({ action: 'detailsFound', data:data.flipData , "amazonTitle":title});
        }else{
          chrome.runtime.sendMessage({ action: 'detailsNotFound', "amazonTitle":title});
        }
      }
    })
  // })

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
    moreResults()
  }else{
    document.getElementById('details').innerHTML = "Could not find product on Flipkart"
    const {amazonTitle} = message
    moreResults()
  }
});

const moreResults = () => {
  const morePrices = document.querySelector("#morePrices")
  morePrices.style.display = "unset"

  chrome.storage.local.get(["googleData"], function (data) {
    console.log(data.googleData);
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      // Handle the error
    } else {
      // Use the retrieved data in your code
      morePrices.innerHTML = ""
    for (const buyOption of data.googleData){
      const {img,buyLink,price,company} = buyOption
      morePrices.innerHTML += `
      <div style="margin-top:15px">
        ${img && `<img src="${img}" width=100 height=100>`}
        <p>${price} -> ${company}</p>
        <a target="_blank" href="${buyLink}">Buy here</a>
      </div>
      `
    }
    }
  })

  // fetch(`http://localhost:8000/google?title=${title}`)
  // .then(res => res.json())
  // .then(data => {
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
  // })
}
