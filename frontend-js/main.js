import PlaceNotation from './modules/place-notation'
import SaveScore from './modules/save-score'
import NewMeasure from './modules/new-measure'
import ScoreLoad from './modules/score-load'
import FormErrorsRemove from './modules/form-errors-remove'
import NotationKeyStrokes from './modules/notation-keystrokes'
import DeleteScore from './modules/delete-score'

if (document.getElementById("actualScore")) {
    new ScoreLoad()
}

if (document.getElementById("notationSelection")) {
    let pn = new PlaceNotation()
    window.pn = pn
    new SaveScore()
    new NotationKeyStrokes()
}

if (document.getElementById("newBar")) {
    new NewMeasure()
}

if (document.querySelector("form:not([action='/logout'])")) {
    new FormErrorsRemove()
}

if (document.querySelector("#userScores, #deleteScore")) {
    new DeleteScore()
}