function lengthNum(className) {
    if (className.includes('whole')) {
        return 1
    } else if (className.includes('half')) {
        return 2
    } else if (className.includes('quarter')) {
        return 4
    } else if (className.includes('eighth') && !className.includes('onehundredtwentyeighth')) {
        return 8
    } else if (className.includes('sixteenth')) {
        return 16
    } else if (className.includes('thirtysecond')) {
        return 32
    } else if (className.includes('sixtyfourth')) {
        return 64
    } else if (className.includes('onehundredtwentyeighth')) {
        return 128
    }
}

export default lengthNum