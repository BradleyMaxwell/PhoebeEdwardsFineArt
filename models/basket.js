class Basket {
    constructor (basketItems) {
        this.items = basketItems // basketItems is an array of json objects
    }

    add (item) { // add a product into the basket
        const inBasketResult = inBasket(this.items, item)
        if (inBasketResult !== false) {
            if (this.items[inBasketResult].productType === "Print") {
                this.items[inBasketResult].quantity++
            } else {
                console.log("cannot add that item because it is already in the basket")
            }
        } else {
            item.quantity = 1
            this.items.push(item)
        }
    }

    reduceQuantity (index) {
        let foundItem = this.items[index]
        if (foundItem.quantity - 1 <= 0) { // then remove it from array if the quantity becomes 0
            this.items.splice(index, 1)
            console.log("removed item from the basket")
        } else {
            foundItem.quantity--
        }

    }

    increaseQuantity (index) {
        let foundItem = this.items[index]
        if (foundItem.productType === "Print") { // only allow increasing of quantity for print
            foundItem.quantity++
        } else {
            console.log("cannot increase quantity for an item of an original product")
        }
    }
}

function inBasket (basketItems, item) { // returns an index value of where the item is in the basket item array if it is found, or false otherwise
    for (let index = 0; index < basketItems.length; index++) {
        if (basketItems[index].productId === item.productId && basketItems[index].size === item.size && basketItems[index].selectedFraming === item.selectedFraming) { // the condition for grouping basked items
            return index
        }
    }

    return false
}

module.exports = { Basket }