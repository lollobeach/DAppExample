const form = document.getElementById('trackform')

import contractABI from "../contract/contractABI.json" with { type: 'json' }

// Contract Address: 0xbe2d2cc7ce927d8e682f45e6fd86ab31758d15af
const contractAddress = "0xbe2d2cc7ce927d8e682f45e6fd86ab31758d15af"

let myAccount = ""
let contract = null

const eventElement = document.getElementById("event")

if (window.ethereum !== null) {
    window.ethereum.request({
        "method": "eth_requestAccounts",
        "params": []
    }).then(async () => {
        console.log("Connected")
        const web3 = new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        myAccount = accounts[0]
        contract = new web3.eth.Contract(contractABI, contractAddress)

        // how to stay listening to events
        contract.events.NewFood()
            .on("data", (event) => {
                console.log(event.returnValues)
                eventElement.style.display = 'block'
                eventElement.textContent = `Event emitted: ${event.returnValues.productName}, ${event.returnValues.productId}, ${event.returnValues.price}`
            })
            .on("error", console.error)
    })
}


form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const data = new FormData(form)
    const productName = data.get("foodName")
    const productCode = data.get("productCode")
    const productPrice = data.get("productPrice")

    eventElement.style.display = 'none'

    const loadingElement = document.getElementById('loading');
    const responseElement = document.getElementById('response');
    const buttonElement = document.getElementById('trackButton');

    loadingElement.style.display = 'block';
    buttonElement.style.display = 'none';
    responseElement.style.display = 'none'

    // Send the transaction - "send()" method
    contract.methods.addFood(productName, productCode, productPrice).send({ from: myAccount })
        // await the response
        .then((receipt) => {
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';

            responseElement.innerHTML = `Transaction confirmed: <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">${receipt.transactionHash}</a>`;

            console.log(receipt)
        })
        // capture the error
        .catch(err => {
            console.error(err)
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';

            responseElement.textContent = `Error: ${err}`
        })
});

document.getElementById("foodLogs").addEventListener('click', async () => {
    // Call the "getFoodTrackedByAddress" method - "call()" method that not modify the blockchain
    let foodTracked = await contract.methods.getFoodTrackedByAddress(myAccount).call()

    foodTracked = foodTracked.map(item => ({name: item.name, id: Number(item.id), price: Number(item.price)}))

    const displayElement = document.getElementById("foodLogsDisplay")
    let html = "<ul>"
    for (let i = 0; i < foodTracked.length; i++) {
        html += `<li><h3>${JSON.stringify(foodTracked[i])}</h3></li>`
    }
    html += "</ul>"

    displayElement.innerHTML = html
})