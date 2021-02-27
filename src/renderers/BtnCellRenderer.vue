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
      class="text-none ml-2"
      style="font-weight: normal; letter-spacing: normal;"
      color="error"
      small
      @click="btnDeleteClickedHandler()">
      Delete
    </v-btn>
    <modal-delete-competitor ref="deleteModal"></modal-delete-competitor>
  </div>
</template>

<script>
import Vue from "vue";
import ModalDeleteCompetitor from '@/components/ModalDeleteCompetitor.vue'

export default Vue.extend({
  name: 'BtnCellRenderer',
  components: {
    ModalDeleteCompetitor,
  },
  methods: {
    btnViewClickedHandler() {
      // Check that we have something in the row data and calling the route for competitor profile
      if (this.params && this.params.data && this.params.data.id) {
        this.$router.push({ name: 'competitor', params: { id: this.params.data.id } });
      }
    },
    btnDeleteClickedHandler() {
      this.$refs.deleteModal
        .open(this.params.data.firstname, this.params.data.lastname)
        .then((resolve, reject) => {
          console.log(resolve)
          console.log(reject)
        })
    }
  }
});
</script>
