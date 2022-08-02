<template>
  <div class="puzzleCell" :style="styleObject">
    <input
      v-if="cell.isOpen"
      type="text"
      ref="input"
      class="cellWrapped openCell"
      :class="classObject"
      :tabindex="tabIndex"
      @input="handleInput"
      @keydown.arrow-up.arrow-right.arrow-down.arrow-left="$emit('arrowPressed', $event)"
      @keydown.space="$emit('spacePressed')"
      @focus="$emit('cellFocused', cell)">

    <div v-else class="cellWrapped closedCell"></div>
  </div>
</template>

<script>
export default {
  name: 'PuzzleCell',
  props: {
    cell: Object,
    selectedCell: Object,
    selectedClue: Object,
    charSet: Array
  },
  data: function () {
    return {
      oldValue: ''
    }
  },
  computed: {
    classObject: function () {
      return {
        selected: this.selected,
        inSelectedClue: this.inSelectedClue
      }
    },
    styleObject: function () {
      return {
        gridColumn: `${this.cell.x + 1} / ${this.cell.x + 2}`,
        gridRow: `${this.cell.y + 1} / ${this.cell.y + 2}`
      }
    },
    selected: function () {
      return (this.cell.x === this.selectedCell.x) &&
             (this.cell.y === this.selectedCell.y)
    },
    inSelectedClue: function () {
      for (const cell of this.selectedClue.cells) {
        if ((cell.x === this.cell.x) &&
            (cell.y === this.cell.y)) {
          return true
        }
      }
      return false
    },
    tabIndex: function () {
      return this.selected ? 0 : -1
    }
  },
  methods: {
    handleInput: function () {
      const newChar = this.$refs.input.value[this.$refs.input.selectionStart - 1]

      for (const char of [newChar, newChar.toUpperCase(), newChar.toLowerCase()]) {
        if (this.charSet.includes(char)) {
          this.$refs.input.value = char
          this.oldValue = char
          return
        }
      }

      this.$refs.input.value = this.oldValue
    }
  },
  watch: {
    selected: function (newVal) {
      if (newVal) {
        this.$refs.input.focus()
      }
    }
  },
  mounted: function () {
    if (this.selected) {
      this.$refs.input.focus()
    }
  }
}
</script>

<style scoped lang="scss">
.puzzleCell {
  $min-size: 20px;
  min-width: $min-size;
  min-height: $min-size;
}
.cellWrapped {
  width: 100%;
  height: 100%;
}
.openCell {
  // Vertically align the cell content.
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  box-sizing: border-box;
  border: 1px black solid;

  caret-color: transparent;

  &.inSelectedClue {
    background: orange;

    &.selected {
      background: red;
    }
  }
}
.closedCell {
  background-color: black;
}
</style>
