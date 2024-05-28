const form = document.getElementById('trackform')

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const loadingElement = document.getElementById('loading');
    const responseElement = document.getElementById('response');
    const buttonElement = document.getElementById('trackButton');

    const formData = new FormData(form);
    console.log(Array.from(formData))

    loadingElement.style.display = 'block'; // Show the loading indicator
    buttonElement.style.display = 'none';
    responseElement.style.display = 'none'

    fetch('/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';
            responseElement.textContent = `Response: ${data.message}`;
        })
        .catch(error => {
            loadingElement.style.display = 'none'; // Hide the loading indicator
            buttonElement.style.display = 'block';
            responseElement.style.display = 'block';
            responseElement.textContent = `Error: ${error.message}`;
        });
});
