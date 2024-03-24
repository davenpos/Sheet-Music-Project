import lengthNum from "../exports/length-num"
import lengthName from "../exports/length-name"

export default class PlaceNotation {
    constructor() {
        this.actualScore = document.getElementById("actualScore")
        this.notationSelectionNotes = document.querySelectorAll("div#notationSelection span.notation")
        this.events()
    }

    events() {
        this.actualScore.addEventListener("click", e => {
            let clickedNote = e.target.closest("span.notation")
            if (e.target.classList.contains("notation") && e.target.parentElement.classList[0] == "noteWrapper") {
                if (this.actualScore.dataset.userid) {
                    this.noteClick(clickedNote)
                }
            }
        })

        this.notationSelectionNotes.forEach(note => {
            note.addEventListener("click", e => {
                let selectedNote = e.target.closest("span.notation")

                if (selectedNote.classList.contains("selected")) {
                    selectedNote.classList.remove("selected")
                    this.selectedNotationNote = null
                } else {
                    this.selectNote(e.target.closest("span.notation"))
                }
            })
        })
    }

    noteWrapperEnter() {
        let thisNote = event.target.children[0]
        this.getSelectedNotes()
        if (this.selectedNotationNote && event.target == this.selectedScoreNote.parentElement) {
            this.originalClasses = Array.from(this.selectedScoreNote.classList)
            this.removeMostClasses(thisNote)
        }
    }

    noteWrapperMove() {
        let wrapper = event.target.closest("div.noteWrapper")
        let thisNote = wrapper.children[0]
        this.getSelectedNotes()

        if (this.selectedNotationNote && wrapper == this.selectedScoreNote.parentElement) {
            let offsetY = event.clientY - wrapper.getBoundingClientRect().top

            if (lengthNum(this.selectedNotationNote.classList[1].split("-")[0]) >= 4) {
                thisNote.classList.add("notehead-black")
            } else {
                thisNote.classList.add("notehead-half")
            }

            if (thisNote.classList.length > 4) {
                thisNote.classList.remove(thisNote.classList.item(3))
            }

            let bassNoteClasses = ['d2', 'e2', 'f2', 'g2', 'a2', 'b2', 'c3', 'd3', 'e3', 'f3', 'a3', 'b3', 'bassNote']
            if (this.originalClasses.some(item => bassNoteClasses.includes(item))) {
                if (offsetY < 9.7) {
                    thisNote.classList.add("c4")
                    thisNote.classList.add("bassNote")
                } else {
                    thisNote.classList.remove("bassNote")
                    if (offsetY < 19.3) {
                        thisNote.classList.add("b3")
                    } else if (offsetY < 28.9) {
                        thisNote.classList.add("a3")
                    } else if (offsetY < 38.5) {
                        thisNote.classList.add("g3")
                    } else if (offsetY < 48.1) {
                        thisNote.classList.add("f3")
                    } else if (offsetY < 57.7) {
                        thisNote.classList.add("e3")
                    } else if (offsetY < 67.3) {
                        thisNote.classList.add("d3")
                    } else if (offsetY < 76.9) {
                        thisNote.classList.add("c3")
                    } else if (offsetY < 86.5) {
                        thisNote.classList.add("b2")
                    } else if (offsetY < 96.1) {
                        thisNote.classList.add("a2")
                    } else if (offsetY < 105.7) {
                        thisNote.classList.add("g2")
                    } else if (offsetY < 115.2) {
                        thisNote.classList.add("f2")
                    } else if (offsetY < 124.8) {
                        thisNote.classList.add("e2")
                    } else if (offsetY < 134.4 && offsetY > 144) {
                        thisNote.classList.add("d2")
                    }
                }
            } else {
                if (offsetY < 13.8) {
                    thisNote.classList.add("a5")
                } else if (offsetY < 23.4) {
                    thisNote.classList.add("g5")
                } else if (offsetY < 33) {
                    thisNote.classList.add("f5")
                } else if (offsetY < 42.6) {
                    thisNote.classList.add("e5")
                } else if (offsetY < 52.2) {
                    thisNote.classList.add("d5")
                } else if (offsetY < 61.8) {
                    thisNote.classList.add("c5")
                } else if (offsetY < 71.4) {
                    thisNote.classList.add("b4")
                } else if (offsetY < 81) {
                    thisNote.classList.add("a4")
                } else if (offsetY < 90.6) {
                    thisNote.classList.add("g4")
                } else if (offsetY < 100.2) {
                    thisNote.classList.add("f4")
                } else if (offsetY < 109.8) {
                    thisNote.classList.add("e4")
                } else if (offsetY < 119.4) {
                    thisNote.classList.add("d4")
                } else if (offsetY < 129) {
                    thisNote.classList.add("c4")
                }
            }
        }
    }

    noteWrapperLeave() {
        let wrapper = event.target.closest("div.noteWrapper")
        let thisNote = wrapper.children[0]
        this.getSelectedNotes()

        if (this.selectedNotationNote && wrapper == this.selectedScoreNote.parentElement) {
            this.removeMostClasses(thisNote)

            for (let i = 0; i < this.originalClasses.length; i++) {
                this.selectedScoreNote.classList.add(this.originalClasses[i])
            }

            for (let i = 0; i < this.selectedScoreNote.classList.length; i++) {
                let className = this.selectedScoreNote.classList[i]
                if (!this.originalClasses.includes(className)) {
                    this.selectedScoreNote.classList.remove(className)
                }
            }
            this.readdClass(thisNote, "selected")
        }
    }

    noteClick(clickedNote) {
        this.notationSelectionNotes.forEach(note => {
            note.classList.add("unclickable")
            note.classList.remove("selected")
        })
        let notePlaced = false

        let noteClasses = clickedNote.classList
        if (noteClasses.contains("selected")) {
            if (noteClasses.contains("notehead-black") || noteClasses.contains("notehead-half")) {
                if (noteClasses.length == 5 && !noteClasses.contains("bassNote")) {
                    noteClasses.remove(noteClasses.item(noteClasses.length - 2))
                }

                let classesToRestore = []
                for (let i = 3; i < noteClasses.length; i++) {
                    classesToRestore.push(noteClasses.item(i))
                }
                noteClasses.remove(noteClasses.item(2))

                let placedNoteLength = this.selectedNotationNote.classList[1].split("-")[0]

                let notePlacement = noteClasses.item(2)
                if (notePlacement == 'bassNote') {
                    notePlacement = noteClasses.item(3)
                }

                if (this.selectedNotationNote.classList[1] == 'whole-note') {
                    noteClasses.add(placedNoteLength + "-note")
                } else {
                    let upOrDown = 'up'
                    if (notePlacement.charAt(1) == '5' || notePlacement == 'b4' || (notePlacement == 'c4' && noteClasses.contains("bassNote")) || (notePlacement.charAt(1) == '3') && notePlacement.charAt(0) != 'c') {
                        upOrDown = 'down'
                    }
                    noteClasses.add(placedNoteLength + "-note-" + upOrDown)
                }
                this.readdClass(clickedNote, notePlacement)
                noteClasses.remove("bassNote")
                for (let i = 0; i < classesToRestore.length; i++) {
                    noteClasses.add(classesToRestore[i])
                }
            }
            noteClasses.remove("selected")
            notePlaced = true
        }

        if (!notePlaced) {
            let scoreNotes = document.querySelectorAll("div.noteWrapper span.notation")
            scoreNotes.forEach(note => {
                note.classList.remove("selected")
            })

            noteClasses.add("selected")
            this.removeSelection()
            
            let length = lengthNum(noteClasses[1])
            let notesHolder = clickedNote.parentNode.parentNode.parentNode
            let currClefNotes = (noteClasses.contains("bassNote")) ? notesHolder.querySelectorAll("span.notation.bassNote") : notesHolder.querySelectorAll("span.notation:not(.bassNote, .barline)")
            let barPercentage = 0

            for (let i = 0; i < currClefNotes.length; i++) {
                let reverseBarNotes = Array.from(currClefNotes).reverse()
                let currLength = lengthNum(reverseBarNotes[i].classList[1].split("-")[0])
                barPercentage += 1 / currLength
                if (clickedNote == reverseBarNotes[i]) {
                    break
                }
            }

            let beatParent = clickedNote.parentNode.parentNode
            let beatNum

            for (let i = 0; i < beatParent.children.length; i++) {
                if (beatParent.children[i] == clickedNote.parentNode) {
                    beatNum = i + 1
                    break
                }
            }

            this.notationSelectionNotes.forEach(note => {
                let selectNoteLength = lengthNum(note.classList[1])
                if (selectNoteLength >= length || (barPercentage >= 1 / selectNoteLength && beatNum == 1)) {
                    note.classList.remove("unclickable")
                }
            })
        }
    }

    selectNote(clickedNote) {
        if (!clickedNote.classList.contains("unclickable")) {
            this.removeSelection()
            clickedNote.classList.add("selected")

            this.getSelectedNotes()
            let scoreNoteClasses = this.selectedScoreNote.classList
            let notationNoteLength = this.selectedNotationNote.classList[1].split("-")[0]
            let scoreNoteLength = scoreNoteClasses[1].split("-")[0]
            let notationNoteLengthNum = lengthNum(notationNoteLength)
            let scoreNoteLengthNum = lengthNum(scoreNoteLength)
            let originalScoreNoteLength = scoreNoteLengthNum

            let noteBeat = this.selectedScoreNote.parentElement.parentElement
            let currNoteBeat = parseInt(noteBeat.classList[0].split("-")[1])
            let beatsLength = parseInt(document.querySelector("div.timesig span.notation:nth-of-type(2)").classList[1].split("-")[1])

            if (notationNoteLengthNum < scoreNoteLengthNum) {
                let numOfBeats = beatsLength / notationNoteLengthNum

                if (noteBeat.classList.length > 1) {
                    noteBeat.classList.remove(noteBeat.classList.item(1))
                    noteBeat.children[0].classList.remove(noteBeat.children[0].classList.item(1))

                    for (let i = noteBeat.children.length - 1; i > 0; i--) {
                        noteBeat.children[i].remove()
                    }
                }

                let nextBeats = currNoteBeat
                while (nextBeats < numOfBeats) {
                    let nextSibling = noteBeat.nextElementSibling
                    nextBeats += parseInt(nextSibling.classList[0].split("-")[1])
                    nextSibling.remove()
                }

                let beatClass = noteBeat.classList[0]
                noteBeat.classList.remove(beatClass)
                noteBeat.classList.add("beat-" + numOfBeats)
                
                let noteClassLength = scoreNoteClasses[1]
                scoreNoteClasses.remove(noteClassLength)
                noteClassLength = noteClassLength.split("-")
                let newClassName = lengthName(notationNoteLengthNum)
                for (let i = 1; i < noteClassLength.length; i++) {
                    if (lengthName(notationNoteLengthNum) != 'whole' || !(noteClassLength[i] == 'up' || noteClassLength[i] == 'down')) {
                        newClassName += "-" + noteClassLength[i]
                    }
                }
                scoreNoteClasses.add(newClassName)
                if (noteClassLength[1] == 'note') {
                    this.readdClass(this.selectedScoreNote, scoreNoteClasses.item(1))
                }
                if (scoreNoteClasses.contains("bassNote")) {
                    this.readdClass(this.selectedScoreNote, "bassNote")
                }
                this.readdClass(this.selectedScoreNote, "selected")
            } else if (notationNoteLengthNum > scoreNoteLengthNum) {
                let divideBeat = false
                let shrinking

                let restOrNote = scoreNoteClasses[1].match(/-.*/)[0]
                
                let scoreNoteClassesString = ""
                for (let i = 2; i < scoreNoteClasses.length; i++) {
                    scoreNoteClassesString += scoreNoteClasses[i] + " "
                }
                scoreNoteClassesString.trim()
                if (currNoteBeat > 1) {
                    let newBeat = currNoteBeat / notationNoteLengthNum
                    let noteLength = notationNoteLengthNum
                    if (newBeat < 1) {
                        newBeat = 1
                        if (notationNoteLengthNum != beatsLength) {
                            scoreNoteLengthNum = beatsLength
                            noteLength = beatsLength
                            divideBeat = true
                        }
                    }
                    noteBeat.classList.remove("beat-" + currNoteBeat)
                    noteBeat.classList.add("beat-" + newBeat)
                    noteBeat.innerHTML = `
                    <div class="noteWrapper" onmouseenter="window.pn.noteWrapperEnter()" onmousemove="window.pn.noteWrapperMove()" onmouseleave="window.pn.noteWrapperLeave()">
                        <span class="notation ${lengthName(noteLength)}${restOrNote} ${scoreNoteClassesString}"></span>
                    </div>
                    `

                    let adjacentBeats = `
                    <div class="beat-${newBeat}">
                        <div class="noteWrapper" onmouseenter="window.pn.noteWrapperEnter()" onmousemove="window.pn.noteWrapperMove()" onmouseleave="window.pn.noteWrapperLeave()">
                            <span class="notation ${lengthName(noteLength)}-rest ${(scoreNoteClasses.contains("bassNote")) ? "bassNote" : ""}"></span>
                        </div>
                    </div>
                    `

                    //Possibly not hardcoded to 4 and 2.
                    if (notationNoteLengthNum != 4 && originalScoreNoteLength != 2) {
                        let shrinking = noteLength / 2
                        let growing = newBeat * 2
                        for (let i = 1; shrinking > 1; i++) {
                            adjacentBeats += `
                            <div class="beat-${shrinking}">
                                <div class="noteWrapper" onmouseenter="window.pn.noteWrapperEnter()" onmousemove="window.pn.noteWrapperMove()" onmouseleave="window.pn.noteWrapperLeave()">
                                    <span class="notation ${lengthName(growing)}-rest ${(scoreNoteClasses.contains("bassNote")) ? "bassNote" : ""}"></span>
                                </div>
                            </div>
                            `

                            shrinking /= 2
                            growing *= 2
                        }
                    }

                    noteBeat.insertAdjacentHTML("afterend", adjacentBeats)
                } else {
                    divideBeat = true
                }

                if (divideBeat) {
                    let baseBeat = (scoreNoteLengthNum > beatsLength) ? beatsLength : scoreNoteLengthNum
                    let division = notationNoteLengthNum / baseBeat
                    let newLength = baseBeat * division
                    let newLengthName = lengthName(newLength)
                    //console.log(originalScoreNoteLength)
                    if (noteBeat.classList.length == 2) {
                        noteBeat.classList.remove(noteBeat.classList.item(1))
                    }
                    noteBeat.classList.add("divide-" + division)

                    let childNum = 0
                    if (scoreNoteLengthNum > beatsLength) {
                        for (let i = 0; i < noteBeat.children.length; i++) {
                            if (noteBeat.children[i].children[0] == this.selectedScoreNote) {
                                noteBeat.children[i].remove()
                                childNum = i
                                if (childNum > 0) {
                                    baseBeat = scoreNoteLengthNum
                                }
                                break
                            }
                        }
                    }

                    let newBeatHTML = `
                    <div class="noteWrapper" onmouseenter="window.pn.noteWrapperEnter()" onmousemove="window.pn.noteWrapperMove()" onmouseleave="window.pn.noteWrapperLeave()">
                        <span class="notation ${newLengthName}${restOrNote} ${scoreNoteClassesString}"></span>
                    </div>
                    `
                    
                    shrinking = newLength
                    for (let i = 1; shrinking > baseBeat; i++) {
                        newBeatHTML += `
                        <div class="noteWrapper" onmouseenter="window.pn.noteWrapperEnter()" onmousemove="window.pn.noteWrapperMove()" onmouseleave="window.pn.noteWrapperLeave()">
                            <span class="notation ${lengthName(shrinking)}-rest ${(scoreNoteClasses.contains("bassNote")) ? "bassNote" : ""}"></span>
                        </div>
                        `
                        shrinking /= 2
                    }

                    if (childNum == 0) {
                        noteBeat.innerHTML = newBeatHTML
                    } else {
                        noteBeat.innerHTML += newBeatHTML
                    }
                }
            }
        }
    }

    removeSelection() {
        this.notationSelectionNotes.forEach(note => {
            note.classList.remove("selected")
        })
    }

    getSelectedNotes() {
        this.selectedNotationNote = document.querySelector("div#notationSelection span.notation.selected")
        this.selectedScoreNote = document.querySelector("div.noteWrapper span.notation.selected")
    }

    removeMostClasses(note) {
        for (let i = note.classList.length - 2; i > 0; i--) {
            note.classList.remove(note.classList.item(i))
        }
    }

    readdClass(element, className) {
        element.classList.remove(className)
        element.classList.add(className)
    }
}