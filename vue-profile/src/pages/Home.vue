<template>
  <div class="home">
    <ttl></ttl>
    <router-view/>
  </div>
</template>

<script>
import ttl from '../components/input'

export default {
  name: 'home',
  data () {
    return {
    }
  },
  components: {
    ttl
  }
}
</script>

<style scoped>
</style>
