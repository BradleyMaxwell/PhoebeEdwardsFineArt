class Basket {
    constructor (basketItems) {
        this.items = basketItems // basketItems is an array of json objects
        this.totalPrice = 0
    }

    add (item) { // add a product into the basket
        const inBasketResult = inBasket(this.items, item)
        if (inBasketResult !== false) {
            this.items[inBasketResult].quantity++
        } else {
            item.quantity = 1
            this.items.push(item)
        }

        this.calculateTotal()
    }

    delete (item) { // reduces the quantity of a given item by 1, or removes it from the basket if it's the last one of that item
        const inBasketResult = inBasket(this.items, item)
        if (inBasketResult !== false) {
            this.items[inBasketResult].quantity--
            if (this.items[inBasketResult].quantity <= 0) {
                this.items.splice(inBasketResult, 1)
            }
        }
    }

    calculateTotal () { // call this every time a change is made to the basket
        this.totalPrice = 0
        for (let item = 0; item < this.items.length; item++) {
            const currentItem = this.items[item]
            this.totalPrice += currentItem.unitPrice * currentItem.quantity
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