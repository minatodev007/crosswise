export default {
  getId: function (sourceId, date) {
    return sourceId + '-' +
      date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate()
  },
  parseId: function (id) {
    let tokens = id.split('-')
    return {
      sourceId: tokens[0],
      date: new Date(Number(tokens[1]), Number(tokens[2]) - 1, Number(tokens[3]))
    }
  },

  getBasePuzzleData: function (sourceId, date) {
    return {
      id: this.getId(sourceId, date),
      date: date
    }
  },

  makeWebRequest: function (url) {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.onload = function (e) {
        if (request.readyState === request.DONE) {
          if (request.status === 200) {
            resolve(request)
          } else {
            reject(request.status)
          }
        }
      }
      request.onerror = function (e) {
        reject(request.statusText)
      }
      request.send()
    })
  },

  getPuzzleXmlData: async function (id) {
    let url = `https://puzzles.crosswise.app/${id}`
    return (await this.makeWebRequest(url)).responseXML
  }
}
