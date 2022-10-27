/* Cards pulled from API, json data*/
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

let user
let users

//eventListener for filter 
//e value , whatever is typed
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase() //remove the case sensativity
    user.forEach(user => {
        const isVisible = 
        user.name.toLowerCase().includes(value) || 
        user.email.toLowerCase().includes(value) //match any letter in the data = show, if not = hide
        user.element.classList.toggle("hide", !isVisible)
    })
})

fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
        user = data.map(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0] //document fragment being returned
            const header = card.querySelector("[data-header]")
            const body = card.querySelector("[data-body]")
            header.textContent = user.name
            body.textContent = user.email
            userCardContainer.append(card)
            return { name: user.name, email: user.email, element: card } //data about user
        })
    })

