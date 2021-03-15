export function convertTimeToInteger(time) {
    let timeInteger = 0
    // Time is a string in format XX:XX
    if (time !== null && time !== undefined && time.includes(':') ) {
        const times = time.split(':');
        // Check that the first number is not equal to 0
        if (parseInt(times[0]) !== 0 ) { 
        timeInteger = parseInt(times[0]) * 60 + parseInt(times[1])
        } else {
        timeInteger = parseInt(times[1])
        } 
    }
    return timeInteger;
}

export function convertIntegerToTime(integerTime) {
    const minutes = Math.floor(integerTime / 60);
    const seconds = integerTime - minutes * 60;
    const result = minutes.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + seconds.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false })
    return result;
}