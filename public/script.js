const form = document.getElementById('trackform')

import contractABI from "../contract/contractABI.json" with { type: 'json' }

// Contract Address: 0xbe2d2cc7ce927d8e682f45e6fd86ab31758d15af

async function metamaskConnection() {
    if (window.ethereum !== null) {
        try {
            await window.ethereum.request({
                "method": "eth_requestAccounts",
                "params": []
            })
        } catch (e) {
            console.error(e)
            return e
        }
    }
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    await metamaskConnection()
    const web3 = new Web3(window.ethereum)
    const myAccount = await web3.eth.getAccounts()[0]
    const contractAddress = "0xbe2d2cc7ce927d8e682f45e6fd86ab31758d15af"

    const data = new FormData(form)
    const productName = data.get("foodName")
    const productCode = data.get("productCode")
    const productPrice = data.get("productPrice")


    const loadingElement = document.getElementById('loading');
    const responseElement = document.getElementById('response');
    const buttonElement = document.getElementById('trackButton');

    loadingElement.style.display = 'block';
    buttonElement.style.display = 'none';
    responseElement.style.display = 'none'

    const contract = new web3.eth.Contract(contractABI, contractAddress)

    contract.methods.addFood(productName, productCode, productPrice).send({from: myAccount})
        .then((receipt) => {
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';

            responseElement.textContent = `Response: ${receipt}`;

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
