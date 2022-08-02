<template>
  <div v-if="puzzleLoaded" class="puzzlePage">
    <h1>{{ puzzle.title }}</h1>
    <Puzzle :puzzle="puzzle"></Puzzle>
    <div v-for="cluesList in puzzle.cluesLists" :key="cluesList.id">
      <h2>{{ cluesList.title }}</h2>
      <ol>
        <li v-for="clue in cluesList.clues" :key="clue.number" :value="clue.number">{{ clue.text }}</li>
      </ol>
    </div>
  </div>
</template>

<script>
import puzzleGetter from '@/puzzleGetters/puzzleGetter.js'
import Puzzle from '@/components/Puzzle.vue'

export default {
  name: 'PuzzlePage',
  components: {
    Puzzle
  },
  data: function () {
    return {
      puzzle: {}
    }
  },
  props: {
    puzzleId: String
  },
  computed: {
    puzzleLoaded: function () {
      return !!this.puzzle.id
    }
  },
  mounted: async function () {
    this.puzzle = await puzzleGetter.getPuzzleById(this.puzzleId)
  }
}
</script>
