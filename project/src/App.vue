<template>
  <v-app class="grey lighten-4">
    <nav-bar />
    <v-content>
      <keep-alive>
        <transition appear name="router-anim" mode="out-in" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
          <router-view style="animation-duration: 0.5s"></router-view>
        </transition>
      </keep-alive>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from './views/Navbar.vue'

export default {
  components: {
    navBar: Navbar
  }
}
</script>

<style>
    @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css";
</style>
