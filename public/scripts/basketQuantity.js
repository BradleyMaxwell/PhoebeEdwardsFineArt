const basketContainer = document.querySelector('#basket-item-card-container');
const basketItems = Array.from(document.querySelectorAll('.basket-item-card'))

let index = 0
basketItems.forEach(item => {
    const itemIndex = index
    index++

    const reduceQuantityButton = item.querySelector('.reduce-quantity-button')
    const increaseQuantityButton = item.querySelector('.increase-quantity-button')
    
    reduceQuantityButton.addEventListener('click', async () => {
        try {
            const res = await fetch('/basket/reduce-quantity', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemIndex
                })
            
            })

            window.location.reload()
        }
        catch (err) {
            console.log(err.message)
        }
    })

    if (increaseQuantityButton) { // items in the basket for original products cannot increase quantity
        increaseQuantityButton.addEventListener('click', async () => {
            try {
                const res = await fetch('/basket/increase-quantity', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    itemIndex
                    })
                
                })

                window.location.reload()
            }
            catch (err) {
                console.log(err.message)
            }

        })
    }
})

