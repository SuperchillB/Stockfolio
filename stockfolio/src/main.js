import Vue from 'vue'
import './plugins/axios'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'materialize-css'
import 'materialize-css/dist/js/materialize.min'
import 'materialize-css/dist/css/materialize.css'
import $ from 'jquery'

Vue.config.productionTip = false;

axios.defaults.baseURL = 'https://stock-trader-final-project.firebaseio.com';

export const eventBus = new Vue({
    methods: {
        changePrice() {
        	this.$emit('priceWasChanged');
        },
        changeFunds() {
        	this.$emit('fundsWereChanged');
        }
    }
});

Vue.config.debug = true;
Vue.config.devtools = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
