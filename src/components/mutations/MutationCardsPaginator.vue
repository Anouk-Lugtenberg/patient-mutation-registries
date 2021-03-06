<template>
  <div>
    <b-row class="top-row-container">
      <b-col cols="12">
        <genome-browser></genome-browser>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="3">
        <b-card no-body class="p-2 mutations-per-page mb-2">
          Mutations per page
          <b-form-select v-model="pageSize" :options="optionsPageSize" size="sm" :plain="true"></b-form-select>
        </b-card>
      </b-col>
      <b-col sm="9">
        <b-pagination-nav v-if="totalPages > 0" :use-router="true" size="md" :link-gen="linkGenerator" align="center"
                          :number-of-pages="totalPages" v-model="currentPage">
        </b-pagination-nav>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3">
        <div v-if="filteredGroupInformation.hasOwnProperty(mutationTable)">
          <div v-if="Object.keys(filteredGroupInformation[mutationTable]).length === visibleFilters[mutationTable].length">
            <mutation-filter-container :pageNumber="currentPage"></mutation-filter-container>
          </div>
        </div>
        <data-item-selector :table="mutationTable"></data-item-selector>
      </b-col>
      <b-col sm="9">
        <div v-if="!filtered">
          <div v-if="mutationIdentifiers.length > 0">
            <div v-for="(identifier, index) in mutationIdentifiers.slice(pageSize * (currentPage-1), pageSize * currentPage)" :key="index">
              <mutation-card :mutationIdentifier="identifier"
                             :mutation="mutations[identifier]"
                             :visibleFields="visibleFields"></mutation-card>
            </div>
          </div>
          <moon-loader v-else :textForLoader="'Loading mutations'"></moon-loader>
        </div>
        <div v-else-if="filtered">
          <moon-loader v-if="isFiltering" :textForLoader="'Filtering'"></moon-loader>
          <div v-else-if="!isFiltering">
            <div v-if="mutationIdentifiers.length > 0">
              <p class="amount-mutations-found">
                {{ mutationIdentifiers.length }} mutation(s)
              </p>
              <div v-for="(identifier, index) in mutationIdentifiers.slice(pageSize * (currentPage-1), pageSize * currentPage)" :key="index">
                <mutation-card :mutationIdentifier="identifier"
                               :mutation="mutations[identifier]"
                               :visibleFields="visibleFields"></mutation-card>
              </div>
            </div>
            <div v-else>
              <b-card class="no-mutations-found">
                No mutations found with these filters
              </b-card>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3">
      </b-col>
      <b-col sm="9">
        <b-pagination-nav v-if="totalPages > 0" :use-router="true" size="md" :link-gen="linkGenerator" align="center"
                          :number-of-pages="totalPages" v-model="currentPage">
        </b-pagination-nav>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MutationCard from './MutationCard'
import MutationFilterContainer from './filters/MutationFilterContainer'
import MoonLoader from '../loader/MoonLoader'
import DataItemSelector from '../settings/DataItemSelector'
import GenomeBrowser from './../genomeBrowser/GenomeBrowser'
import { GET_FILTERED_GROUP_INFORMATION } from '../../store/actions'

export default {
  name: 'MutationCardsPaginator',
  props: {
    mutationIdentifiers: {
      type: Array
    },
    visibleFields: {
      type: Array
    },
    filtered: {
      default: false,
      type: Boolean
    }
  },
  components: {
    'mutation-card': MutationCard,
    'mutation-filter-container': MutationFilterContainer,
    'genome-browser': GenomeBrowser,
    'moon-loader': MoonLoader,
    'data-item-selector': DataItemSelector
  },
  data () {
    return {
      totalPages: Math.ceil(this.mutationIdentifiers.length / 20),
      currentPage: 1,
      pageSize: 20,
      optionsPageSize: [
        {value: 20, text: '20'},
        {value: 50, text: '50'},
        {value: 75, text: '75'},
        {value: 100, text: '100'}
      ]
    }
  },
  computed: {
    ...mapGetters({
      visibleFilters: 'getVisibleFilters'
    }),
    ...mapState({
      mutations: state => state.mutation.mutations,
      isFiltering: state => state.mutation.mutationsIsFiltering,
      mutationTable: 'MUTATION_TABLE',
      filteredGroupInformation: 'filterGroupInformation'
    })
  },
  watch: {
    '$route.params.pageNumURL': function () {
      if (!this.$route.params.pageNumURL) {
        this.$route.params.pageNumURL = 1
      }
      this.validatePageNum(this.$route.params.pageNumURL)
      this.currentPage = parseInt(this.$route.params.pageNumURL)
    },
    mutationIdentifiers () {
      this.totalPages = Math.ceil(this.mutationIdentifiers.length / this.pageSize)
    },
    pageSize () {
      this.totalPages = Math.ceil(this.mutationIdentifiers.length / this.pageSize)
    }
  },
  created () {
    if (typeof this.$route.params.pageNumURL !== 'undefined') {
      this.currentPage = parseInt(this.$route.params.pageNumURL)
    }
    /* Filtered group information is only set on first load, so it doesn't get overwritten */
    if (typeof this.filteredGroupInformation[this.mutationTable] === 'undefined') {
      this.$store.dispatch(GET_FILTERED_GROUP_INFORMATION, this.mutationTable)
    }
  },
  methods: {
    linkGenerator (pageNum) {
      if (typeof this.$route.query.q !== 'undefined') {
        return {
          name: 'MutationsContainer',
          params: {
            pageNumURL: pageNum
          },
          query: {q: this.$route.query.q}
        }
      } else {
        return {
          path: '/Mutations/page/' + pageNum
        }
      }
    },
    validatePageNum (pageNum) {
      if (this.totalPages > 0) {
        if (pageNum > this.totalPages) {
          this.$router.push('/Mutations/page/1')
          this.$router.push('/404')
        }
      }
    }
  }
}
</script>

<style scoped>
  .top-row-container {
    margin-top: 1rem;
  }
  .no-mutations-found {
    color: #dc3545;
    text-align: center;
  }
  .amount-mutations-found {
    text-align: center;
    font-weight: bold;
  }
  .mutations-per-page {
    font-size: 14px;
    background-color: #fafafa;
  }
</style>
