<template>
  <tr><router-link :to="'/puzzle/' + puzzle.id"><td>{{ puzzle.title }}</td></router-link></tr>
</template>

<script>
export default {
  name: 'PuzzleListItem',
  props: {
    puzzle: Object
  }
}
</script>

<style scoped lang="scss">
</style>
