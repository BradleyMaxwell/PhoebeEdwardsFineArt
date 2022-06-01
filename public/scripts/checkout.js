const checkoutButton = document.querySelector("#checkoutButton")

checkoutButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let processingResponse = document.querySelector('.processing')
            processingResponse.innerText = "Redirecting you to checkout..."
            processingResponse.style.display = 'block'

    await fetch('/basket/checkout', {
        method: "POST"
    }).then(res => {
        if (res.ok) { // if the response was fine then return the json passed from the response, which is the stripe session url
            return res.json()
        }
        else {
            console.log("response was not ok")
        }
    }).then(({ url }) => {
        processingResponse.style.display = "none"
        window.location = url
    })
})