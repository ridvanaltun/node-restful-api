module.exports = (seconds) => {
  const days = Math.round(seconds / 86400)
  seconds %= 86400
  const hours = Math.round(seconds / 3600)
  seconds %= 3600
  const minutes = Math.round(seconds / 60)
  seconds %= 60

  seconds = Math.round(seconds)

  let result = ''

  if (days > 0) result = days + ' days'

  if (hours > 0) {
    if (result !== '') result += ' '
    result += hours + ' hours'
  }

  if (minutes > 0) {
    if (result !== '') result += ' '
    result += minutes + ' minutes'
  }

  if (seconds > 0) {
    if (result !== '') result += ' '
    result += seconds + ' seconds'
  }

  return result
}
