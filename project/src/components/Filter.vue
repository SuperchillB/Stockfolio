<template>
	<v-container class="filter">
		<v-layout class="filter__main" d-flex row wrap :align-start="true">
			<v-flex class="mt-2" xs12 md7 lg8>
				<v-tabs style="overflow:hidden;" color="grey lighten-4" light slider-color="yellow">
	        <v-tab
	        	active-class="teal lighten-5"
	        	v-for="(tab, i) in tabs"
	        	:key="i"
	        	:href="`#tab-${i+1}`"
	        	ripple>
	        	<v-tooltip v-if="$vuetify.breakpoint.name !== 'xs'" top>
	      			<template v-slot:activator="{ on }">
	      				<v-btn class="tabBtn" flat v-on="on" :ripple="false">{{ tab.name }}</v-btn>
	    				</template>
				      <span>{{ tab.tip }}</span>
				    </v-tooltip>
				    <v-btn v-else class="tabBtn" flat v-on="on" :ripple="false">{{ tab.name }}</v-btn>
	        </v-tab>
					<v-tabs-slider color="teal"></v-tabs-slider>
					<v-tabs-items>
			      <v-tab-item value="tab-1" class="mt-4">
			        <v-card color="grey lighten-4" flat>
			          <v-chip
									disabled
			          	:selected="false"
			          	@click="toggleSelected('sector', sector)"
									:class="{ 'active-filter-option': sector.isSelected }"
									class="filter__chip grey lighten-2 blue-grey--text text--darken-2"
									v-for="(sector, i) in uniqueSectors"
									:key="i">{{ sector.name }}</v-chip>
			        </v-card>
			      </v-tab-item>
			      <v-tab-item value="tab-2" class="mt-4">
			        <v-card color="grey lighten-4" flat>
			          <v-chip
			          disabled
		          	@click="toggleSelected('country', country)"
								:class="{ 'active-filter-option': country.isSelected }"
								class="filter__chip grey lighten-2 blue-grey--text text--darken-2"
								v-for="(country, i) in uniqueCountries"
								:key="i">{{ country.name }}</v-chip>
			        </v-card>
			      </v-tab-item>
			      <v-tab-item value="tab-3" class="mt-4">
			        <v-card max-width="30rem" color="grey lighten-4" flat>
			          <v-card-text>
			          	<!-- <p class="blue-grey-text text-darken-2">Minimum price: €{{ activeFilterOptions.price }}</p> -->
			          	<v-subheader>Minimum price: €{{ activeFilterOptions.price }}</v-subheader>
			          	<v-slider
			          		thumb-color="teal"
			          		color="teal"
						        thumb-label
						        v-model="activeFilterOptions.price"
										min="0"
										max="500"
										@change="changePrice"
						      ></v-slider>
			          </v-card-text>
			        </v-card>
			      </v-tab-item>
					</v-tabs-items>
				</v-tabs>
			</v-flex>
			<v-flex class="mt-2" xs12 md5 lg4>
				<v-text-field
					color="teal"
	        label="Search stock"
	        id="search"
	        v-model="searchInput"
	        @input="updateValue(searchInput)"
	      ></v-text-field>
			</v-flex>
		</v-layout>
	</v-container>

	<!-- <div class="filter-container">
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
	</div> -->
</template>

<script>
	export default {
		props: ['value'],
		data () {
			return {
				tabs: [
					{ name: 'Sector', tip: 'Search by sector' },
					{ name: 'Country', tip: 'Search by country' },
					{ name: 'Price', tip: 'Search by price' }
				],
				filtersOn: false,
				uniqueCountries: this.$store.getters.getUniqueOptions('country'),
				uniqueSectors: this.$store.getters.getUniqueOptions('sector'),
				activeFilterOptions: {
					country: [],
					sector: [],
					price: 0
				},
				searchInput: null
			}
		},
		methods: {
			updateValue (value) {
				this.$emit('input', value)
			},

			toggleSelected (category, item) {
				if (item.isSelected) {
					item.isSelected = false
					this.activeFilterOptions[category].splice(this.activeFilterOptions.country.indexOf(item.name), 1)
				} else {
					item.isSelected = true
					this.activeFilterOptions[category].push(item.name)
				}
				this.$emit('addedFilterOption', this.activeFilterOptions)
			},

			addClassSelected (index) {
				return this.uniqueCountriesGetter[index].isSelected
			},

			changePrice () {
          this.$emit('changedPrice', this.activeFilterOptions.price)
      }
		},
		computed: {
			stocks () {
				return this.$store.state.stocks
			},
			uniqueCountriesGetter () {
				return this.$store.getters.countryUniqueOptions
			},
			uniqueCountriesList () {
				var unique = [...new Set(this.stocks.map(item => item.country))]
				unique.forEach((el, i) => {
					unique[i] = { name: el, isSelected: false }
				})
				this.uniqueCountries = unique
				return unique
			},
			uniqueSectorsList () {
				const unique = [...new Set(this.stocks.map(item => item.sector))]
				return unique
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
		mounted () {
			// // Tabs init
			// var instance = M.Tabs.init(document.querySelector('.tabs'))
			// // Tab underline styling
			// document.querySelector('.indicator').style.backgroundColor = '#00bfa5'
			// // Tooltip init
			// var elems = document.querySelectorAll('.tooltipped')
   //  		var instances = M.Tooltip.init(elems)
   //  		// Range slider init
   //  		var array_of_dom_elements = document.querySelectorAll("input[type=range]")
			// M.Range.init(array_of_dom_elements)
		}
	}
</script>

<style scoped lang="scss">
	.tabBtn {
		width: 100%;
		height: 100%;
		background-color: transparent !important;
		&:hover:before {
			background-color: transparent !important;
		}
	}
	.filter__main {
		min-height: 12rem;
	}
	.row {
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
