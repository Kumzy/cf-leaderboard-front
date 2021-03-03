<template>
  <div>
    <!-- Button to see the profile of the competition -->
    <v-btn 
      class="text-none"
      style="font-weight: normal; letter-spacing: normal;"
      color="primary"
      small
      @click="btnViewClickedHandler()">
      View
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: 'BtnCompetitionCellRenderer',
  methods: {
    btnViewClickedHandler() {
      // Check that we have something in the row data and calling the route for competitor profile
      if (this.params && this.params.data && this.params.data.id) {
        this.$router.push({ name: 'competition', params: { id: this.params.data.id } });
      }
    }
  }
});
</script>
