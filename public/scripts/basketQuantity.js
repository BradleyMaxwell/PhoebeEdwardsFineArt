async function reduceQuantity (itemIndex) {
    try {
        const res = await fetch('/basket/reduce-quantity', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                    itemIndex
            })
            
        })

        if (res.ok) {
            $("#header-basket-icon").load(location.href+" #header-basket-icon>*");
            $("#basket-container").load(location.href+" #basket-container>*","");
        }
    }
    catch (err) {
         console.log(err.message)
    }
}

async function increaseQuantity (itemIndex) {
    try {
        const res = await fetch('/basket/increase-quantity', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                    itemIndex
            })
            
        })

        if (res.ok) {
            $("#header-basket-icon").load(location.href+" #header-basket-icon>*");
            $("#basket-item-card-container").load(location.href+" #basket-item-card-container>*","");
        }
    }
    catch (err) {
         console.log(err.message)
    }
}

