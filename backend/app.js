const express = require("express")
const puppeteer = require("puppeteer")
// const {calculateLevenshteinDistance} = require("./utils")

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.amazon.in');
    next();
});
  

app.get("/flipkart",async(req,res)=>{
    const {title,brand,price} = req.query
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', (msg) => {
        console.log(`Page log: ${msg.text()}`);
    });
    url = `https://www.flipkart.com/search?q=${decodeURIComponent(title)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`
    await page.goto(url);
    console.log(url);

    
    const productData = await page.evaluate((brand,title) => {
        brand = brand.toLowerCase()
        const calculateLevenshteinDistance = (str1, str2) => {
            // We are considering word 1 is shorter
            // const minLength = Math.min(str1.length, str2.length);
            str1 = str1.toLowerCase()
            str1 = str1.replaceAll(",","")
            str1 = str1.replaceAll("(","")
            str1 = str1.replaceAll(")","")
            str1 = str1.replaceAll("-","")
          
            str2 = str2.toLowerCase()
            str2 = str2.replaceAll(",","")
            str2 = str2.replaceAll("(","")
            str2 = str2.replaceAll(")","")
            str2 = str2.replaceAll("-","")
          
            const words1 = str1.split(" ");
            const words2 = str2.split(" ");
            console.log(words1);
            console.log(words2);
          
            // Calculate the intersection of word sets
            const intersection = new Set(words1.filter(word => words2.includes(word)));
            console.log(intersection);
          
            // Calculate Jaccard similarity
            const similarity = (intersection.size / words1.length)*100;
            return similarity;
        }

        const findBestProduct = (flip_products,title,imgClass,buyLinkClass,priceClass,amaz_title) => {
            let brand_match = []
            console.log(typeof(flip_products));
            for (const product of flip_products){
                const flipBrandElem = product.querySelector("._2WkVRV")
                const flip_title = product.querySelector(title).innerHTML;
                if(flipBrandElem){
                    const flipBrand = flipBrandElem.innerHTML.toLowerCase()
                    console.log(brand);
                    console.log(flipBrand);
                    if(flipBrand == brand){
                        brand_match.push({"title":flip_title,"product":product})
                    }
                }else{
                    const flip_title_words = flip_title.toLowerCase().split(" ")
                    if (!flip_title_words.includes(brand)){
                        continue;
                    }
                    else{
                        // if(brand_match.length <= 3){
                            brand_match.push({"title":flip_title,"product":product})
                        // }else{
                        //     break;
                        // }
                    }
                }
            }
        
            // Now I have matching brands
            // Calculating best matching result of these
            if(brand_match.length){
                let best = {'match':0}
                for (const match of brand_match){
                    if(calculateLevenshteinDistance(match.title,amaz_title) > best.match){
                        console.log("iuhghbiuhygvh");
                        match.match = calculateLevenshteinDistance(match.title,amaz_title)
                        best = match
                    }
                }
                const {product,title} = best
                const img = product.querySelector(imgClass).getAttribute("src");
                const buyLink = buyLinkClass ? product.querySelector(buyLinkClass).getAttribute("href") : product.getAttribute("href")
                const price = product.querySelector(priceClass).innerHTML;
                return {"productFound":true,img,title,buyLink,price}
            }
            return {"productFound":false}
        }
        if((flip_products = document.querySelectorAll("._4ddWXP:not(:has(._4HTuuX))")) && flip_products.length >= 1){
            console.log("Product 1 type");
            return findBestProduct(flip_products,".s1Q9rs","._396cs4",".s1Q9rs","._30jeq3",title)            
        }else if ((flip_products = document.querySelectorAll("._1xHGtK:not(:has(._2I5qvP))")) && flip_products.length >= 1){
            console.log("Product tyoe 2");
            return findBestProduct(flip_products,".IRpwTa","._2r_T1I",".IRpwTa","._30jeq3",title)            
        }else if ((flip_products = document.querySelectorAll("._1fQZEK:not(:has(._2tfzpE))")) && flip_products.length >= 1){
            console.log("Product 3 type");
            return findBestProduct(flip_products,"._4rR01T","._396cs4","","._30jeq3._1_WHN1",title)
        }else{
            console.log("No matching product element");
            return {'productFound':false}
        }  
        
        // if(flip_product = document.querySelector("._4ddWXP:not(:has(._4HTuuX))")){
        //     // For normal products
        //     const img = flip_product.querySelector("._396cs4").getAttribute("src");
        //     const title = flip_product.querySelector(".s1Q9rs").innerHTML;
        //     console.log("gv hb");
        //     const buyLink = flip_product.querySelector(".s1Q9rs").getAttribute("href")
        //     const price = flip_product.querySelector("._30jeq3").innerHTML;
        //     return {"productFound":true,img,title,buyLink,price}

        // }else if (flip_product = document.querySelector("._1xHGtK:not(:has(._2I5qvP))")){
        //     const img = flip_product.querySelector("._2r_T1I").getAttribute("src");
        //     const title = flip_product.querySelector(".IRpwTa").innerHTML;
        //     console.log("rtfcf");
        //     const buyLink = flip_product.querySelector(".IRpwTa").getAttribute("href")
        //     const price = flip_product.querySelector("._30jeq3").innerHTML;
        //     return {"productFound":true,img,title,buyLink,price}

        // }else if (flip_product = document.querySelector("._1fQZEK:not(:has(._2tfzpE))")){
        //     // for electronic gadgets
        //     const img = flip_product.querySelector("._396cs4").getAttribute("src");
        //     const title = flip_product.querySelector("._4rR01T").innerHTML;
        //     console.log("'fc '");
        //     const buyLink = flip_product.getAttribute("href")
        //     const price = flip_product.querySelector("._30jeq3._1_WHN1").innerHTML;
        //     return {"productFound":true,img,title,buyLink,price}

        // }else{
        //     return {'productFound':false}
        // }
    },brand,title)

    await browser.close()
    res.json(productData)
})

app.get('/flipkart',(req,res)=>{
    res.json({"fgdfvc":"erfd"})
})
app.listen(8000,()=>{
    console.log("Running on port 8000");
})