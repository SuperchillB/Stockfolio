import Vue from 'vue'
import './plugins/axios'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify, {
  iconfont: 'md'
})

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://stock-trader-final-project.firebaseio.com'

export const eventBus = new Vue({
  methods: {
    changePrice () {
      this.$emit('priceWasChanged')
    },
    changeFunds () {
      this.$emit('fundsWereChanged')
    }
  }
})

Vue.config.debug = true
Vue.config.devtools = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
