<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="540" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">Add competitor to {{ this.competition.name }}
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

          <!-- Competitor -->
          <v-autocomplete
            v-model="data.competitor"
            return-object
            outlined
            dense
            label="Competitor"
            :items="competitors_available"
            :prepend-icon="icons.account"
            item-text="longname"
            clearable
            :rules="rules.selectCompetitorRequired"
            required
          >
          </v-autocomplete>
          
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn class="text-none" depressed outlined color="grey" @click="cancel()">Cancel</v-btn>
          <v-btn class="text-none" :loading="creationLoading" depressed dark color="primary" @click="add()">Add</v-btn>
        </v-card-actions >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mdiClose, mdiAccount } from '@mdi/js';
import { postCompetition } from '@/api/competition';
import { getCompetitors } from '@/api/competitor';

export default Vue.extend({
    name: 'ModalRemoveCompetitorFromCompetitionResult',
    data () {
      return {
        icons: {
          close: mdiClose,
          account: mdiAccount
        },
        creationLoading : false,
        dialog: false,
        menu: null,
        competitors_available: null,
        competition: {},
        data: {
          compititon: null,
          competitor: null,
        },
        rules:{
          selectEventRequired: [v => !!v || 'Event is required'],
          selectCompetitorRequired: [v => !!v || 'Competitor is required'],
          categoryRequired: [v => !!v || 'You must select a category'],
          resultRequired: [
            v => !!v || 'Result is required',
            v => Number.isInteger(Number(v)) || 'You must enter a number'
            ],
        }
      }
    },
    methods: {
      open(competition) {
        // Set competition as property
        this.competition = competition;

        // Showing dialog
        this.dialog = true
        this.creationLoading = false
        
        // Reset data
        this.data.competition = null;
        this.data.competitor = null;

        getCompetitors()
        .then(response => {
          console.log(response);
        })

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      add() {
        this.creationLoading = true
        postCompetition(this.data).then(response => {
          console.log(response);
          this.creationLoading = false
          this.resolve(true)
          this.dialog = false
        })
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
      },
      saveStartDate(date) {
        this.$refs.menu.save(date)
      },
    }
});
</script>

<style lang="scss">  
  .v-btn__content {
    font-weight: normal;
    letter-spacing: normal;
  }
</style>