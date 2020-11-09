import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        baseInfo: {}
    },
    mutations: {
        setBaseInfo(state, baseInfo) {
            state.baseInfo = { ...state.baseInfo, ...baseInfo }
        }
    },
    getters: {},
    actions: {
        setBaseInfo({ commit }, baseInfo) {
            commit('setBaseInfo', baseInfo)
        }
    }
})

export default store
