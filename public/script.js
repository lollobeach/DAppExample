const form = document.getElementById('trackform')

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

    web3.eth.getAccounts().then(console.log).catch(console.error)


    // const loadingElement = document.getElementById('loading');
    // const responseElement = document.getElementById('response');
    // const buttonElement = document.getElementById('trackButton');

    // loadingElement.style.display = 'block'; // Show the loading indicator
    // buttonElement.style.display = 'none';
    // responseElement.style.display = 'none'

    // fetch('/submit', {
    //     method: 'POST',
    //     body: formData
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         loadingElement.style.display = 'none'; // Hide the loading indicator
    //         buttonElement.style.display = 'block';
    //         responseElement.style.display = 'block';
    //         responseElement.textContent = `Response: ${data.message}`;
    //     })
    //     .catch(error => {
    //         loadingElement.style.display = 'none'; // Hide the loading indicator
    //         buttonElement.style.display = 'block';
    //         responseElement.style.display = 'block';
    //         responseElement.textContent = `Error: ${error.message}`;
    //     });
});
