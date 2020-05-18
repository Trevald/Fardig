import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueHotkey from 'v-hotkey'

import "./assets/main.css"
import "./assets/suggestions.css"

Vue.use(Vuex)
Vue.use(VueHotkey)

import storeDocuments from "./store/store-documents"

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        storeDocuments
    }
  })

Vue.config.productionTip = false

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
