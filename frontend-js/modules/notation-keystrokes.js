export default class NotationKeyStrokes {
    constructor() {
        this.events()
    }

    events() {
        document.addEventListener("keyup", e => {
            let selectedNote = document.querySelector("span.notation.selected")
            if (selectedNote) {
                let key = e.key
                this.noteClasses = selectedNote.classList
                this.noteLengthClass = this.noteClasses[1]
                this.isBassNote = this.noteClasses.contains("bassNote") ? true : false
                this.noteLength = this.noteLengthClass.split("-")[0]

                if (this.noteLengthClass.includes("note")) {
                    if (key == 'Delete') {
                        for (let i = this.noteClasses.length - 1; i >= 2; i--) {
                            this.noteClasses.remove(this.noteClasses.item(i))
                        }
                        this.noteClasses.remove(this.noteLengthClass)
                        this.noteClasses.add(this.noteLength + "-rest")
                        this.restoreLastClasses()
                    }

                    if (key == 'ArrowUp') {
                        this.noteMove(1)
                    }

                    if (key == 'ArrowDown') {
                        this.noteMove(-1)
                    }
                }

                if (e.altKey) {
                    let notesQuery = "div.scoreNot div:not(.clefs, .key, .timesig) span.notation"
                    if (this.isBassNote) {
                        notesQuery += ".bassNote:not(.barline)"
                    } else {
                        notesQuery += ":not(.bassNote, .barline)"
                    }
                    this.scoreNotes = Array.from(document.querySelectorAll(notesQuery))
                    let currentNoteIndex = this.scoreNotes.indexOf(selectedNote)

                    if (key == 'ArrowRight') {
                        this.getAdjacentNote(currentNoteIndex, 1)
                    }

                    if (key == 'ArrowLeft') {
                        this.getAdjacentNote(currentNoteIndex, -1)
                    }
                }
            }
        })

        document.addEventListener("keydown", e => {
            if (e.key.includes("Arrow")) {
                e.preventDefault()
            }
        })
    }

    restoreLastClasses() {
        if (this.isBassNote) {
            this.noteClasses.add("bassNote")
        }
        this.noteClasses.add("selected")
    }

    noteMove(upOrDown) {
        let currentNote = this.noteClasses[2]
        if ((currentNote != 'c4' || this.isBassNote || upOrDown != -1) && (currentNote != 'c4' || !this.isBassNote || upOrDown != 1) && (currentNote != 'a5' || this.isBassNote || upOrDown != 1) && (currentNote != 'd2' || !this.isBassNote || upOrDown != -1)) {
            for (let i = this.noteClasses.length - 1; i >= 3; i--) {
                this.noteClasses.remove(this.noteClasses.item(i))
            }
            this.noteClasses.remove(currentNote)

            let noteLetter = currentNote.charAt(0)
            let octave = parseInt(currentNote.charAt(1))
            let newNoteLetterASCII = noteLetter.charCodeAt(0) + upOrDown
            if (newNoteLetterASCII < 97 || newNoteLetterASCII > 103) {
                newNoteLetterASCII += upOrDown * -7
            }
            let newNoteLetter = String.fromCharCode(newNoteLetterASCII)

            if ((noteLetter == 'b' && upOrDown == 1) || (noteLetter == 'c' && upOrDown == -1)) {
                octave += upOrDown
            }

            if ((currentNote == 'a4' || currentNote == 'c3') && upOrDown == 1) {
                this.noteClasses.remove(this.noteLengthClass)
                this.noteClasses.add(this.noteLength + "-note-down")
            }
            if ((currentNote == 'b4' || currentNote == 'd3') && upOrDown == -1) {
                this.noteClasses.remove(this.noteLengthClass)
                this.noteClasses.add(this.noteLength + "-note-up")
            }

            let newNote = newNoteLetter + octave
            this.noteClasses.add(newNote)
            this.restoreLastClasses()
        }
    }

    getAdjacentNote(index, move) {
        let adjacentNoteIndex = index + move
        if (adjacentNoteIndex < this.scoreNotes.length && adjacentNoteIndex >= 0) {
            this.scoreNotes[index].classList.remove("selected")
            this.scoreNotes[adjacentNoteIndex].classList.add("selected")
        }
    }
}