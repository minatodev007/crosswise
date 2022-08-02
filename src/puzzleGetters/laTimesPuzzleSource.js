import common from './common.js'
import crosswordCompilerParser from './parsers/CrosswordCompilerParser.js'

export default {
  sourceId: 'lat',
  getPuzzle: async function (date) {
    let xml = await common.getPuzzleXmlData(common.getId(this.sourceId, date))

    return {
      ...common.getBasePuzzleData(this.sourceId, date),
      ...crosswordCompilerParser.parse(xml)
    }
  }
}
