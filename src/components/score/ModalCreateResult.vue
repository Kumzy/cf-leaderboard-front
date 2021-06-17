<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="740" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">{{ this.editing ? 'Edit Score' : 'Enter score' }}
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

          <!-- Team -->
          <v-autocomplete
            v-model="data.team"
            return-object
            outlined
            dense
            label="Team"
            :items="competition.teams"
            :prepend-icon="icons.group"
            item-text="name"
            clearable
            :rules="rules.selectTeamRequired"
            required
          >
          </v-autocomplete>
          <!-- Competitor
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
          </v-autocomplete> -->

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
                v-for="category in competition.categories"
                :key="category.id"
                :label="category.name"
                :value="category"
              ></v-radio>
          </v-radio-group>

          <!-- Score -->
          <v-text-field
            v-model.number="data.result"
            :prepend-icon="icons.scoreboard"
            outlined
            dense
            label="Result / Reps"
            required
            :rules="rules.resultRequired"
          ></v-text-field>

          <!-- Time -->
          <v-text-field
            v-model="tmp_data.time"
            v-mask="'##:##'"
            :prepend-icon="icons.clock"
            outlined
            placeholder="00:00"
            dense
            label="Time"
            required
            :rules="rules.timeRequired"
          ></v-text-field>

           <!-- Tiebreak -->
          <v-text-field
            v-model="tmp_data.tiebreak"
            v-mask="'##:##'"
            :prepend-icon="icons.tiebreak"
            outlined
            placeholder="00:00"
            dense
            label="Tie-break"
            required
            :rules="rules.tiebreakRequired"
          ></v-text-field>
        </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn class="text-none" depressed outlined color="grey" @click="cancel()">Cancel</v-btn>
          <v-btn class="text-none" :loading="creationLoading" depressed dark color="primary" @click="handleAction()">{{ this.editing ? 'Edit' : 'Create' }}</v-btn>
        </v-card-actions >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mdiClose, mdiDumbbell, mdiAccountGroup , mdiScoreboard, mdiFirework, mdiTimer, mdiTimelapse } from '@mdi/js';
import { postScore, putScore } from '@/api/score';
import { getCompetition } from '@/api/competition';
import { convertIntegerToTime, convertTimeToInteger } from '@/utils/time.js'
// import { getTeams } from '@/api/team';

export default Vue.extend({
    name: 'ModalCreateResult',
    data () {
      return {
        editing: false,
        icons:{
          close: mdiClose,
          dumbbell: mdiDumbbell,
          group: mdiAccountGroup,
          scoreboard: mdiScoreboard,
          firework: mdiFirework,
          clock: mdiTimer,
          tiebreak: mdiTimelapse,
        },
        myInputModel: false,
        creationLoading : false,
        dialog: false,
        menu: null,
        competition: {},
        competition_id: null,
        competitors: [],
        tmp_data :{ 
          // used to store time before sending it to the api in integer
          time: null,
          tiebreak: null,
        },
        data: {
          event: null,
          team: null,
          result: null,
          category: null,
          time: null,
          tiebreak: null,
        },
        rules:{
          selectEventRequired: [v => !!v || 'Event is required'],
          selectCompetitorRequired: [v => !!v || 'Competitor is required'],
          categoryRequired: [v => !!v || 'You must select a category'],
          resultRequired: [
            v => !!v || 'Result is required',
            v => Number.isInteger(Number(v)) || 'You must enter a number'
          ],
          timeRequired: [
            v => !!v || 'Time is required'
          ],
          tiebreakRequired: [
            v => !!v || 'Tie-break is required'
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
        this.data.team = null;
        this.data.result = null;
        this.data.category = null;
        this.tmp_data.time = null;
        this.tmp_data.tiebreak = null;
        this.data.time = null;
        this.data.tiebreak = null;
        
        this.editing = false;

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      openEdit(competitionId, scoreData) {
        // Assigning the data
        this.competition_id = competitionId

        // Showing the dialog
        this.dialog = true
        this.creationLoading = false

        // Resetting data  
        this.data.event = scoreData.event;
        this.data.team = scoreData.team;
        this.data.result = scoreData.result;
        this.data.category = scoreData.category;
        this.data.time = scoreData.time;
        this.data.tiebreak = scoreData.tiebreak;
        this.data.id = scoreData.id;

        // Resetting data  
        // this.data = scoreData;
        this.tmp_data.time = convertIntegerToTime(this.data.time);
        this.tmp_data.tiebreak = convertIntegerToTime(this.data.tiebreak);
                
        this.editing = true;

        getCompetition(competitionId).then(response => {
          this.competition = response.data.item;
          this.$forceUpdate();
        })

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      create() {
        var validated = this.$refs.scoreForm.validate();
        // Checking if the form is validated
        if ( validated === true ) {
          this.creationLoading = true
          this.data.tiebreak = convertTimeToInteger(this.tmp_data.tiebreak)
          this.data.time = convertTimeToInteger(this.tmp_data.time)
          // console.log(this.data)
          postScore(this.data)
          .then(() => {
            this.resolve(true)
            this.dialog = false
          })
          .finally(
            this.creationLoading = false
          )
        }
      },
      edit() {
        var validated = this.$refs.scoreForm.validate();
        // Checking if the form is validated
        if ( validated === true ) {
          this.creationLoading = true
          this.data.tiebreak = convertTimeToInteger(this.tmp_data.tiebreak)
          this.data.time = convertTimeToInteger(this.tmp_data.time)
          // console.log(this.data)
          putScore(this.data,this.data.id)
          .then(() => {
            this.resolve(true)
            this.dialog = false
          })
          .finally(
            this.creationLoading = false
          )
        }
      },
      handleAction() {
        if (this.editing && this.data ) {
          if (this.data.id) {
             this.edit()
          }
        } else {
          this.create()
        }
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
      },
      saveStartDate(date) {
        this.$refs.menu.save(date)
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