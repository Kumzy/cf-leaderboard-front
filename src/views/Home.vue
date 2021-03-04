<template>
  <v-container fill-height fluid style="background-color: #1E1E1E !important">
    <v-row justify="center" align="center">
        <v-col cols="12" sm="4">

          <v-img
            class="mt-10"
            :src="require('@/assets/logo_clapiers.png')"
          ></v-img>

          <v-btn
            depressed
            class="text-none mt-2"
            style="letter-spacing: normal;"
            color="primary"
            @click="enter"
          >
            Enter
          </v-btn>

          <!-- <v-btn
            flat
            depressed
            class="text-none ml-4"
            style="letter-spacing: normal;"
            color="secondary"
          >
            Photos
          </v-btn> -->
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      logoPath: '@/assets/logo_clapiers.png'
    }
  },
  methods:{
    enter() {
      this.$router.push({name: 'competitions'})
    }
  }
}
</script>