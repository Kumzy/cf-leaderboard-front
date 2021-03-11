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
                            v-if="form.avatar"
                            :width="widthAvatar"
                            :height="heightAvatar"
                            :avatarOptions="form.avatar"
                          ></Avataaars>
                          
                          <v-btn
                            v-if="logged"
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
                          v-model="form.firstname"
                          label="Firstname"
                          class="mb-4">
                        </v-text-field>

                        <!-- Lastname -->
                        <v-text-field
                          outlined
                          :prepend-icon="accountIcon"
                          v-model="form.lastname"
                          label="Lastname"
                          class="mb-4">
                        </v-text-field>

                        <!-- Nationality -->
                        <v-autocomplete
                          outlined
                          v-model="form.nationality.id"
                          :items="countries"
                          :prepend-icon="nationalityIcon"
                          item-text="name"
                          item-value="id"
                          item-key="id"
                          clearable
                        >
                          <template v-slot:item="data">
                            <v-list-item-avatar tile>
                              <v-img max-width="20" max-height="15" :src="getCountryFlag(data.item.iso2)"></v-img>
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
                            v-model="form.gender.id"
                            row
                            required
                            :rules="rules.genderRequired"
                            class="mb-5"
                          >
                            <template v-slot:label>
                              <div style='font-size: 16px;'><v-icon>{{ genderIcon }}</v-icon> Gender</div>
                            </template>
                            <v-radio
                              v-for="gender in genders"
                              :key="gender.id"
                              :label="gender.name"
                              :value="gender.id"
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
                            v-if="logged"
                            class="text-none"
                            depressed
                            color="primary"
                            @click="handleActionButton"
                            :loading="loading"
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
import { putCompetitor, getCompetitor, postCompetitor } from '@/api/competitor'
import { getGenders } from '@/api/gender';
import { getCountries } from '@/api/countries';
import Avataaars from 'vue-avataaars'
//import countries from '@/data/countries'
import { getToken } from '@/utils/auth';

export default {
  name: 'competitor',
  components: {
    ModalAvatar,
    Avataaars
  },
  data() {
    return {
        loading: false,
        logged: false,
        competitor_id: null,
        countries: [],
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
        genders: [],
        form: {
            firstname: '',
            lastname: '',
            nationality: {
              id: ''
            },
            birthday_date: '',
            gender: {
              id: ''
            },
            height: 0,
            weight: 0,
            avatar: null,
        },
        rules:{
          selectEventRequired: [v => !!v || 'Event is required'],
          selectCompetitorRequired: [v => !!v || 'Competitor is required'],
          genderRequired: [v => !!v || 'You must select a gender'],
          resultRequired: [
            v => !!v || 'Result is required',
            v => Number.isInteger(Number(v)) || 'You must enter a number'
            ],
        }
    };
  },
  props: {
    editing: Boolean,
  },
  created() {
    const hasToken = getToken()
    if (hasToken) {
      this.logged = true;
    }
    this.getGenders();
    this.getCountries();
    if (this.$route.params.id) {
      // console.log('editing')
      this.competitor_id = this.$route.params.id;
      if (this.competitor_id && this.competitor_id !== undefined && this.competitor_id !== null ) {
        this.getCompetitor(this.competitor_id);
      }
    }
 
  },
  methods: {
    getCountries() {
      getCountries().then(response => {
        this.countries = response.data.items;
      })
    },
    getGenders() {
      getGenders().then(response => {
        this.genders = response.data.items;
      })
    },
    getCompetitor(id) {
      // this.refreshLoading = true;
      getCompetitor(id).then(response => {
        this.form = response.data.item;
        // this.categories = this.data.categories.map(e => e.name).join(' / ')
        // this.competitors_amount = this.data.competitors.length
        // this.events_amount = this.data.events.length
        // this.refreshLoading = false
      })
    },
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
      this.loading = true;
      postCompetitor(this.form).then(() => {
        this.$router.push({name: 'competitors'})
      })
      .finally(
        this.loading = false
      )
    },
    updateCompetitor() {
      // Update a competitor (called by handleActionButton method)
      this.loading = true;
      putCompetitor(this.form).then(() => {
        this.$router.push({name: 'competitors'})
      })
      .finally(
        this.loading = false
      )
    },
    changeAvatar() {
      // Open a dialog to change the avatar
      this.$refs.avatarModal
        .open(this.form.avatar)
        .then((resolve) => {
          if (resolve == true) {
            this.form.avatar = this.$refs.avatarModal.avatarOptions
            console.log(this.form.avatar)
            this.$forceUpdate();
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