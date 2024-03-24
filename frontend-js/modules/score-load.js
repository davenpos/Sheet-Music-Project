export default class ScoreLoad {
    constructor() {
        this.events()
    }

    events() {
        document.addEventListener("DOMContentLoaded", () => {
            let bars = document.querySelectorAll("div.bar")
            let lastBar = bars[bars.length - 1]
            let finalScoreNot = lastBar.children[lastBar.children.length - 1]
            finalScoreNot.insertAdjacentHTML("afterend", "<span class='notation barline-final'></span>")
        })
    }
}