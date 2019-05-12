<template>
	<v-container grid-list-xl class="portfolio mt-4">
		<v-layout class="portfolio__main" column wrap>
			<h1 class="font-weight-light teal--text accent-4" :class="`display-${getDisplay}`">Your portfolio</h1>
			<v-divider class="my-3"></v-divider>
			<p v-if="stocks.length > 0" class="teal--text lighten-1">
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
		<v-layout class="portfolio__main" row wrap>
			<v-flex v-if="stocks.length > 0" xs12>
				<transition-group name="bounce" tag="div" class="portfolio__main__wrapper">
					<stock-item class="item" v-for="stock in filteredStocks" :stock="stock" :key="stock.id"></stock-item>
				</transition-group>
			</v-flex>
			<v-flex v-else xs12>
				<v-card flat class="portfolio__info mt-5">
					<v-card-text class="blue-grey--text text--darken-2">You currently have no stocks in your portfolio.</v-card-text>
					<div class="mt-4">
						<v-btn flat color="teal" dark large @click="loadPortfolio">
							<v-icon class="mr-2">file_download</v-icon>
							Load portfolio
						</v-btn>
						<v-btn flat color="teal" dark large @click="navigateToStocks">
							<v-icon class="mr-2">add_shopping_cart</v-icon>
							Buy stocks
						</v-btn>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>


	<!-- <div class="container">
		<div class="row">
			<div class="header">
				<h2 class="teal-text text-accent-4">Your portfolio</h2>
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
			<div v-if="stocks.length > 0" class="col s12">
				<transition-group name="bounce" tag="div">
					<stock-item class="item" v-for="stock in filteredStocks" :stock="stock" :key="stock.id"></stock-item>
				</transition-group>
			</div>
			<div v-else class="col s12">
				<p class="blue-grey-text text-darken-2">You currently have no stocks in your portfolio</p>
				<div class="btn-group">
					<a @click="loadPortfolio" class="waves-effect waves-light btn-large"><i class="material-icons left">file_download</i>Load portfolio</a>
					<a @click="navigateToStocks" class="waves-effect waves-light btn-large"><i class="material-icons left">add_shopping_cart</i>Buy stocks</a>
				</div>
			</div>
		</div>
	</div> -->
</template>

<script>
	import Stock from '../components/PortfolioStock.vue';
	import Filter from '../components/Filter.vue';

	export default {
		data(){
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
			loadPortfolio(){
				if(!this.$store.state.loaderActive){
					this.$store.dispatch('toggleLoader');
				}
				axios.get('/data.json')
					.then(res => {
						this.$store.state.myStocks = res.data.portfolioStocks;
						this.$store.state.totalFunds = res.data.funds;
						this.$store.dispatch('toggleLoader');
					})
					.catch(error => { console.log(error) })
			},
			navigateToStocks(){
				this.$router.push('/stocks');
			},

			toggleFilters(){
				if(this.filtersOn){
					this.filtersOn = false;
					this.searchValue = '';
					this.filterOptions = {
						sector: [],
						country: [],
						price: 0
					};
					this.$store.state.myStocks.forEach(el => {
						this.filterOptions.sector.push(el.sector);
						this.filterOptions.country.push(el.country);
						// ?? CHECK FOR PRICE ??
					});
				} else{
					this.filtersOn = true;
				}
			},
			updateFilterOptions(object){
				this.filterOptions = object;
			},
			changePrice(newPrice){
				return newPrice;
			}
		},
		computed: {
			stocks(){
				return this.$store.state.myStocks;
			},

			filteredStocks(){
				return this.stocks.filter(stock => {
					return stock.name.toLowerCase().match(this.searchValue);
				}).filter(stock => {
					if(this.filterOptions.sector.length) return this.filterOptions.sector.includes(stock.sector);
					return this.stocks;
				}).filter(stock => {
					if(this.filterOptions.country.length) return this.filterOptions.country.includes(stock.country);
					return this.stocks;
				}).filter(stock => {
					if(this.filterOptions.price) return stock.price >= this.filterOptions.price;
					return this.stocks;
				});
			},
			getDisplay () {
				if (this.$vuetify.breakpoint.name === 'xs') return '1'
				return '2'
			}
		},
		created(){
			this.$store.state.myStocks.forEach(el => {
				this.filterOptions.sector.push(el.sector);
				this.filterOptions.country.push(el.country);
			});
		}
	}
</script>

<style scoped lang="scss">
	.portfolio__info {
		display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    max-width: 35rem;
    height: 15rem;
    margin: 0 auto;
	}

	.portfolio__main__wrapper {
		display: flex;
		flex-wrap: wrap;
	}

	.container {
		// margin-top: 3rem;
		.item {
			display: inline-block;
		}

		.btn-group {
			display: flex;
			justify-content: center;
			align-items: center;
			a {
				margin: 30px;
			}
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
			// opacity: 1;
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
