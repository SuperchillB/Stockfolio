<template>
	<v-flex xs12 sm6 md4 lg3>
		<v-card elevation="0">
			<v-card-title class="stock__title teal lighten-4 title font-weight-light">
				<p class="green-text text-darken-4">{{ stock.name }}</p>
				<p class="price"><small>${{ stock.price }}/unit</small></p>
			</v-card-title>
			<v-card-text class="stock__text">
				<p class="text-xs-center">Total: ${{ stock.price * quantity }}</p>
				<v-text-field
					label="Quantity"
					color="teal"
					small
					v-model.number="quantity"></v-text-field>
				<v-btn
					color="teal lighten-1"
					class="stock__cta white--text"
					depressed
					@click.prevent="buyStock(stock)"
					:disabled="quantity <= 0 || !Number.isInteger(quantity)">Buy</v-btn>
			</v-card-text>
		</v-card>
	</v-flex>


	<!-- <div class="col s12 m6 l4">
		<div class="card z-depth-1">
			<div class="header">
				<span class="card-title green-text text-darken-4">{{ stock.name }} <small>(Price: <span class="price">{{ stock.price }}</span>)</small></span>
			</div>
			<div class="card-content white-text">
				<form>
					<div class="row valign-wrapper">
						<div class="col s8">
							<div class="input-field inline">
								<span class="grey-text">Quantity</span>
								<input id="email_inline" type="email" class="validate green-text text-darken-4" v-model.number="quantity">
							</div>
						</div>
						<div class="col s4">
							<button
								type="submit"
								class="btn waves-effect waves-light"
								@click.prevent="buyStock(stock, e)"
								:disabled="quantity <= 0 || !Number.isInteger(quantity)">Buy</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div> -->
</template>

<script>
import { eventBus } from '../main'

export default {
	props: {
		stock: Object
	},
	data () {
		return {
			quantity: null
		}
	},
	methods: {
		buyStock (stock) {
			if (this.$store.state.totalFunds - this.stock.price * this.quantity >= 0) {
				const purchasedStock = { ...stock, quantity: this.quantity }
				this.$store.dispatch('addToMyStocks', purchasedStock)
				eventBus.changeFunds('fundsWereChanged')
				this.quantity = null
			} else {
				alert('You have insufficient funds')
			}
		}
	},
	computed: {
		priceChange () {
			return this.$store.getters.priceChange
		}
	},
	created () {
		eventBus.$on('priceWasChanged', () => {
			[].forEach.call(document.getElementsByClassName('price'), function (el) {
				el.classList.add('price-change')
				setTimeout(() => {
					el.classList.remove('price-change')
				}, 1000)
			})
		})
	}
}
</script>

<style scoped lang="scss">
	.stock__title {
		display: flex;
		justify-content: space-between;
	}
	.stock__text {
		display: flex;
		flex-direction: column;
	}
	.stock__cta {
		width: 50%;
		max-width: 10rem;
		margin: 0 auto;
	}
	.card {
		margin: 1rem;
		max-height: 200px;
		min-width: 230px;
		.header {
			height: 5rem;
			display: flex;
			align-items: center;
			padding-left: 10px;
			background-color: #99e4da;
			small {
				font-size: 1rem;
				transition: all 1s ease-in-out;
			}
		}
		.card-content {
			padding-right: 2.3rem;
		}
	}

	.price {
		display: inline-block;
	}

	.price-change {
		animation: growInOut 0.5s ease-in-out;
	}

	@keyframes growInOut {
		0% {
			border-bottom: none;
			transform: scale(1);
		}
		50% {
			border-bottom: 2px solid red;
			color: red;
			transform: scale(1.5);
		}
		100% {
			border-bottom: none;
			transform: scale(1);
		}
	}
</style>
