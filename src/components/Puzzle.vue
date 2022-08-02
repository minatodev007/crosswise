<template>
  <div class="puzzleWrapper" :style="wrapperStyleObject">
    <div class="puzzle" :style="styleObject">
      <PuzzleCell
        v-for="cell in puzzle.cells"
        :key="`${cell.x},${cell.y}`"
        :selectedClue="selectedClue"
        :cell="cell"
        :selectedCell="selectedCell"
        :charSet="puzzle.charSet"
        @cellFocused="onCellFocused"
        @arrowPressed="onArrowPressed"
        @spacePressed="onSpacePressed"></PuzzleCell>
    </div>
  </div>
</template>

<script>
import PuzzleCell from '@/components/PuzzleCell.vue'

export default {
  name: 'Puzzle',
  components: {
    PuzzleCell
  },
  props: {
    puzzle: Object
  },
  data: function () {
    return {
      selectedCell: {},
      cluesListIndex: 0
    }
  },
  computed: {
    wrapperStyleObject: function () {
      const width = 30
      const heightToWidthRatio = this.height / this.width
      return {
        width: `${width}%`,
        paddingBottom: `${width * heightToWidthRatio}%`
      }
    },
    styleObject: function () {
      return {
        gridTemplateColumns: `repeat(${this.width}, 1fr)`,
        gridTemplateRows: `repeat(${this.height}, 1fr)`
      }
    },
    width: function () {
      let xValues = this.puzzle.cells.map(cell => cell.x)
      let minX = Math.min.apply(null, xValues)
      let maxX = Math.max.apply(null, xValues)
      return maxX - minX + 1
    },
    height: function () {
      let yValues = this.puzzle.cells.map(cell => cell.y)
      let minY = Math.min.apply(null, yValues)
      let maxY = Math.max.apply(null, yValues)
      return maxY - minY + 1
    },
    firstCell: function () {
      // TODO: Come up with a better way of getting the first cell.
      return this.puzzle.cells[0]
    },
    availableCluesLists: function () {
      let cluesLists = []
      for (const cluesList of this.puzzle.cluesLists) {
        if (this.cluesListContainsCell(cluesList, this.selectedCell)) {
          cluesLists.push(cluesList)
        }
      }
      return cluesLists
    },
    selectedClue: function () {
      // TODO: Guarantee that the index will always be within the list.
      const cluesList = this.availableCluesLists[this.cluesListIndex]
      for (const clue of cluesList.clues) {
        for (const cell of clue.cells) {
          if ((cell.x === this.selectedCell.x) &&
              (cell.y === this.selectedCell.y)) {
            return clue
          }
        }
      }
      throw Error('unreachable')
    }
  },
  methods: {
    onCellFocused: function (cell) {
      this.selectedCell = cell
    },
    onArrowPressed: function (e) {
      let transform
      switch (e.key) {
        case 'ArrowUp':
          transform = cell => ({ x: cell.x, y: cell.y - 1 }); break
        case 'ArrowRight':
          transform = cell => ({ x: cell.x + 1, y: cell.y }); break
        case 'ArrowDown':
          transform = cell => ({ x: cell.x, y: cell.y + 1 }); break
        case 'ArrowLeft':
          transform = cell => ({ x: cell.x - 1, y: cell.y }); break
        default:
          throw Error(`Invalid key value: ${e.key}`)
      }

      let currCell = this.selectedCell
      while (currCell.x >= 0 && currCell.x < this.width && currCell.y >= 0 && currCell.y < this.height) {
        currCell = transform(currCell)

        if (this.puzzle.cells.find(cell => cell.x === currCell.x && cell.y === currCell.y && cell.isOpen)) {
          this.selectedCell = currCell
          return
        }
      }
    },
    onSpacePressed: function () {
      let newIndex = this.cluesListIndex + 1
      if (newIndex >= this.availableCluesLists.length) {
        newIndex = 0
      }
      this.cluesListIndex = newIndex
    },
    cluesListContainsCell: function (cluesList, cellToMatch) {
      for (const clue of cluesList.clues) {
        for (const cell of clue.cells) {
          if ((cell.x === cellToMatch.x) &&
              (cell.y === cellToMatch.y)) {
            return true
          }
        }
      }
      return false
    }
  },
  watch: {
    selectedCell: function (newVal) {
      if (this.cluesListIndex >= this.availableCluesLists.length) {
        this.cluesListIndex = 0
      }
    }
  },
  beforeMount: function () {
    this.selectedCell = this.firstCell
  }
}
</script>

<style scoped lang="scss">
// Wrapper div to force the puzzle into a square shape:
// https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css
.puzzleWrapper {
  position: relative;
}
.puzzle {
  display: grid;

  // Stretch the puzzle to fill the wrapper div.
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
}
</style>
