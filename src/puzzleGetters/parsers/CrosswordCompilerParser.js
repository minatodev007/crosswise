function wordToCellsList (word) {
  let cells = []
  let tokens
  let constant
  let rangeField
  let constantField
  if (word.x.includes('-')) {
    tokens = word.x.split('-')
    constant = Number(word.y)
    rangeField = 'x'
    constantField = 'y'
  } else if (word.y.includes('-')) {
    tokens = word.y.split('-')
    constant = Number(word.x)
    rangeField = 'y'
    constantField = 'x'
  } else {
    throw Error(`Invalid cell range. x: ${word.x}, y: ${word.y}`)
  }

  tokens[0] = Number(tokens[0])
  tokens[1] = Number(tokens[1])
  for (let i = tokens[0]; i <= tokens[1]; ++i) {
    cells.push({ [rangeField]: i - 1, [constantField]: constant - 1 })
  }

  return cells
}

function parseMetaData (metadata) {
  return {
    title: metadata.getElementsByTagName('title')[0].textContent,
    creator: metadata.getElementsByTagName('creator')[0].textContent,
    copyright: metadata.getElementsByTagName('copyright')[0].textContent,
    description: metadata.getElementsByTagName('description')[0].textContent
  }
}

function parseCharSet (rectPuzzle) {
  return {
    charSet: rectPuzzle.getAttribute('alphabet').split('')
  }
}

function parseCrossword (crossword) {
  let gridElement = crossword.getElementsByTagName('grid')[0]

  let cells = []
  let numberToCellMapping = {}
  for (let cellElement of gridElement.getElementsByTagName('cell')) {
    let cell = {}
    cell.x = Number(cellElement.getAttribute('x')) - 1
    cell.y = Number(cellElement.getAttribute('y')) - 1
    cell.isOpen = false
    if (cellElement.getAttribute('type') !== 'block') {
      cell.solution = cellElement.getAttribute('solution')
      cell.isCircled = (cellElement.getAttribute('background-shape') === 'circle')
      cell.isOpen = true
      numberToCellMapping[cellElement.getAttribute('number')] = { x: cell.x, y: cell.y }
    }
    cells.push(cell)
  }

  // Create mapping of word ID to cell range.
  let words = {}
  for (let word of crossword.getElementsByTagName('word')) {
    words[word.getAttribute('id')] = { x: word.getAttribute('x'), y: word.getAttribute('y') }
  }

  let cluesLists = []
  let currentId = 0
  for (let cluesListElement of crossword.getElementsByTagName('clues')) {
    let cluesList = {}
    cluesList.id = currentId
    ++currentId
    cluesList.title = cluesListElement.getElementsByTagName('title')[0].textContent
    cluesList.clues = []
    for (let clueElement of cluesListElement.getElementsByTagName('clue')) {
      let clue = {}
      clue.number = Number(clueElement.getAttribute('number'))
      clue.text = clueElement.textContent
      clue.cellX = numberToCellMapping[clue.number].x
      clue.cellY = numberToCellMapping[clue.number].y
      clue.cells = wordToCellsList(words[clueElement.getAttribute('word')])

      cluesList.clues.push(clue)
    }
    cluesLists.push(cluesList)
  }

  return {
    cells: cells,
    cluesLists: cluesLists
  }
}

export default {
  parse: function (xml) {
    let root = xml.getElementsByTagName('crossword-compiler')[0]
    let rectPuzzle = root.getElementsByTagName('rectangular-puzzle')[0]
    let metadata = rectPuzzle.getElementsByTagName('metadata')[0]
    let crossword = rectPuzzle.getElementsByTagName('crossword')[0]

    return {
      ...parseMetaData(metadata),
      ...parseCharSet(rectPuzzle),
      ...parseCrossword(crossword)
    }
  }
}
