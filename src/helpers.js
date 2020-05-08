function zeroPad(int) {
  return int > 9 ? int.toString() : '0' + int
}
export function getHumanTime(time, format = 'hms:a') {
  let hours, minutes, seconds
  if (time instanceof Date) {
    hours = time.getHours()
    minutes = zeroPad(time.getMinutes())
    seconds = zeroPad(time.getSeconds())
  } else {
    hours = Math.floor(time / 1000 / 60 / 60).toString()
    minutes = zeroPad(Math.floor((time / 1000 / 60) % 60))
    seconds = zeroPad(Math.floor((time / 1000) % 60))
  }
  let result = []
  //hours = 12

  if (format.includes('h')) result.push(hours)
  if (format.includes('m')) result.push(minutes)
  if (format.includes('s')) result.push(seconds)
  if (format.includes('a')) {
    let twelveHour = hours % 12
    result[result.indexOf(hours)] = twelveHour === 0 ? 12 : twelveHour
    for (let i = 0; i < result.length - 1; i++) {
      result[i] += ':'
    }
    hours < 13 ? result.push(' AM') : result.push(' PM')
  } else if (format.includes(':')) {
    for (let i = 0; i < result.length - 1; i++) {
      result[i] += ':'
    }
  } else {
    result[result.indexOf(hours)] += 'h'
    result[result.indexOf(minutes)] += 'm'
    result[result.indexOf(seconds)] += 's'
  }
  return result.join('')
}

export function millisecs(m) {
  return m * 60000
}
