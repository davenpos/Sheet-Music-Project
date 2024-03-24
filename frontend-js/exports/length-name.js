function lengthName(num) {
    if (num == 1) {
        return 'whole'
    } else if (num == 2) {
        return 'half'
    } else if (num == 4) {
        return 'quarter'
    } else if (num == 8) {
        return 'eighth'
    } else if (num == 16) {
        return 'sixteenth'
    } else if (num == 32) {
        return 'thirtysecond'
    } else if (num == 64) {
        return 'sixtyfourth'
    } else {
        return 'onehundredtwentyeighth'
    }
}

export default lengthName