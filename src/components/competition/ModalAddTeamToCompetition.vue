<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="540" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">Add team to {{ this.competition.name }}
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
          <div class="my-4 subtitle-1">Only competitors not added to the compeitition can be selected.</div>

          <!-- Team name -->
          <v-text-field
            outlined
            dense
            label="Team name"
            :prepend-icon="icons.accountGroup"
            v-model="data.name"
          ></v-text-field>

          <!-- Competitor 1 -->
          <v-autocomplete
            v-model="data.competitor_1"
            return-object
            outlined
            dense
            label="Competitor #1"
            :items="competitors_available"
            :prepend-icon="icons.account"
            item-text="longname"
            clearable
            :rules="rules.selectCompetitorRequired"
            required
          >
          </v-autocomplete>
          <!-- Competitor 2 -->
          <v-autocomplete
            v-model="data.competitor_2"
            return-object
            outlined
            dense
            label="Competitor #2"
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
import { mdiClose, mdiAccount, mdiAccountGroup } from '@mdi/js';
import { postTeamToCompetition } from '@/api/team';
import { getCompetitors } from '@/api/competitor';

export default Vue.extend({
    name: 'ModalAddTeamForCompetition',
    data () {
      return {
        icons: {
          close: mdiClose,
          account: mdiAccount,
          accountGroup: mdiAccountGroup
        },
        creationLoading : false,
        dialog: false,
        menu: null,
        competitors_available: [],
        competition: {},
        data: {
          compititon: null,
          competitor_1: null,
          competitor_2: null,
          name: null,
        },
        rules:{
          selectCompetitorRequired: [v => !!v || 'Competitor is required'],
        }
      }
    },
    methods: {
      open(competition) {
        // Set competition as property
        this.competition = competition;

        // Reset data
        this.data.competitor_1 = null;
        this.data.competitor_2 = null;
        this.data.name = null;
        this.data.competition = null;

        this.data.competition = this.competition;

        // Showing dialog
        this.dialog = true
        this.creationLoading = false
        
        
        getCompetitors({'exclude_competitors_in_competition_id': this.competition.id })
        .then(response => {
          this.competitors_available = response.data.items
        })

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      add() {
        this.creationLoading = true
        // TODO
        postTeamToCompetition(this.data).then(() => {
          // console.log(response);
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