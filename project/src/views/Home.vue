<template>
	<v-container grid-list-md d-flex align-content-center class="home">
		<v-layout class="home__title" row d-flex column>
			<h1 class="font-weight-thin" :class="`display-${getDisplay}`">Welcome to Stockfolio</h1>
			<p class="display-1 font-weight-light mt-3"><span class="headline">Your Wallet:</span> ${{ getFunds }}</p>
		</v-layout>
		<v-divider class="my-3"></v-divider>
		<v-layout class="home__main" row wrap>
			<v-flex xs12 md6 v-for="(instruction, i) in instructions" :key="i">
				<v-card flat class="home__card">
					<v-card-title :class="`display-${getDisplay}`" class="home__card__title font-weight-thin">{{ i+1 }}</v-card-title>
					<v-card-text class="home__card__text">{{ instruction }}</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data () {
		return {
			instructions: [
				'Load your portfolio by hitting \'LOAD\' in the dropdown menu.',
				'Click on \'My Portfolio\' to access your stocks.',
				'Click on \'Stock Market\' to purchase new stocks.',
				'Save your current portfolio by hitting \'SAVE\' in the dropdown menu.'
			]
		}
	},
	computed: {
		getFunds () {
			return this.$store.state.totalFunds
		},
		getDisplay () {
			if (this.$vuetify.breakpoint.name === 'xs') return '2'
			return '3'
		}
	}
}
</script>

<style scoped lang="scss">
.home {
	flex-direction: column;
	// height: 90vh;
	&__title {
		padding-left: 1rem;
	}
	&__main {
		max-width: 60rem;
		padding: 2rem;
		justify-content: center;
		align-items: center;
		align-self: center;
		@media screen and (max-width: 600px) {
	    padding: 1rem;
	  }
	}
	&__card {
		display: flex;
		width: 100%;
		height: 10rem;
		@media screen and (max-width: 960px) {
	    height: auto;
	  }
		&__title {
	    background: #333333;
	    color: white;
		}
		&__text {
			display: flex;
			align-items: center;
			justify-content: left;
		}
	}
}

</style>
