// Initialise the values from the data attributes at the start so they do not effect the script if a user changes them in dev tools

let isOriginal
let hasFramingOption

const printSizeButtons = Array.from(document.querySelectorAll('.printSizeButton'))
const framingOptionButtons = Array.from(document.querySelectorAll('.framingOptionButton'))

if ( printSizeButtons.length === 0 ) { // determine whether the item is print or original
    isOriginal = true
} else { 
    isOriginal = false
}

if ( framingOptionButtons.length !== 0 ) { // determine whether the item has framing options or not
    hasFramingOption = true
} else {
    hasFramingOption = false
}

// find the price for the artworks based on if it is an original or print
price = [] 

if ( isOriginal ) {
    const originalPriceSpan = document.getElementById("originalPrice")
    price.push(Number.parseFloat(originalPriceSpan.dataset.price))
} else {
    printSizeButtons.forEach(button => {
        price.push(Number.parseFloat(button.dataset.price))
    })
}

// find the framing options for the piece if the piece has framing options and the price based off the print sizes
framingOptions = []
framingPrice = []

if ( hasFramingOption ) {
    framingOptionButtons.forEach(button => {
        framingOptions.push(button.dataset.framing) // if it has framing, find the different framing options
    })

    if ( isOriginal ) {
        const originalPriceSpan = document.getElementById("originalPrice")
        framingPrice.push(Number.parseFloat(originalPriceSpan.dataset.framingPrice)) // if original, there will only be one framing price because size does not change
    } else {
        printSizeButtons.forEach(button => {
            framingPrice.push(Number.parseFloat(button.dataset.framingPrice))
        })
    }
}

// set default framing option if the product has framing option to None and the framingPrice to 0
// set default price to A5 price if the piece is print, otherwise set it to original price which will not change

let selectedPrint = 0 // index that will be used to find the print print price and the frame price
let selectedFramingOption
let additionalFramingPrice = 0

if ( hasFramingOption ) {
    selectedFramingOption = 0

}

// add event listeners to the print size buttons so that when they are clicked it will change what the selected size is and
// the corresponding framing price

let index = 0
printSizeButtons.forEach(button => {
    const printSizeIndex = index
    index++

    button.addEventListener('click', function() {
        const selectedPrintSizeButton = document.querySelector('.selected-print')
        selectedPrintSizeButton.classList.remove('selected-print')
        this.classList.add('selected-print')

        if ( !isOriginal ) { // only change the framing price if its a print
            selectedPrint = printSizeIndex
        }

        if ( selectedFramingOption !== 0 ) {
            additionalFramingPrice = framingPrice[selectedPrint]
        }

        displayTotalPrice()
    })
})

// add event listeners to the framing options if there are framing options to change what the selected framing option is
// if the framing option is 'None' then the additionalFramingPrice should be set to 0

if ( hasFramingOption ) {
    let framingIndex = 0

    framingOptionButtons.forEach(button => {
        const thisFramingIndex = framingIndex
        framingIndex++

        button.addEventListener('click', function() {
            const selectedFramingOptionButton = document.querySelector('.selected-framing')
            selectedFramingOptionButton.classList.remove('selected-framing')
            this.classList.add('selected-framing')

            selectedFramingOption = thisFramingIndex

            if ( selectedFramingOption === 0 ) { // meaning that the user has chosen None
                additionalFramingPrice = 0
            }
            else {
                additionalFramingPrice = framingPrice[selectedPrint]
            }

            displayTotalPrice()
        })
    })
}

displayTotalPrice() // initialise what price is displayed on the screen

function displayTotalPrice () {
    let message
    if ( selectedFramingOption !== 0 && hasFramingOption ) {
        message = "Price: £" + (price[selectedPrint] + additionalFramingPrice) + " (+ £" + additionalFramingPrice + " for Framing)"
    } else {
        message = "Price: £" + price[selectedPrint]
    }

    const priceDisplay = document.getElementById('priceDisplay')
    priceDisplay.innerText = message
}