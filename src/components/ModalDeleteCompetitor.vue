<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="540" @keydown.esc="dialog = false">
      <v-card align="left">
        
        <v-card-title class="headline">Confirm deletion
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
          Are you sure that you want to delete <span class="font-weight-bold">{{ firstname }} {{ lastname}}</span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn class="text-none" style="font-weight: normal; letter-spacing: normal;" depressed outlined color="grey" @click="cancel()">Cancel</v-btn>
          <v-btn class="text-none" style="font-weight: bold; letter-spacing: normal;" depressed dark color="error lighten-1" @click="agree()">Delete</v-btn>
        </v-card-actions >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mdiClose } from '@mdi/js'
export default Vue.extend({
    name: 'ModalDeleteCompetitor',
    data () {
      return {
        closeIcon: mdiClose,
        dialog: false,
        firstname: '',
        lastname: '',
      }
    },
    methods: {
      open(firstname, lastname) {
        this.dialog = true
        this.firstname = firstname
        this.lastname = lastname
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      agree() {
        this.resolve(true)
        this.dialog = false
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
      }
    }
});
</script>