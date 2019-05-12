<template>
	<div class="loader-container"">
		<div class="loader"></div>
	</div>
</template>

<script>
	export default {
		computed: {
			showLoader(){
				return this.$store.state.loaderActive;
			}
		}
	}
</script>

<style scoped lang="scss">
	.loader-container {
		display: flex;
	    position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 100vh;
		width: 100vw;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.8);
    	z-index: 100;
		.loader {
			border-radius: 100px;
			border-top: 4px solid teal;
			border-bottom: 4px solid rgba(220, 220, 220, 1);
			border-right: 4px solid rgba(220, 220, 220, 1);
			border-left: 4px solid rgba(220, 220, 220, 1);
			height: 50px;
			width: 50px;
			background-color: transparent;
			animation: spinner 1s infinite ease-in-out;
		}
	}
	@keyframes spinner {
		from { transform: rotate(0) }
		to { transform: rotate(360deg) }
	}
</style>
