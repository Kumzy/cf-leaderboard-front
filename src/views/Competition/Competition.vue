<template>
  <div>
    <h1>Competition {{ this.data.name }}</h1>
      <v-container fill-height fluid>
        <v-row dense justify="center" align="center">
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
                  {{ this.data.competitors.length }} competitors
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
                  {{ this.data.events.length }} events
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    class="text-none"
                    depressed
                    @click="clickEvents"
                  >
                    Events
                  </v-btn>
                </v-card-title>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script>
import { getCompetition } from '@/api/competition';

export default {
  name: 'competition',
  components: {

  },
  data() {
    return {
      data: {},
      competition_id: null,
    };
  },
  created() {
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
        this.refreshLoading = false
      })
    },
    clickCompetitors() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_competitors', params: { id: this.competition_id } });
      }
    },
    clickLeaderboard() {
      if (this.competition_id) {
        this.$router.push({ name: 'competition_leaderboard', params: { id: this.competition_id } });
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