import { createRSQLQueryWithOperands } from './helpers'

export default {
  getMetadataAllFieldsVisible: (state) => {
    // Creates a deep copy of the metadata
    let metadataAllFieldsVisible = JSON.parse(JSON.stringify(state.metadata))
    Object.keys(metadataAllFieldsVisible).map(function (key) {
      metadataAllFieldsVisible[key].forEach(function (element) {
        element.fieldIsVisible = true
      })
    })
    return metadataAllFieldsVisible
  },
  getRSQLReferences: (state) => {
    return createRSQLQueryWithOperands(state.searchReferences, state.columnsToSearchReferences)
  },
  getVisibleFields: (state) => {
    let visibleFields = {}
    visibleFields[state.MUTATION_TABLE] = state.visibleFieldsMutationTable
    visibleFields[state.PATIENT_TABLE] = state.visibleFieldsPatientTable
    return visibleFields
  },
  getVisibleFieldsMetadata: (state) => (table) => {
    let visibleFields = []
    for (let key in state.metadata[table]) {
      if (!state.metadata[table].hasOwnProperty(key)) continue
      /*
      columns cdna notation and patient identifier should be ignored, since they're
      already visible in the header of the cards.
       */
      if (state.metadata[table][key]['fieldIsVisible']) {
        if (state.metadata[table][key]['name'] !== state.COLUMN_MUTATION_CDNANOTATION[0] &&
          state.metadata[table][key]['name'] !== state.COLUMN_PATIENT_IDENTIFIER[0]) {
          visibleFields.push(state.metadata[table][key])
        }
      }
    }
    return visibleFields
  },
  getVisibleFilters: (state) => {
    let visibleFilters = {}
    visibleFilters[state.MUTATION_TABLE] = state.filtersMutations
    visibleFilters[state.PATIENT_TABLE] = state.filtersPatients
    return visibleFilters
  },
  getColumnNamePubMedIdentifierPatientTable: (state) => {
    let pubmedIdentifier = null
    if (state.COLUMN_PUBMED_ID_PATIENT_TABLE) {
      pubmedIdentifier = state.COLUMN_PUBMED_ID_PATIENT_TABLE
    }
    return pubmedIdentifier
  }
}
