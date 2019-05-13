<template>
	<v-flex xs12 sm6 md4 lg3>
		<v-card class="stock" elevation="0">
			<v-card-title class="stock__title teal lighten-4 title font-weight-light">
				<p class="green-text text-darken-4">{{ stock.name }}</p>
				<p class="price"><small>${{ stock.price }}/unit</small></p>
			</v-card-title>
			<v-card-text class="stock__text">
				<p class="text-xs-center blue-grey--text">Total: ${{ stock.price * quantity }}</p>
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
	.stock {
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
