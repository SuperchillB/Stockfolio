import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex, axios);

export default new Vuex.Store({
	state: {
		// stocks: [
		// 	{ id: 1, name: 'BMW', price: 110 },
		// 	{ id: 2, name: 'Google', price: 200 },
		// 	{ id: 3, name: 'Apple', price: 250 },
		// 	{ id: 4, name: 'Twitter', price: 8 }
		// ],
		stocks: [],
		myStocks: [],
		sold: [],
		totalFunds: 10000,
		loaderActive: false,
		newPriceSet: false
	},
	getters: {
		priceChange: state => state.newPriceSet,
		getUniqueOptions: state => category => {
			var unique = [...new Set(state.stocks.map(item => item[category]))];
			unique.forEach((el, i) => {
				unique[i] = {name: el, isSelected: false}
			})
			return unique;
		}
	},
	mutations: {
		// LAUNCH BELOW ONLY ONCE TO POPULATE DATA IN FIREBASE DB
		// populateDBStocks: (state, data) => {
		// 	console.log(data);
		// },
		loadDBStocks: (state, data) => {
			state.stocks = data;
		},
		addToMyStocks: (state, payload) => {
			var newTotal = state.totalFunds - payload.price * payload.quantity;
			var stockExists = false;
			if(state.myStocks.length > 0){
				state.myStocks.forEach(el => {
					payload.id === el.id ? (el.quantity += payload.quantity, stockExists = true) : null;
				});
				!stockExists ? state.myStocks.push(payload) : null;
			} else {
				state.myStocks.push(payload);
			}
			state.totalFunds = newTotal;
		},
		addToSold: (state, payload) => {
			var newTotal = state.totalFunds + payload.price * payload.quantity;
			state.sold.push(payload);
			state.totalFunds = newTotal;
		},
		getNewPrices: state => {
			state.stocks.forEach(el => {
				var max = el.price >= state.totalFunds/2 ? el.price = 200 : Math.ceil(el.price * 2);
				var min = Math.ceil(el.price / 2);
				var randNum = Math.floor(Math.random() * (max - min) ) + min;
				el.price = randNum;
				state.myStocks.forEach(myEl => {
					el.id === myEl.id ? myEl.price = el.price : null;
				});
			});
			state.newPriceSet = !state.newPriceSet;
		},
		removeFromMyStocks: (state, payload) => {
			state.myStocks.forEach((el, i) => {
				el.id == payload.id ? state.myStocks.splice(i, 1) : null;
			});
			console.log('REMOVED: ', payload);
		},
		toggleLoader: state => {
			state.loaderActive ? state.loaderActive = false : state.loaderActive = true;
		}
	},
	actions: {
		// LAUNCH BELOW ONLY ONCE TO POPULATE DATA IN FIREBASE DB
		// postInitialStocks: (context, data) => {
		// 	axios
		// 		.put('/stockmarket.json', data)
		// 		.then(res => {
		// 			context.commit('populateDBStocks', data);
		// 		})
		// 		.catch(error => { console.log(error) })
		// },
		loadStocks: context => {
			axios
				.get('/stockmarket.json')
				.then(res => {
					context.commit('toggleLoader');
					context.commit('loadDBStocks', res.data);
				})
				.catch(error => { console.log(error) })
		},
		addToMyStocks: (context, payload) => {
			context.commit('addToMyStocks', payload);
		},
		addToSold: (context, payload) => {
			context.commit('addToSold', payload);
		},
		getNewPrices: context => {
			context.commit('getNewPrices');
		},
		removeFromMyStocks: (context, payload) => {
			context.commit('removeFromMyStocks', payload);
		},
		toggleLoader: context => {
			context.commit('toggleLoader');
		}
	}
})
