<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="540" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">Confirm result deletion
        <v-spacer></v-spacer>
        <v-btn
          icon
          x-small
          @click="cancel()"
        >
          <v-icon>{{ icons.close }}</v-icon>
        </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <p></p>
        <v-card-text>
          Are you sure that you want to delete the result of <span class="font-weight-bold">{{ score.competitor.longname }}</span> of the event <span class="font-weight-bold">{{ score.event.name }}</span> ?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn class="text-none" style="font-weight: normal; letter-spacing: normal;" depressed outlined color="grey" @click="cancel()">Cancel</v-btn>
          <v-btn class="text-none" :loading="loading" style="font-weight: bold; letter-spacing: normal;" depressed dark color="error lighten-1" @click="agree()">Delete</v-btn>
        </v-card-actions >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mdiClose } from '@mdi/js';
import { deleteScore } from '@/api/score.js';

export default Vue.extend({
    name: 'ModalRemoveResult',
    data () {
      return {
        icons: {
          close: mdiClose,
        },
        loading : false,
        dialog: false,
        score: {
          competitor : {},
          event: {}
        },
      }
    },
    methods: {
       open(score) {
        // Set score as property
        this.score = score;

        // Showing dialog
        this.dialog = true
        this.loading = false
        
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      agree() {
        this.loading = true
        deleteScore(this.score.id).then(() => {
          this.resolve(true)
          this.dialog = false
        })
        .finally(
          this.loading = false
        )
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
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