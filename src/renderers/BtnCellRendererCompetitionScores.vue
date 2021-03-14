<template>
  <div>
    <!-- Button to edit the score of the competitor for this competition -->
    <v-btn 
      v-if="this.params.logged"
      class="text-none"
      color="primary"
      small
      @click="btnEditClickedHandler()">
      Edit
    </v-btn>

    <!-- Delete the score -->
    <v-btn
      v-if="this.params.logged"
      class="text-none ml-2"
      color="error"
      small
      @click="btnRemoveClickedHandler()">
      Remove
    </v-btn>
    <modal-edit-score ref="editScoreModal"></modal-edit-score>
    <modal-remove-result ref="removeScoreModal"></modal-remove-result>
  </div>
</template>

<script>
import Vue from "vue";
// import ModalRemoveCompetitorFromCompetition from '@/components/competition/ModalRemoveCompetitorFromCompetition.vue'
import ModalCreateResult from '@/components/score/ModalCreateResult.vue'
import ModalRemoveResult from '@/components/competition/ModalRemoveResult.vue'

export default Vue.extend({
  name: 'BtnCellRendererCompetitionScores',
  components: {
    'modal-edit-score': ModalCreateResult,
    'modal-remove-result': ModalRemoveResult
  },
  methods: {
    btnEditClickedHandler() {
      // Check that we have something in the row data and it got an id
      if (this.params && this.params.competition_id && this.params.data && this.params.data.id) {
        // console.log(this.params.data)
        this.$refs.editScoreModal
        .openEdit(this.params.competition_id, this.params.data)
        .then((resolve) => {
          if ( resolve && resolve == true) {
            // Reload the current page
            // TODO: not reload but refresh data
            this.$router.go(this.$router.currentRoute)
          }
        })
      }
    },
    btnRemoveClickedHandler() {
      this.$refs.removeScoreModal
        .open(this.params.data)
        .then((resolve) => {
          if ( resolve && resolve == true) {
            // Reload the current page
            // TODO: not reload but refresh data
            this.$router.go(this.$router.currentRoute)
          }
        })
    }
  }
});
</script>

<style lang="scss">  
  .v-btn__content {
    font-weight: normal;
    letter-spacing: normal;
  }
</style>