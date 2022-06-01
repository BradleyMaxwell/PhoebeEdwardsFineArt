const collectorsCircleContainer = document.getElementById("collectors-circle")
let response = document.getElementById("collectors-circle-response")

const joinButton = collectorsCircleContainer.querySelector('button')

joinButton.addEventListener('click', async (e) => {
    console.log('clicked join button')
    e.preventDefault()

    const res = await fetch('/collectors-circle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: collectorsCircleContainer.querySelector('input').value
        })
    })

    const data = await res.json()

    if (data.message === "Welcome to the Collector's Circle!") {
        response.classList.remove('backend-error-message')
        response.classList.add('backend-success-message')
    } else {
        response.classList.remove('backend-success-message')
        response.classList.add('backend-error-message')
    }

    response.innerText = data.message
})