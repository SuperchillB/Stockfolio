<template>
	<div class="filter-container">
		<div>
			<div class="row">
				<div class="col s8">
					<ul class="tabs">
						<li class="tab col s3"><a class="tooltipped" data-position="top" data-tooltip="Search by sector" href="#test2">Sector</a></li>
						<li class="tab col s3"><a class="tooltipped" data-position="top" data-tooltip="Search by country" href="#test1">Country</a></li>
						<li class="tab col s3"><a class="tooltipped" data-position="top" data-tooltip="Search by price" href="#test3">Price</a></li>
					</ul>
				</div>

			    <div class="input-field inline col s4">
			        <input type="text" id="search" :value="value" @input="updateValue($event.target.value)">
					<label class="" id="search">Find stock</label>
			    </div>
			</div>

			<div class="row">
				<div id="test1" class="col s12">
					<div class="filter-group">
						<div
							@click="toggleSelected('country', country)"
							:class="{ 'active-filter-option': country.isSelected }"
							class="blue-grey lighten-5 blue-grey-text text-darken-2"
							v-for="(country, index) in uniqueCountries">{{ country.name }}</div>
					</div>
				</div>
				<div id="test2" class="col s12">
					<div class="filter-group">
						<div
							@click="toggleSelected('sector', sector)"
							:class="{ 'active-filter-option': sector.isSelected }"
							class="blue-grey lighten-5 blue-grey-text text-darken-2"
							v-for="sector in uniqueSectors">{{ sector.name }}</div>
					</div>
				</div>
				<div id="test3" class="col s12">
					<div class="range-group">
						<p class="blue-grey-text text-darken-2">Minimum price: €{{ activeFilterOptions.price }}</p>
						<p class="range-field">
							<input
								v-model="activeFilterOptions.price"
								type="range"
								id="test5"
								min="0"
								max="500"
								@change="changePrice" />
							</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['value'],
		data(){
			return {
				filtersOn: false,
				uniqueCountries: this.$store.getters.getUniqueOptions('country'),
				uniqueSectors: this.$store.getters.getUniqueOptions('sector'),
				activeFilterOptions: {
					country: [],
					sector: [],
					price: 0
				}
			}
		},
		methods: {
			updateValue(value){
				this.$emit('input', value);
			},

			toggleSelected(category, item){
				if(item.isSelected){
					item.isSelected = false;
					this.activeFilterOptions[category].splice(this.activeFilterOptions.country.indexOf(item.name), 1);
				} else {
					item.isSelected = true;
					this.activeFilterOptions[category].push(item.name);
				}
				this.$emit('addedFilterOption', this.activeFilterOptions);
			},

			addClassSelected(index){
				return this.uniqueCountriesGetter[index].isSelected;
			},

			changePrice() {
          this.$emit('changedPrice', this.activeFilterOptions.price);
      }
		},
		computed: {
			stocks(){
				return this.$store.state.stocks;
			},
			uniqueCountriesGetter(){
				return this.$store.getters.countryUniqueOptions;
			},
			uniqueCountriesList(){
				var unique = [...new Set(this.stocks.map(item => item.country))];
				unique.forEach((el, i) => {
					unique[i] = {name: el, isSelected: false}
				})
				this.uniqueCountries = unique;
				return unique;
			},
			uniqueSectorsList(){
				const unique = [...new Set(this.stocks.map(item => item.sector))];
				return unique;
			}
			// priceRangeChange: {
			// 	get(){
			// 		return this.activeFilterOptions.price;
			// 	},
			// 	set(val){
			// 		this.$emit('priceChanged', val);
			// 	}
			// }
		},
		mounted(){
			// Tabs init
			var instance = M.Tabs.init(document.querySelector('.tabs'));
			// Tab underline styling
			document.querySelector('.indicator').style.backgroundColor = '#00bfa5';
			// Tooltip init
			var elems = document.querySelectorAll('.tooltipped');
    		var instances = M.Tooltip.init(elems);
    		// Range slider init
    		var array_of_dom_elements = document.querySelectorAll("input[type=range]");
			M.Range.init(array_of_dom_elements);
		}
	}
</script>

<style scoped lang="scss">
	.row{
	    display: flex;
    	align-items: center;
    	.tab a{
			color: #80cbc4;
			&:hover{
				color: #00bfa5;
			}
    	}

    	.tab a.active {
			color: #00bfa5 !important;
			background-color: #e0f2f1 !important;
		}

		.filter-group {
		    display: flex;
		    width: 100%;
		    margin-left: 0;
		    align-items: center;
		    flex-wrap: wrap;
		    div {
	    	    display: flex;
			    justify-content: center;
			    align-items: center;
			    padding: 10px 20px;
			    border-radius: 50px;
			    background-color: darkgrey;
			    cursor: pointer;
			    margin: 0.3rem;
		    }
		}

		.active-filter-option {
			background-color: #607d8b !important;
			color: white !important;
		}

		.range-group {
			display: flex;
			justify-content: center;
			align-items: flex-start;
			flex-direction: column;
			.range-field {
				width: 50%;
			}
		}

	}
</style>
