import { createRSQLQuery } from '../../helpers'

export default {
  getPatientInformation: state => state.informationPatients,
  getPatients: state => state.patients,
  getAllIdentifiersPatients: state => state.allIdentifiersPatients,
  getTotalPatients: state => state.totalPatients,
  getFilteredPatientsIdentifiers: state => state.filteredPatientsIdentifiers,
  rsqlPatients: createRSQLQuery,
  getStringSearch: state => state.stringSearch,
  getPatientsFilterActive: state => state.patientsFilterActive,
  getActiveFiltersCheckbox: state => state.activeFiltersCheckbox
}
