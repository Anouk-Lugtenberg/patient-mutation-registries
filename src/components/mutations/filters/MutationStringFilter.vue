<template>
  <div class="search-field ml-2 mr-2 mt-3">
    <div v-if="searchContainsInvalidCharacter" class="warning">
      invalid character
    </div>
    <input type="text" placeholder="Search mutations" v-model.lazy="search" v-model="searchString">
  </div>
</template>

<script>
import { SET_SEARCH_MUTATION } from '../../../store/modules/mutation/mutations'

export default {
  name: 'MutationStringFilter',
  data () {
    return {
      search: '',
      searchString: '',
      searchContainsInvalidCharacter: false
    }
  },
  watch: {
    searchString: function () {
      // Tests if string contains any invalid characters, to let user know if his search is a valid search.
      this.searchContainsInvalidCharacter = (/[#&^+[\]{}\\|]/).test(this.searchString)
    },
    search: function () {
      this.$store.commit('mutation/' + SET_SEARCH_MUTATION, this.search)
    },
    '$route.query.q' () {
      if (typeof this.$route.query.q === 'undefined') {
        this.search = ''
      }
    }
  },
  created () {
    if (this.$route.query.q) {
      if (this.$route.query.q.includes('*')) {
        this.search = this.$route.query.q.split('=').pop()
      }
    }
  }
}
</script>

<style scoped>
  input {
    width: 100%;
  }
  .search-field {
    text-align: center;
  }
  .warning {
    color: #dc3545;
    font-size: 14px;
  }
</style>
