<template>
    <v-container fluid>
        <h1>{{ editing ? 'Edit' : 'Add' }} competitor</h1>
        <v-layout column>
            <v-card flat rounded="0">
                <v-card-title>
                  Profile
                </v-card-title>
                <v-card-text>
                  <v-row justify="center">
                    <v-col class="col-md-6 col-12">
                      <v-form>
                        <v-row justify="center" align="center">
                          <Avataaars
                            :width="widthAvatar"
                            :height="heightAvatar"
                            :avatarOptions="form.avatarOptions"
                          ></Avataaars>
                          
                          <v-btn
                            class="text-none"
                            depressed     
                            color="primary"
                            @click="changeAvatar"
                            >
                            Modify avatar
                          </v-btn>
                        </v-row>
                        <ModalAvatar ref="avatarModal"></ModalAvatar>

                        <!-- Firstname -->
                        <v-text-field
                          outlined
                          :prepend-icon="accountIcon"
                          v-model="form.firstName"
                          label="Firstname"
                          class="mb-4">
                        </v-text-field>

                        <!-- Lastname -->
                        <v-text-field
                          outlined
                          :prepend-icon="accountIcon"
                          v-model="form.lastName"
                          label="Lastname"
                          class="mb-4">
                        </v-text-field>

                        <!-- Nationality -->
                        <v-autocomplete
                          outlined
                          :items="countries"
                          :prepend-icon="nationalityIcon"
                          item-text="name"
                          item-value="code"
                          clearable
                        >
                          <template v-slot:item="data">
                            <v-list-item-avatar tile>
                              <v-img max-width="20" max-height="15" :src="getCountryFlag(data.item.code)"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content v-text="data.item.name"></v-list-item-content>
                          </template>
                        </v-autocomplete>

                        <!-- Birth date -->
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
                              v-model="form.birthday_date"
                              outlined
                              label="Birthday date"
                              :prepend-icon="calendarIcon"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            ref="picker"
                            v-model="form.birthday_date"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1930-01-01"
                            @change="saveBirthdayDate"
                          ></v-date-picker>
                        </v-menu>

                        <!-- Gender -->
                        <v-radio-group
                          v-model="form.gender.name"
                          mandatory
                        >
                          <template v-slot:label>
                            <div><v-icon>{{ genderIcon }}</v-icon> Gender</div>
                          </template>
                          <v-radio
                            label="Male"
                            value="male"
                          ></v-radio>
                          <v-radio
                            label="Female"
                            value="female"
                          ></v-radio>
                          <v-radio
                            label="Other"
                            value="other"
                          ></v-radio>
                        </v-radio-group>

                        <!-- Height -->
                        <v-text-field
                          outlined
                          v-model="form.height"
                          :prepend-icon="heightIcon"
                          label="Height"
                          class="mb-4">
                        </v-text-field>

                        <!-- Weight -->
                        <v-text-field
                          outlined
                          v-model="form.weight"
                          :prepend-icon="weightIcon"
                          label="Weight"
                          class="mb-4">
                        </v-text-field>

                        <v-row>
                        <!-- Buttons -->
                          <v-btn
                            class="text-none"
                            depressed
                            outlined
                            color="primary"
                            @click="previous"
                          >
                            Cancel
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            class="text-none"
                            depressed
                            color="primary"
                            @click="handleActionButton"
                          >
                            <v-icon
                              left
                              dark
                            >
                              {{ editing ? saveIcon : accountCreateIcon }}
                            </v-icon>
                            {{ editing ? 'Save' : 'Create' }}
                          </v-btn>
                        </v-row>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
import { mdiWeight, mdiHumanMaleHeight, mdiCalendar, mdiGenderMaleFemale, mdiEarth, mdiAccount, mdiContentSave, mdiAccountPlus } from '@mdi/js'
import ModalAvatar from '@/components/avatar/ModalAvatar.vue'
import { putCompetitor } from '@/api/competitor'
import Avataaars from 'vue-avataaars'
import countries from '@/data/countries'

export default {
  name: 'competitor',
  components: {
    ModalAvatar,
    Avataaars
  },
  data() {
    return {
        loading: false,
        countries: countries,
        saveIcon: mdiContentSave,
        accountIcon: mdiAccount,
        calendarIcon: mdiCalendar,
        accountCreateIcon: mdiAccountPlus,
        heightIcon: mdiHumanMaleHeight,
        weightIcon: mdiWeight,
        genderIcon: mdiGenderMaleFemale,
        nationalityIcon: mdiEarth,
        menu: null,
        widthAvatar: 200,
        heightAvatar: 200,
        form: {
            firstName: '',
            lastName: '',
            nationality: {
              name: ''
            },
            birthday_date: '',
            gender: {
              name: ''
            },
            height: 0,
            weight: 0,
            avatarOptions: null
        },
    };
  },
  props: {
    editing: Boolean,
  },
  methods: {
    getCountryFlag(code) {
      return "https://flags.fmcdn.net/data/flags/mini/" + code.toLowerCase()  + ".png";
    },
    openAvatarPicker() {
        this.showAvatarPicker = true
    },
    previous() {
      // Go previous, cancel has been clicked
      this.$router.go(-1);
    },
    saveBirthdayDate(date) {
      this.$refs.menu.save(date)
    },
    handleActionButton() {
      // Handle the action button
      if ( this.editing && this.editing == true ) {
        this.updateCompetitor()
      } else {
        this.createCompetitor()
      }
    },
    createCompetitor() {
      // Create a competitor (called by handleActionButton method)
    },
    updateCompetitor() {
      // Update a competitor (called by handleActionButton method)
      putCompetitor(this.form).then(response => {
        console.log(response);
        this.$router.push({name: 'competitors'})
      })
    },
    changeAvatar() {
      // Open a dialog to change the avatar
      this.$refs.avatarModal
        .open(this.form.avatarOptions)
        .then((resolve) => {
          if (resolve == true) {
            this.form.avatarOptions = this.$refs.avatarModal.avatarOptions
          }
        })
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