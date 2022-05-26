const checkoutButton = document.querySelector("#checkoutButton")

checkoutButton.addEventListener('click', async (e) => {
    e.preventDefault()
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
        window.location = url
    })
})