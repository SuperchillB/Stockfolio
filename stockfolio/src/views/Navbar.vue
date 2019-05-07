<template>
	<div class="navbar-fixed">
		<nav class="teal accent-4">
			<ul id="dropdown1" class="dropdown-content">
				<li><a class="mono" href="#!" @click="savePortfolio">Save</a></li>
				<li><a class="mono" href="#!" @click="loadPortfolio">Load</a></li>
			</ul>
			<div class="nav-wrapper">
				<router-link to="/" active-class="active"><a class="brand-logo waves-effect waves-light">Stockfolio</a></router-link>
				<a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
				<ul class="navbar-left left hide-on-med-and-down">
					<router-link to="/portfolio" tag="li" active-class="active" exact><a class="waves-effect waves-light mono">Your Portfolio</a></router-link>
					<router-link to="/stocks" tag="li" active-class="active"><a class="waves-effect waves-light mono">Stock Market</a></router-link>
				</ul>
				<div class="right hide-on-med-and-down">
					<ul>
						<li><a class="mono" href="#" @click="endDay">Wrap up</a></li>
						<li><a class="dropdown-trigger mono" href="#" data-target="dropdown1">Save & Load<i class="material-icons right">arrow_drop_down</i></a></li>
						<li class="funds">Wallet ${{ getFunds }}</li>
					</ul>
				</div>
			</div>
		</nav>
		<ul class="sidenav" id="mobile-demo">
			<router-link to="/portfolio" tag="li" active-class="active" exact><a class="mono">Portfolio</a></router-link>
			<router-link to="/stocks" tag="li" active-class="active"><a class="mono">Stocks</a></router-link>
			<li><a class="nav-link mono" href="#" @click="endDay">End Day</a></li>
			<li><a class="mono" href="#" @click="savePortfolio">Save</a></li>
			<li><a class="mono" href="#" @click="loadPortfolio">Load</a></li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios';
	import { eventBus } from '../main';

	export default {
		computed: {
			getFunds(){
				return this.$store.state.totalFunds;
			}
		},
		methods: {
			endDay(){
				this.$store.dispatch('getNewPrices');
				// Animate price via event bus
				eventBus.changePrice('priceWasChanged');
			},
			savePortfolio(){
				if(!this.$store.state.loaderActive){
					this.$store.dispatch('toggleLoader');
				}
				const data = {
					stocks: this.$store.state.stocks,
					portfolioStocks: this.$store.state.myStocks,
					funds: this.$store.state.totalFunds
				}
				console.log(data);
				axios.put('/data.json', data)
					.then(res => {
						this.$store.dispatch('toggleLoader');
					})
					.catch(error => { console.log(error) });
			},
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
			}
		},
		created(){
			eventBus.$on('fundsWereChanged', () => {
				[].forEach.call(document.getElementsByClassName('funds'), function(el){
					el.classList.add('funds-change');
					setTimeout(() => {
						el.classList.remove('funds-change');
					}, 1000);
				});
            });
		},
		mounted(){
			document.addEventListener('DOMContentLoaded', function() {
		        var elems = document.querySelectorAll('.sidenav');
		        var instances = M.Sidenav.init(elems);
		        $(".dropdown-trigger").dropdown();
		        $('.sidenav').sidenav().on('click tap', 'li a', () => {
		            $('.sidenav').sidenav('close');
		        });
		    });
		}
	}
</script>

<style scoped lang="scss">
	.navbar-left {
		margin-left: 200px;
	}
	.navbar-fixed {
		z-index: 9999;
	}
	nav {
		padding: 0 2rem;
		.brand-logo {
			font-weight: 200;
		}
	}
	.mono {
		font-family: 'Roboto Mono', monospace;
		text-transform: uppercase;
	}

	.funds {
		display: inline-block;
	}

	.funds-change {
		animation: growInOut 0.5s ease-in-out;
	}

	@keyframes growInOut {
		0% {
			color: yellow;
			transform: scale(1);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
