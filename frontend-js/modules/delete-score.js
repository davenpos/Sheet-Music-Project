import 'long-press-event'
import axios from 'axios'

export default class DeleteScore {
    constructor() {
        this.scores = document.getElementById("userScores")
        this.deleteScoreTag = document.getElementById("deleteScore")
        this.events()
    }

    events() {
        if (this.scores) {
            this.scores.addEventListener('long-press', e => {
                e.preventDefault()
                let clickedScore = e.target.closest("a:not(:first-of-type)")
                if (clickedScore) {
                    this.deleteScore(clickedScore.getAttribute("href").substring(7))
                }
                return false
            })
        }

        if (this.deleteScoreTag) {
            this.deleteScoreTag.addEventListener("click", () => {
                this.deleteScore(window.location.pathname.substring(7))
            })
        }
    }

    deleteScore(scoreID) {
        let confirmed = confirm("Delete this score? This cannot be undone.")
        if (confirmed) {
            axios.post('/delete', {scoreID: scoreID}).then(() => {
                //
            }).catch(msg => {
                alert(msg)
            })
        }
    }
}