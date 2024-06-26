const express = require("express")
const app = express()
const port = 3000

const path = require("path")

app.use(express.static(path.join(__dirname, 'public')))
app.use('/contract', express.static(path.join(__dirname, 'contract')))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homePage.html'))
})

app.get("/track", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'trackPage.html'))
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})