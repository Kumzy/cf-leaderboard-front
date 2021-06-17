<template>
  <v-container fluid>
    <h1>Competition {{ this.data.name }}</h1>
    <v-row dense justify="center" align="center" class="mt-5">
      <v-col>
    
        <!-- Leaderboard -->
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn
              color="primary"
              class="text-none"
              depressed
              @click="clickLeaderboard"
            >
              Leaderboard
            </v-btn></v-card-title>
          </v-img>

        </v-card>
      </v-col>
      
      <!-- Competitors -->
      <v-col>
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              {{ this.competitors_amount }} competitors
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-none"
                depressed
                @click="clickCompetitors"
              >
                Competitors
              </v-btn>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col>

      <!-- Events -->
      <v-col>
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              {{ this.events_amount }} events - {{ this.categories }}
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-none"
                depressed
                disabled
                @click="clickEvents"
              >
                Events
              </v-btn>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense justify="center" align="center" class="mt-5">
      <v-col>
    
        <!-- Live -->
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn
              color="primary"
              class="text-none"
              depressed
              @click="clickLive"
            >
              Live
            </v-btn></v-card-title>
          </v-img>

        </v-card>
      </v-col>
      
      <!-- Competitors -->
      <v-col>
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              {{ this.teams_amount }} teams
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-none"
                depressed
                @click="clickTeams"
              >
                Teams
              </v-btn>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col>

      <!-- Events -->
      <!-- <v-col>
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              {{ this.events_amount }} events - {{ this.categories }}
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-none"
                depressed
                disabled
                @click="clickEvents"
              >
                Events
              </v-btn>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col> -->
    </v-row>

  </v-container>
</template>

<script>
import { getCompetition } from '@/api/competition';
import { getToken } from '@/utils/auth';

export default {
  name: 'competition',
  data() {
    return {
      data: {},
      logged: false,
      competition_id: null,
      categories: null,
      events_amount: 0,
      competitors_amount: 0,
      teams_amount: 0,
    };
  },
  created() {
    const hasToken = getToken()
    if (hasToken) {
      this.logged = true;
    }
    this.competition_id = this.$route.params.id;
    if (this.competition_id && this.competition_id !== undefined && this.competition_id !== null ) {
      this.getCompetition(this.competition_id);
    }
  },
  methods: {
    getCompetition(id) {
      this.refreshLoading = true;
      getCompetition(id).then(response => {
        this.data = response.data.item;
        this.$route.meta.title = this.data.name;
        this.categories = this.data.categories.map(e => e.name).join(' / ')
        this.competitors_amount = this.data.competitors.length
        this.teams_amount = this.data.teams.length
        this.events_amount = this.data.events.length
        this.refreshLoading = false
      })
    },
    clickCompetitors() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_competitors', params: { id: this.competition_id } });
      }
    },
    clickTeams() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_teams', params: { id: this.competition_id } });
      }
    },
    clickLeaderboard() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_leaderboard', params: { id: this.competition_id } });
      }
    },
    clickLive() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_live', params: { id: this.competition_id } });
      }
    },
    clickEvents() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_events', params: { id: this.competition_id } });
      }
    }
  }
};

</script>

<style lang="scss">  
  .v-btn__content {
    font-weight: normal;
    letter-spacing: normal;
  }
</style>