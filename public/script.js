import contractABI from "../contract/contractABI.json" with { type: 'json' }

// TODO: Add the contract address
const contractAddress = ""

let myAccount = ""
let contract = null

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
    })
}


// Add the Business Logic to interact with the Smart Contract