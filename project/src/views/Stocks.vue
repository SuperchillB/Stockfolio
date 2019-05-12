<template>
	<v-container grid-list-xl class="stocks mt-4">
		<v-layout class="stocks__main" column wrap>
			<h1 class="font-weight-light teal--text accent-4" :class="`display-${getDisplay}`">Stock Market</h1>
			<v-divider class="my-3"></v-divider>
			<p class="teal--text lighten-1">
				<v-btn @click="toggleFilters" dark icon fab small color="teal">
					<v-icon>{{ filtersOn ? 'remove' : 'add'}}</v-icon>
				</v-btn>
				{{ filtersOn ? ' Remove filters' : ' Add filters'}}
			</p>
			<transition name="slide" mode="out-in" class="dropdown">
				<stock-filter
					@addedFilterOption="updateFilterOptions($event)"
					@changedPrice="filterOptions.price = changePrice($event)"
					v-if="filtersOn"
					v-model.lowercase="searchValue"></stock-filter>
			</transition>
		</v-layout>
		<v-layout class="stocks__main" row wrap>
			<!-- <v-flex xs12 sm6 md4 lg3> -->
				<transition-group name="bounce" tag="div" class="stock__main__wrapper">
					<stock-item class="item" v-for="stock in filteredStocks" :stock="stock" :key="stock.id"></stock-item>
				</transition-group>
			<!-- </v-flex> -->
		</v-layout>
	</v-container>

	<!-- <div class="container">
		<div class="row">
			<div class="header">
				<h2 class="teal-text text-accent-4">Stock market</h2>
				<p class="teal-text text-lighten-1">
					<a @click="toggleFilters" class="btn-floating waves-effect waves-light teal">
						<i class="material-icons">{{ filtersOn ? 'remove' : 'add'}}</i>
					</a>
					{{ filtersOn ? ' Remove filters' : ' Add filters'}}
				</p>
				<transition name="slide" mode="out-in" class="dropdown">
					<stock-filter
						@addedFilterOption="updateFilterOptions($event)"
						@changedPrice="filterOptions.price = changePrice($event)"
						v-if="filtersOn"
						v-model.lowercase="searchValue"></stock-filter>
				</transition>
			</div>
			<div class="col s12">
				<transition-group name="bounce" tag="div">
					<stock-item class="item" v-for="stock in filteredStocks" :stock="stock" :key="stock.id"></stock-item>
				</transition-group>
			</div>
		</div>
	</div> -->
</template>

<script>
	import Stock from '../components/MarketStock.vue'
	import Filter from '../components/Filter.vue'

	export default {
		data () {
			return {
				searchValue: '',
				filtersOn: false,
				filterOptions: {
					sector: [],
					country: [],
					price: 0
				}
			}
		},
		components: {
			stockItem: Stock,
			stockFilter: Filter
		},
		methods: {
			toggleFilters () {
				if(this.filtersOn){
					this.filtersOn = false
					this.searchValue = ''
					this.filterOptions = {
						sector: [],
						country: [],
						price: 0
					};
					this.$store.state.stocks.forEach(el => {
						this.filterOptions.sector.push(el.sector)
						this.filterOptions.country.push(el.country)
						// ?? CHECK FOR PRICE ??
					})
				} else{
					this.filtersOn = true
				}
			},
			updateFilterOptions (object) {
				this.filterOptions = object
			},
			changePrice (newPrice) {
				return newPrice
			}
		},
		computed: {
			stocks () {
				return this.$store.state.stocks
			},
			filteredStocks () {
				return this.stocks.filter(stock => {
					return stock.name.toLowerCase().match(this.searchValue)
				}).filter(stock => {
					if (this.filterOptions.sector.length) return this.filterOptions.sector.includes(stock.sector)
					return this.stocks
				}).filter(stock => {
					if (this.filterOptions.country.length) return this.filterOptions.country.includes(stock.country)
					return this.stocks
				}).filter(stock => {
					if (this.filterOptions.price) return stock.price >= this.filterOptions.price
					return this.stocks
				})
			},
			getDisplay () {
				if (this.$vuetify.breakpoint.name === 'xs') return '1'
				return '2'
			}
		},
		created () {
			if (!this.$store.state.loaderActive) {
				this.$store.dispatch('toggleLoader')
			}
			this.$store.dispatch('loadStocks')
			this.$store.state.stocks.forEach(el => {
				this.filterOptions.sector.push(el.sector)
				this.filterOptions.country.push(el.country)
			})
		}

		// USE BELOW ONLY ONCE TO POPULATE DATA IN FIREBASE DB
		// mounted(){
		// 	const initialStocks = [
		// 		{ id: 1, name: 'BMW', price: 110, sector: 'car', country: 'DE' },
		// 		{ id: 2, name: 'Google', price: 201, sector: 'tech', country: 'US' },
		// 		{ id: 3, name: 'Apple', price: 252, sector: 'tech', country: 'US' },
		// 		{ id: 4, name: 'Mercedes', price: 99, sector: 'car', country: 'DE' },
		// 		{ id: 5, name: 'Twitter', price: 8, sector: 'tech', country: 'US' },
		// 		{ id: 6, name: 'Jaguar', price: 22, sector: 'car', country: 'UK' },
		// 		{ id: 7, name: 'Lufthansa', price: 70, sector: 'airline', country: 'DE' },
		// 		{ id: 8, name: 'Microsoft', price: 121, sector: 'tech', country: 'US' },
		// 		{ id: 9, name: 'Toyota', price: 153, sector: 'car', country: 'JP' },
		// 		{ id: 10, name: 'Philips', price: 29, sector: 'tech', country: 'NL' },
		// 		{ id: 11, name: 'Xiaomi', price: 92, sector: 'tech', country: 'CN' },
		// 		{ id: 12, name: 'Carrefour', price: 54, sector: 'consumer', country: 'FR' },
		// 		{ id: 13, name: 'Total', price: 37, sector: 'oil', country: 'FR' },
		// 		{ id: 14, name: 'Hyundai', price: 42, sector: 'car', country: 'KR' },
		// 		{ id: 15, name: 'HSBC', price: 117, sector: 'bank', country: 'UK' },
		// 		{ id: 16, name: 'Nokia', price: 84, sector: 'tech', country: 'FL' },
		// 		{ id: 17, name: 'Samsung', price: 267, sector: 'tech', country: 'KR' },
		// 		{ id: 18, name: 'Zara', price: 12, sector: 'fashion', country: 'ES' },
		// 		{ id: 19, name: 'Inbev', price: 51, sector: 'consumer', country: 'BE' },
		// 		{ id: 20, name: 'Nestlé', price: 15, sector: 'consumer', country: 'CH' },
		// 		{ id: 21, name: 'BP', price: 96, sector: 'oil', country: 'UK' },
		// 		{ id: 22, name: 'L\'Oréal', price: 15, sector: 'fashion', country: 'FR' }

		// 	];
		// 	this.$store.dispatch('postInitialStocks', initialStocks);
		// }
	}
</script>

<style scoped lang="scss">
	.stock__main__wrapper {
		display: flex;
		flex-wrap: wrap;
	}
	.stocks {
		flex-direction: column;
		.item {
			display: inline-block;
		}
		.bounce-enter {
			opacity: 0;
		}
		.bounce-enter-to {
			opacity: 1;
		}
		.bounce-move {
			transition: all 0.5s;
		}
		.bounce-leave {
			transform: scale(1);
		}
		.bounce-leave-to {
			opacity: 0;
	  		transform: scale(0.7);
		}
		.bounce-leave-active {
			opacity: 0;
			position: absolute;
		}
	}

	.dropdown{
  		height: 0px;
	}

	.slide-enter, .slide-leave-to{
		opacity: 0;
		max-height: 0px;
	}
	.slide-enter-active, .slide-leave-active{
		transition: all 0.2s ease-in-out;
	}
	.slide-enter-to, .slide-leave{
		opacity: 1;
		max-height: 300px;
	}
</style>
