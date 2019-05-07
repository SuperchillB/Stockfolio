<template>
	<div class="container">
		<div class="col s12 m7">
			<div class="home">
				<div>
					<div>
						<h1>Welcome to Stockfolio</h1>
						<p>To save/load your current portfolio, hit 'SAVE'/'LOAD'.</p>
						<p>Hit 'WRAP UP' to wrap up the day and get new prices.</p>
					</div>
					<div>
						<h4>Your Wallet: ${{ getFunds }}</h4>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		computed: {
			getFunds() {
				return this.$store.state.totalFunds;
			}
		}
	}
</script>

<style scoped lang="scss">
	.home {
			padding: 20px;
			margin-top: 50px;
		}
</style>
