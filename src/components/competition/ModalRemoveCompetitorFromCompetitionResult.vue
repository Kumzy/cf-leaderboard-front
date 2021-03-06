<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="540" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">Create competition
        <v-spacer></v-spacer>
        <v-btn
          icon
          x-small
          @click="cancel()"
        >
          <v-icon>{{ closeIcon }}</v-icon>
        </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <p></p>
        <v-card-text>
          <!-- Competition name -->
          <v-text-field
            outlined
            dense
            label="Competition name"
            v-model="data.name"
          ></v-text-field>

          <!-- Start date -->
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="data.date_start"
                outlined
                dense
                label="Start date"
                :prepend-icon="calendarIcon"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="data.date_start"
              min="1930-01-01"
              @change="saveStartDate"
            ></v-date-picker>
          </v-menu>
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
import { mdiClose } from '@mdi/js';
import { postCompetition } from '@/api/competition';

export default Vue.extend({
    name: 'ModalRemoveCompetitorFromCompetitionResult',
    data () {
      return {
        closeIcon: mdiClose,
        creationLoading : false,
        dialog: false,
        menu: null,
        data: {
          name: null,
          date_start: null,
        }
      }
    },
    methods: {
      open() {
        this.dialog = true
        this.creationLoading = false
        this.data.name = null;
        this.data.date_start = null;
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      create() {
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