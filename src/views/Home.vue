<template>
  <div class="home">
    <table>
      <PuzzleListItem v-for="puzzle in sortedPuzzles" :key="puzzle.id" :puzzle="puzzle"/>
    </table>
  </div>
</template>

<script>
import puzzleGetter from '@/puzzleGetters/puzzleGetter.js'
import PuzzleListItem from '@/components/PuzzleListItem.vue'

export default {
  name: 'home',
  components: {
    PuzzleListItem
  },
  data: function () {
    return {
      puzzles: []
    }
  },
  computed: {
    sortedPuzzles: function () {
      let newPuzzles = this.puzzles
      newPuzzles.sort(function (a, b) {
        if (a.date < b.date) {
          return 1
        } else if (a.date > b.date) {
          return -1
        } else {
          return 0
        }
      })
      return newPuzzles
    }
  },
  mounted: function () {
    let today = new Date()
    let twoWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14)
    for (let puzzlePromise of puzzleGetter.getPuzzlesInRange(twoWeeksAgo, today)) {
      let vm = this
      puzzlePromise.then(function (puzzle) {
        vm.puzzles.push(puzzle)
      })
    }
  }
}
</script>
