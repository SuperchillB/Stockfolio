<template>
	<div class="col s12 m6 l4">
		<div class="card z-depth-1">
			<div class="header blue lighten-4">
				<span class="card-title blue-text text-darken-4">{{ stock.name }} <small>(Price: <span class="price">{{ stock.price }}</span> | Quantity: {{ stock.quantity }})</small></span>
			</div>
			<div class="card-content white-text">
				<form>
					<div class="row valign-wrapper">
						<div class="col s8">
							<div class="input-field inline">
								<input id="email_inline" type="email" class="validate blue-text text-darken-4" v-model.number="quantity">
								<label for="email_inline">Quantity</label>
							</div>
						</div>
						<div class="col s4">
							<button
								type="submit"
								class="btn waves-effect waves-light blue darken-2"
								@click.prevent="sellStock(stock, e)"
								:disabled="quantity <= 0 || !Number.isInteger(quantity)">Sell</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import { eventBus } from '../main';

	export default {
		props: {
			stock: Object
		},
		data(){
			return {
				quantity: this.stock.quantity
			}
		},
		methods: {
			sellStock(stock){
				if(this.quantity <= stock.quantity){
					stock.quantity -= this.quantity;
					const soldStock = {...stock};
					soldStock.quantity = this.quantity;
					this.$store.dispatch('addToSold', soldStock);
					eventBus.changeFunds('fundsWereChanged');
					this.quantity = stock.quantity;
				} else {
					alert('You don\'t have enough of these stocks');
				}
				if(this.quantity === 0){
					this.$store.dispatch('removeFromMyStocks', stock);
				}
				console.log(stock);
			},
			getQuantity(stock){
				this.$store.state.purchased.forEach(purchasedStock => {
					if(purchasedStock.id === stock.id){
						return purchasedStock.quantity;
					}
				});
			}
		},
		computed: {
			priceChange(){
				return this.$store.getters.priceChange;
			}
		},
		created(){
			eventBus.$on('priceWasChanged', () => {
				[].forEach.call(document.getElementsByClassName('price'), function(el){
					el.classList.add('price-change');
					setTimeout(() => {
						el.classList.remove('price-change');
					}, 1000);
				});
            });
		}
	}
</script>

<style scoped lang="scss">
	.card {
		margin: 1rem;
		max-height: 200px;
		min-width: 230px;
		.header {
			height: 5rem;
			display: flex;
			align-items: center;
			padding-left: 10px;
			small {
				font-size: 0.8rem;
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
