const menuLinks = document.querySelector('#menu-links')
const navToggle = document.querySelector('.mobile-nav-toggle')

navToggle.addEventListener('click', () => {
    if (menuLinks.dataset.visible === "false") {
        menuLinks.dataset.visible = "true"
        navToggle.setAttribute('aria-expanded', true)
    } else {
        menuLinks.dataset.visible = "false"
        navToggle.setAttribute('aria-expanded', false)
    }
})