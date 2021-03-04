<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="740" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">Enter score
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
          <v-form
            ref="scoreForm"
            lazy-validation
          >
          <!-- Events -->
          <v-select
            :items="competition.events"
            v-model="data.event"
            item-text="name"
            return-object
            label="Event"
            dense
            outlined
            :rules="rules.selectEventRequired"
            :prepend-icon="icons.dumbbell"
            required
          ></v-select>

          <!-- Competitor -->
          <v-autocomplete
            v-model="data.competitor"
            return-object
            outlined
            dense
            label="Competitor"
            :items="competition.competitors"
            :prepend-icon="icons.account"
            item-text="longname"
            clearable
            :rules="rules.selectCompetitorRequired"
            required
          >
          </v-autocomplete>

          <!-- Category -->
          <v-radio-group
              v-model="data.category"
              row
              required
              :rules="rules.categoryRequired"
            >
              <template v-slot:label>
                <div style='font-size: 16px;'><v-icon>{{ icons.firework }}</v-icon> Category</div>
              </template>
              <v-radio
                label="RX"
                color="red"
                value="red"
              ></v-radio>
              <v-radio
                label="Scaled"
                color="orange"
                value="red darken-3"
              ></v-radio>    
          </v-radio-group>

          <!-- Score -->
          <v-text-field
            v-model.number="data.score"
            :prepend-icon="icons.scoreboard"
            outlined
            dense
            label="Score"
            required
            :rules="rules.scoreRequired"
          ></v-text-field>
        </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn class="text-none" depressed outlined color="grey" @click="cancel()">Cancel</v-btn>
          <v-btn class="text-none" :loading="creationLoading" depressed dark color="primary" @click="create()">Create</v-btn>
        </v-card-actions >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mdiClose, mdiDumbbell, mdiAccount, mdiScoreboard, mdiFirework  } from '@mdi/js';
// import { postCompetition } from '@/api/competition';
// import { getCompetitors } from '@/api/competitor';

export default Vue.extend({
    name: 'ModalCreateScore',
    data () {
      return {
        icons:{
          close: mdiClose,
          dumbbell: mdiDumbbell,
          account: mdiAccount,
          scoreboard: mdiScoreboard,
          firework: mdiFirework 
        },
        creationLoading : false,
        dialog: false,
        menu: null,
        competition: {},
        competitors: [],
        data: {
          event: null,
          competitor: null,
          score: null,
          category: null
        },
        rules:{
          selectEventRequired: [v => !!v || 'Event is required'],
          selectCompetitorRequired: [v => !!v || 'Competitor is required'],
          categoryRequired: [v => !!v || 'You must select a category'],
          scoreRequired: [
            v => !!v || 'Score is required',
            v => Number.isInteger(Number(v)) || 'You must enter a number'
            ],
        }
      }
    },
    methods: {
      open(competitionData) {
        // Assigning the data
        this.competition = competitionData
        // Showing the dialog
        this.dialog = true
        this.creationLoading = false

        // Resetting data  
        this.data.event = null;
        this.data.competitor = null;
        this.data.score = null;
        this.data.category = null;

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      // getCompetitors() {
      //   // this.refreshLoading = true;
      //   getCompetitors().then(response => {
      //     this.competitors = response.data.items
      //     // this.refreshLoading = false
      //   })
      // },
      create() {
        var validated = this.$refs.scoreForm.validate();
        // Checking if the form is validated
        if ( validated === true ) {
          this.creationLoading = true
          // Form validated, sending request
          // TODO: send request
          console.log(this.data);
        }
        
        // this.creationLoading = true
        // postCompetition(this.data).then(response => {
        //   console.log(response);
        //   this.creationLoading = false
        //   this.resolve(true)
        //   this.dialog = false
        // })
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