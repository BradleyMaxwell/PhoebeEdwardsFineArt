const galleryCarousels = Array.from(document.querySelectorAll('.gallery-carousel-container')); // find all the carousels on the page

galleryCarousels.forEach(gallery => { // add functionality to the previous and next buttons for each carousel
    const previousButton = gallery.querySelector('.previous-button')
    const nextButton = gallery.querySelector('.next-button')
    const carouselContent = gallery.querySelector('.gallery-carousel-content')
    const elements = Array.from(gallery.querySelectorAll('.gallery-carousel-element'));

    if (elements.length >= 3) {
        nextButton.style.display = 'block' // if there is 3 or less artworks in the gallery then the user cannot go to the next 3 artworks
    }

    let maxNextTurns = Math.ceil(elements.length / 3) - 1 // how many times the user can click next until they reach the end of the carousel
    let index = 0 // this tracks what part of the carousel the user is on
    let translateDistance = -87.5 // how far the content should move upon one button click

    previousButton.addEventListener('click', () => {
        index -= 1
        nextButton.style.display = 'block' // if the previous button is pressed it means they should be able to go next again

        if (index === 0 ) {
            previousButton.style.display = 'none' // hide the previous button if the user goes back to the start of the carousel
        }
        
        const newCarouselPosition = index * translateDistance
        carouselContent.style.transform = 'translateX(' + newCarouselPosition + 'vw)'
        carouselContent.style['-webkit-transform'] = 'translateX(' + newCarouselPosition + 'vw)'
    })

    nextButton.addEventListener('click', () => {
        index += 1
        previousButton.style.display = 'block'

        if (index === maxNextTurns ) {
            nextButton.style.display = 'none' // hide the previous button if the user goes back to the start of the carousel
        }
        
        const newCarouselPosition = index * translateDistance
        carouselContent.style.transform = 'translateX(' + newCarouselPosition + 'vw)'
    })

})