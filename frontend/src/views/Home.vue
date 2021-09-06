<template>
  <v-container>
    <v-card>
      <v-card-title> Peering list </v-card-title>
      <v-card-text>
        <p v-if="peers.length === 0">
          You have no peering with Anillc Network yet.
        </p>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="info" to="/new">ADD</v-btn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="coffee">
import { mapState } from 'vuex'

export default
  name: 'home'
  data: -> {
    ...mapState(['peers'])
  }
</script>