const express = require("express")
const puppeteer = require("puppeteer")
const cors = require("cors")
// const {calculateLevenshteinDistance} = require("./utils")

const app = express()
app.use(cors());
// app.use((req, res, next) => {
//     next();
// });


app.get("/flipkart",async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'https://www.amazon.in');
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
    },brand,title)

    await browser.close()
    res.json(productData)
})

app.get("/google",async(req,res) => {
    const {title} = req.query

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true,
        defaultViewport: null,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.99 Safari/537.36',
    });
    const page = await browser.newPage();
    page.on('console', (msg) => {
        console.log(`Page log: ${msg.text()}`);
    });
    url = `https://www.google.com/search?q=${decodeURIComponent(title)}`
    await page.goto(url);

    

    const prices = await page.evaluate(() => {
        // const priceRows = document.querySelectorAll("tr")
        const pricePattern = /\₹\d+(?:,\d{3})*(?:\.\d+)?/g;
        const buyOptions = []
        const searchResults = Array.from(document.querySelectorAll(".srKDX.cvP2Ce"))
        searchResults.push(...document.querySelectorAll(".N54PNb.BToiNc.cvP2Ce"))
        for (const result of searchResults){
            const priceTag = result.querySelector(".fG8Fp.uo4vr")
            const text = priceTag.textContent
            const price = text.match(pricePattern)
            const company = result.querySelector(".VuuXrf").textContent
            const buyLink = result.querySelector("a").getAttribute("href")
            const imgTag = result.querySelector(".LicuJb.uhHOwf.BYbUcd > img")
            img = imgTag && imgTag.getAttribute("src")
            price && buyOptions.push({price:price[0],company,buyLink,img})
        }
        
        return buyOptions
        // for (const row of priceRows){
        //     const seller =  row.querySelector(".RHJRod").textContent
        //     const price =  row.querySelector(".bLrxoe").textContent
        //     const buyLink = row.querySelector(",gWeIWe.jXbcVc > a").getAttribute("href")
        //     results.push(seller,price,buyLink)
        // }
        // return results
    })

    await browser.close()
    return res.json(prices)
})

app.get('/flipkart',(req,res)=>{
    res.json({"fgdfvc":"erfd"})
})
app.listen(8000,()=>{
    console.log("Running on port 8000");
})