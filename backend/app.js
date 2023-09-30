const express = require("express")
const puppeteer = require("puppeteer")

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.amazon.in');
    next();
});
  

app.get("/flipkart/:product",async(req,res)=>{
    const {product} = req.params

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    url = `https://www.flipkart.com/search?q=${decodeURIComponent(product)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`
    await page.goto(url);
    console.log(url);

    const productData = await page.evaluate(() => {
        if(flip_product = document.querySelector("._4ddWXP:not(:has(._4HTuuX))")){
            // For normal products
            const img = flip_product.querySelector("._396cs4").getAttribute("src");
            const title = flip_product.querySelector(".s1Q9rs").innerHTML;
            console.log("gv hb");
            const buyLink = flip_product.querySelector(".s1Q9rs").getAttribute("href")
            const price = flip_product.querySelector("._30jeq3").innerHTML;
            return {"productFound":true,img,title,buyLink,price}

        }else if (flip_product = document.querySelector("._1xHGtK:not(:has(._2I5qvP))")){
            const img = flip_product.querySelector("._2r_T1I").getAttribute("src");
            const title = flip_product.querySelector(".IRpwTa").innerHTML;
            console.log("rtfcf");
            const buyLink = flip_product.querySelector(".IRpwTa").getAttribute("href")
            const price = flip_product.querySelector("._30jeq3").innerHTML;
            return {"productFound":true,img,title,buyLink,price}

        }else if (flip_product = document.querySelector("._1fQZEK:not(:has(._2tfzpE))")){
            // for electronic gadgets
            const img = flip_product.querySelector("._396cs4").getAttribute("src");
            const title = flip_product.querySelector("._4rR01T").innerHTML;
            console.log("'fc '");
            const buyLink = flip_product.getAttribute("href")
            const price = flip_product.querySelector("._30jeq3._1_WHN1").innerHTML;
            return {"productFound":true,img,title,buyLink,price}

        }else{
            return {'productFound':false}
        }
    })

    await browser.close()
    res.json(productData)
})

app.get('/flipkart',(req,res)=>{
    res.json({"fgdfvc":"erfd"})
})
app.listen(8000,()=>{
    console.log("Running on port 8000");
})