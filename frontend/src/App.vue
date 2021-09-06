<template>
  <v-app>
    <v-app-bar app light color="blue" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title><div>Automatic peering system of Anillc Network</div></v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-sheet>
        <router-view></router-view>
      </v-sheet>
    </v-main>
    <!-- <v-snackbar v-model="connectFailed" timeout="-1" app>Failed to connect to server. Please refresh this page.</v-snackbar> -->
  </v-app>
</template>

<script lang="coffee">
export default
  name: 'app'
</script>