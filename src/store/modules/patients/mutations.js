import Vue from 'vue'
import { naturalSort } from '../../helpers'
import { COLUMN_PATIENT_ID } from '../../actions'

export const SET_TOTAL_PATIENTS = '__SET_TOTAL_PATIENTS__'
export const SET_ALL_PATIENTS = '__SET_ALL_PATIENTS__'
export const SET_PATIENT_INFORMATION_PATIENT_ID = '__SET_PATIENT_INFORMATION_PATIENT_ID__'

const filterKeys = (obj, filter) => {
  let keys = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && filter.test(key)) {
      keys.push(key)
    }
  }
  return keys
}
export default {
  [SET_ALL_PATIENTS] (state, patients) {
    let identifiers = []
    Object.keys(patients).map(function (key) {
      let mutations = []
      /* TODO Regex works only for deb-central.org and is hard-coded */
      let filteredKeys = filterKeys(patients[key], /cDNAchange/)
      filteredKeys.forEach(function (element) {
        if (patients[key][element]) {
          mutations.push(patients[key][element])
        }
      })
      identifiers.push(patients[key][COLUMN_PATIENT_ID])
      Vue.set(state.patients,
        patients[key][COLUMN_PATIENT_ID],
        {
          'information': patients[key],
          'mutations': mutations
        })
    })
    state.allIdentifiersPatients = naturalSort(identifiers)
  },
  [SET_TOTAL_PATIENTS] (state, total) {
    state.totalPatients = total
  },
  [SET_PATIENT_INFORMATION_PATIENT_ID] (state, [id, information]) {
    Vue.set(state.informationPatients, id, information)
  }
}
