import common from './common'

import laTimesPuzzleSource from './laTimesPuzzleSource.js'

const PUZZLE_SOURCES = {
  [laTimesPuzzleSource.sourceId]: laTimesPuzzleSource
}

export default {
  getPuzzlesInRange: function * (from, to) {
    let date = from
    while (date <= to) {
      for (let source in PUZZLE_SOURCES) {
        yield PUZZLE_SOURCES[source].getPuzzle(date)
      }

      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }
  },

  getPuzzleById: function (id) {
    let parsed = common.parseId(id)
    return PUZZLE_SOURCES[parsed.sourceId].getPuzzle(parsed.date)
  }
}
