export default class FormErrorsRemove {
    constructor() {
        this.errorFields = document.querySelectorAll("form input.error")
        this.events()
    }

    events() {
        this.errorFields.forEach(field => {
            if (field.getAttribute("id") == "key") {
                this.removeErrorOnListener(field, "change", true)
            } else {
                this.removeErrorOnListener(field, "keypress", true)
            }
        })

        let timeSig = document.getElementById("timesig")
        if (timeSig) {
            timeSig.querySelectorAll("input").forEach(input => {
                this.removeErrorOnListener(input, "change", false)
            })
        }

        let publicPrivate = document.getElementById("publicPrivate")
        if (publicPrivate) {
            publicPrivate.querySelectorAll("input").forEach(input => {
                this.removeErrorOnListener(input, "change", false)
            })
        }
    }

    removeErrorOnListener(element, event, errorInElement) {
        element.addEventListener(event, () => {
            if (errorInElement) {
                element.classList.remove("error")
                element.removeAttribute("placeholder")
            } else {
                let errorSpan = element.parentElement.querySelector("span")
                if (errorSpan) {
                    errorSpan.remove()
                }
            }
        })
    }
}