const form = document.getElementById('trackform')

import contractABI from "../contract/contractABI.json" with { type: 'json' }

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
        contract.events.NewFood()
            .on("data", (event) => {
                console.log(event.returnValues)
                eventElement.style.display = 'block'
                eventElement.textContent = `Event emitted: ${event.returnValues.sender}, ${event.returnValues.productName}, ${event.returnValues.productId}, ${event.returnValues.price}`
            })
            .on("error", console.error)
    })
}


form.addEventListener('submit', async function (event) {
    // avoid the page to reload when submitting the form
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

                                                                // "send" method for writing data
    // for more information: https://docs.web3js.org/guides/migration_from_other_libs/ethers#calling-contracts-methods
    contract.methods.addFood(productName, productCode, productPrice).send({ from: myAccount })
        .then((receipt) => {
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';

            responseElement.innerHTML = `Transaction confirmed: <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">${receipt.transactionHash}</a>`;

            console.log(receipt)
        })
        .catch(err => {
            console.error(err)
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';

            responseElement.textContent = `Error: ${err}`
        })
});

document.getElementById("foodLogs").addEventListener('click', async () => {
                                                                            // "call" method only for reading data
    // for more information: https://docs.web3js.org/guides/migration_from_other_libs/ethers#calling-contracts-methods
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


document.getElementById("pastEvents").addEventListener('click', async () => {

    // how to get past events
    // for more information: https://docs.web3js.org/libdocs/Contract#getpastevents
    let pastEvents = await contract.getPastEvents("NewFood", {
        fromBlock: 0,
        toBlock: "latest"
    })

    pastEvents = pastEvents.map(event => ({name: event.returnValues.productName, id: Number(event.returnValues.productId), price: Number(event.returnValues.price)}))

    const displayElement = document.getElementById("pastEventsDisplay")
    let html = "<ul>"
    for (let i = 0; i < pastEvents.length; i++) {
        html += `<li><h3>${JSON.stringify(pastEvents[i])}</h3></li>`
    }
    html += "</ul>"

    displayElement.innerHTML = html
})