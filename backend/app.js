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
    await page.goto(`https://www.flipkart.com/search?q=${decodeURIComponent(product)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`);

    const productData = await page.evaluate(() => {
        const flip_product = document.querySelector("._4ddWXP:not(:has(._4HTuuX))")
        if(flip_product){
            const img = flip_product.querySelector("._396cs4").getAttribute("src");
            const title = flip_product.querySelector(".s1Q9rs").innerHTML;
            const buyLink = flip_product.querySelector(".s1Q9rs").getAttribute("href")
            const price = flip_product.querySelector("._30jeq3").innerHTML;
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