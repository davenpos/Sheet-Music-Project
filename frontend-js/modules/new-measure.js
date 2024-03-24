import lengthName from "../exports/length-name"

export default class NewMeasure {
    constructor() {
        this.newBar = document.getElementById("newBar")
        this.events()
    }

    events() {
        this.newBar.addEventListener("click", () => {
            let allBars = document.querySelectorAll("div.bar")
            let finalBarline = document.querySelector("span.notation.barline-final")
            finalBarline.remove()
            let notesPerBar = document.querySelector("div.timesig span:nth-of-type(1)").classList[1].split("-")[1]
            let noteBeatLength = document.querySelector("div.timesig span:nth-of-type(2)").classList[1].split("-")[1]
            let trebleNotes = this.createNewNotes(notesPerBar, noteBeatLength, false)
            let bassNotes = this.createNewNotes(notesPerBar, noteBeatLength, true)

            let numOfBars = allBars.length + 1

            if (numOfBars % 4 == 0) {
                let previousBar = allBars[numOfBars - 2]
                previousBar.insertAdjacentHTML("beforeend", `
                    <span class="notation barline lastOfLine"></span>
                `)
            }

            this.newBar.insertAdjacentHTML("beforebegin", `
                <div class="bar${(numOfBars % 4 == 0) ? ' keyShow' : ''}">
                    <span class="notation barline"></span>
                    <span class="notation staff"></span>
                    <span class="notation staff"></span>
                    <div class="scoreNot">
                        ${(numOfBars % 4 == 0) ? `
                        <div class="clefs">
                            <span class="notation treble"></span>
                            <span class="notation bass"></span>
                        </div>
                        <div class="key">
                        </div>
                        ` : ''}
                        <div class="notes-${notesPerBar}">
                            ${trebleNotes}
                            ${bassNotes}
                        </div>
                    </div>
                    ${finalBarline.outerHTML}
                </div>
            `)
        })
    }

    createNewNotes(npb, nbl, areBassNotes) {
        let newNotes = ""
        for (let i = 1; i <= npb; i++) {
            newNotes += `
                <div class="beat-1">
                    <div class="noteWrapper" onmouseenter="window.pn.noteWrapperEnter()" onmousemove="window.pn.noteWrapperMove()" onmouseleave="window.pn.noteWrapperLeave()">
                        <span class="notation ${lengthName(nbl)}-rest${(areBassNotes) ? ' bassNote' : ''}"></span>
                    </div>
                </div>
            `
        }
        return newNotes
    }
}