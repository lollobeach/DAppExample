const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 3000

const path = require("path")

const { sendData } = require("./controller/smartContractInteraction")

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homePage.html'))
})

app.get("/track", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'trackPage.html'))
})

app.post("/submit", async (req, res) => {

    console.log(req.body)
    const foodName = req.body.foodName
    const productCode = req.body.productCode
    const productPrice = req.body.productPrice

    const response = await sendData(foodName, productCode, productPrice)
    res.status(200).send({message: response})
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})