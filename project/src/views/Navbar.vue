<template>
	<nav>
		<v-toolbar flat dark app class="teal accent-4">
			<v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title router to="/" class="headline font-weight-light white--text">
				<router-link to="/" class="toolbar-title">Stockfolio</router-link>
			</v-toolbar-title>
			<v-divider class="mx-3" inset vertical></v-divider>
			<v-toolbar-items class="ml-4 hidden-sm-and-down mono">
	      <v-btn flat router exact to="/stocks">Stock Market</v-btn>
	      <v-btn flat router exact to="/portfolio">My Portfolio</v-btn>
	    </v-toolbar-items>
	    <v-spacer></v-spacer>
	    <v-toolbar-items class="hidden-sm-and-down mono">
	      <v-btn flat @click="endDay">Wrap up</v-btn>
	      <v-menu open-on-hover :offset-y="true" bottom origin="center center" transition="scale-transition">
		      <template v-slot:activator="{ on }">
		        <v-btn flat v-on="on">
		          Save/Load Portfolio
		          <v-icon>arrow_drop_down</v-icon>
		        </v-btn>
		      </template>
		      <v-list>
		        <v-list-tile @click="savePortfolio">
		          <v-list-tile-title>Save</v-list-tile-title>
		        </v-list-tile>
		        <v-list-tile @click="loadPortfolio">
		          <v-list-tile-title>Load</v-list-tile-title>
		        </v-list-tile>
		      </v-list>
		    </v-menu>
	    </v-toolbar-items>
	    <v-toolbar-title class="funds font-weight-regular subheading mono">
	    	${{ getFunds }}
	    </v-toolbar-title>
		</v-toolbar>

		<v-navigation-drawer disable-resize-watcher v-model="drawer" app class="teal accent-4 mono">
			<v-list class="mt-5 white--text">
				<v-list-tile class="ml-3" active-class="active" v-for="route in links.routes" :key="route.text" router exact :to="route.route">
					<v-list-tile-action>
            <v-icon>{{ route.icon }}</v-icon>
          </v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ route.text }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-divider class="my-3"></v-divider>
				<v-list-tile class="mx-3" v-for="action in links.actions" :key="action.text" @click="action.action">
					<v-list-tile-action>
            <v-icon>{{ action.icon }}</v-icon>
          </v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ action.text }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
	</nav>
</template>

<script>
	import axios from 'axios'
	import { eventBus } from '../main'

	export default {
		data () {
			return {
				drawer: false,
				links: {
					routes: [
						{ icon: 'home', text: 'Home', route: '/' },
						{ icon: 'shopping_basket', text: 'Stock Market', route: '/stocks' },
						{ icon: 'work', text: 'My Portfolio', route: '/portfolio' }
					],
					actions: [
						{ icon: 'autorenew', text: 'Wrap Up', action: this.endDay },
						{ icon: 'cloud_upload', text: 'Save Portfolio', action: this.savePortfolio },
						{ icon: 'cloud_download', text: 'Load Portfolio', action: this.loadPortfolio }
					],
				}
			}
		},
		computed: {
			getFunds () {
				return this.$store.state.totalFunds
			}
		},
		methods: {
			endDay () {
				this.$store.dispatch('getNewPrices')
				// Animate price via event bus
				eventBus.changePrice('priceWasChanged')
				// Close drawer if mobile mode
				this.drawer = false;
			},
			savePortfolio () {
				if (!this.$store.state.loaderActive) {
					this.$store.dispatch('toggleLoader')
				}
				const data = {
					stocks: this.$store.state.stocks,
					portfolioStocks: this.$store.state.myStocks,
					funds: this.$store.state.totalFunds
				}
				axios.put('/data.json', data)
					.then(res => {
						this.$store.dispatch('toggleLoader')
					})
					.catch(error => { console.log(error) })
				// Close drawer if mobile mode
				this.drawer = false;
			},
			loadPortfolio () {
				if (!this.$store.state.loaderActive) {
					this.$store.dispatch('toggleLoader')
				}
				axios.get('/data.json')
					.then(res => {
						this.$store.state.myStocks = res.data.portfolioStocks
						this.$store.state.totalFunds = res.data.funds
						this.$store.dispatch('toggleLoader')
					})
					.catch(error => { console.log(error) })
				// Close drawer if mobile mode
				this.drawer = false;
			}
		},
		created () {
			eventBus.$on('fundsWereChanged', () => {
				[].forEach.call(document.getElementsByClassName('funds'), function (el) {
					el.classList.add('funds-change')
					setTimeout(() => {
						el.classList.remove('funds-change')
					}, 1000)
				});
            })
		},
		mounted () {
			document.addEventListener('DOMContentLoaded', function () {
		        var elems = document.querySelectorAll('.sidenav')
		        // var instances = M.Sidenav.init(elems);
		        // $(".dropdown-trigger").dropdown();
		        // $('.sidenav').sidenav().on('click tap', 'li a', () => {
		        //     $('.sidenav').sidenav('close');
		        // });
		    });
		}
	}
</script>

<style scoped lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,500');

	.toolbar-title {
		color: inherit;
  	text-decoration: inherit;
	}

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
		width: 6rem;
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
