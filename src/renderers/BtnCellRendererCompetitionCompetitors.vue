<template>
  <div>
    <!-- Button to see the profile of the competitor -->
    <v-btn 
      class="text-none"
      style="font-weight: normal; letter-spacing: normal;"
      color="primary"
      small
      @click="btnViewClickedHandler()">
      View
    </v-btn>

    <!-- Delete the competitor -->
    <v-btn
      v-if="this.params.logged"
      class="text-none ml-2"
      style="font-weight: normal; letter-spacing: normal;"
      color="error"
      small
      @click="btnRemoveClickedHandler()">
      Remove
    </v-btn>
    <modal-remove-competitor-from-competition ref="removeCompetitorModal"></modal-remove-competitor-from-competition>
  </div>
</template>

<script>
import Vue from "vue";
import ModalRemoveCompetitorFromCompetition from '@/components/competition/ModalRemoveCompetitorFromCompetition.vue'
import { removeCompetitorFromCompetition } from '@/api/competition'

export default Vue.extend({
  name: 'BtnCellRendererCompetitionCompetitors',
  components: {
    ModalRemoveCompetitorFromCompetition,
  },
  methods: {
    btnViewClickedHandler() {
      // Check that we have something in the row data and calling the route for competitor profile
      if (this.params && this.params.data && this.params.data.id) {
        this.$router.push({ name: 'competitor', params: { id: this.params.data.id } });
      }
    },
    btnRemoveClickedHandler() {
      var competition_id = this.$route.params.id;
      this.$refs.removeCompetitorModal
        .open(this.params.data,competition_id)
        .then((resolve) => {
          if ( resolve && this.params.data && this.params.data.id && resolve == true) {
            removeCompetitorFromCompetition({ 'competitor_id': this.params.data.id, 'competition_id': competition_id }).then(() => {
              // console.log(response);
              this.$router.go(this.$router.currentRoute)
            })
          }
        })
    }
  }
});
</script>
