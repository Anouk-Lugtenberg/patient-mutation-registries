<template>
  <div>
    <div v-if="metadata[mutationTable]">
      <div v-if="$route.query.q">
        <mutation-card-paginator :mutationIdentifiers="filteredMutationIdentifiers"
                                 :visibleFields="getVisibleFieldsMetadata(mutationTable)"
                                 :filtered="true"></mutation-card-paginator>
      </div>
      <div v-else>
        <mutation-card-paginator :mutationIdentifiers="allIdentifiersMutation"
                                 :visibleFields="getVisibleFieldsMetadata(mutationTable)"></mutation-card-paginator>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MutationCardPaginator from './MutationCardsPaginator'
import GenomeBrowser from '../genomeBrowser/GenomeBrowser'

export default {
  name: 'MutationCardsContainer',
  components: {
    GenomeBrowser,
    'mutation-card-paginator': MutationCardPaginator
  },
  computed: {
    ...mapGetters({
      filteredMutationIdentifiers: 'mutation/getFilteredMutationIdentifiers',
      getVisibleFieldsMetadata: 'getVisibleFieldsMetadata'
    }),
    ...mapState({
      allIdentifiersMutation: state => state.mutation.allMutationIdentifiers,
      filteredMutationIdentifiers: state => state.mutation.filteredMutationIdentifiers,
      mutationTable: 'MUTATION_TABLE',
      metadata: 'metadata'
    })
  }
}
</script>
