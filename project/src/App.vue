<template>
  <v-app class="grey lighten-4">
    <nav-bar />
    <v-content>
      <keep-alive>
        <transition appear name="router-anim" mode="out-in" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
          <router-view style="animation-duration: 0.5s"></router-view>
        </transition>
      </keep-alive>
      <!-- <loader v-if="showLoader"></loader> -->
    </v-content>
  </v-app>
</template>

<script>
import Navbar from './views/Navbar.vue'
import Loader from './components/Loader.vue'

export default {
  components: {
    navBar: Navbar,
    loader: Loader
  },
  computed: {
    showLoader () {
      return this.$store.state.loaderActive
    }
  }
}
</script>

<style>
    @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css";

    h1, h2, h3 {
        font-weight: 200;
    }

    .page {
        position: fixed;
        width: inherit;
    }
</style>
