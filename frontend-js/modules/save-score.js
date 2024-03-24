import axios from 'axios'
import 'long-press-event'
import lengthNum from "../exports/length-num"

export default class SaveScore {
    constructor() {
        this.saveButton = document.getElementById("saveChanges")
        this.scoreTitle = document.querySelector("div#scoreHeadings h2")
        this.scoreSubtitle = document.querySelector("div#scoreHeadings h3")
        this.scoreString = ""
        this.events()
    }

    events() {
        this.saveButton.addEventListener("click", () => {
            this.scoreString = ""
            this.getScoreString()
            this.sendAxiosRequest("scorestring", this.scoreString)
        })

        this.scoreTitle.addEventListener("long-press", () => {
            let newTitle = prompt("Enter the new title for this score")
            this.sendAxiosRequest("title", newTitle)
            this.scoreTitle.innerHTML = newTitle
        })

        this.scoreSubtitle.addEventListener("long-press", () => {
            let newSubtitle = prompt("Enter the new subtitle for this score")
            this.sendAxiosRequest("subtitle", newSubtitle)
            this.scoreSubtitle.innerHTML = newSubtitle
        })
    }

    getScoreString() {
        let bpm = document.getElementById("songBPM").textContent.match(/\d+/)[0]
        let key = '0' //Account for other keys!
        let firstBarTimesig = document.querySelector("div.bar div.scoreNot div.timesig")
        let notesPerBar = firstBarTimesig.children[0].classList[1].match(/\d+/)[0]
        let notes = firstBarTimesig.children[1].classList[1].match(/\d+/)[0]
        let notationClasses = ""
        for (let i = 2; i <= 12; i++) {
            notationClasses += 'div.notes-' + i + ' span.notation:not(.barline), '
        }
        notationClasses = notationClasses.substring(0, notationClasses.length - 2)
        let notation = document.querySelectorAll(notationClasses)

        let trebleNotes = ""
        let bassNotes = ""
        for (let i = 0; i < notation.length; i++) {
            if (notation[i].classList.contains("bassNote") || (notation[i].classList.length >= 3 && parseInt(notation[i].classList[2].charAt(1)) <= 3)) {
                bassNotes += this.fillNotes(notation[i])
            } else {
                trebleNotes += this.fillNotes(notation[i])
            }
        }

        this.scoreString += "bpm" + bpm + ' ' + key + ' time' + notesPerBar + '/' + notes + ' treble(' + trebleNotes.trim() + ') bass(' + bassNotes.trim() + ')'
    }

    fillNotes(pos) {
        let clefString = ""
        clefString += lengthNum(pos.classList[1])
        
        if (pos.classList[1].includes('rest')) {
            clefString += "r"
        } else if (pos.classList[1].includes('note')) {
            clefString += pos.classList[2]
        }
        clefString += " "
        return clefString
    }

    sendAxiosRequest(column, value) {
        axios.post('/save', {
            column: column,
            value: value,
            scoreID: window.location.pathname.substring(7)
        }).then(response => {
            alert(response.data)
        }).catch(response => {
            alert(response.data)
        })
    }
}