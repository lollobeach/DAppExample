function waitSeconds() {
    return new Promise((resolve) => {
        setTimeout(resolve, 5000)
    })
}

async function sendData(foodName, productCode, productPrice) {

    await waitSeconds()
    console.log(foodName)
    console.log(productCode)
    console.log(productPrice)

    return "Ok"
}

module.exports = { sendData }