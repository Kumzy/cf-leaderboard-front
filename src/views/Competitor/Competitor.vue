<template>
    <v-container fluid>
        <h1>{{ editing ? 'Edit' : 'Add' }} Competitor</h1>
        <v-layout column>
            <v-card flat rounded="0">
                <v-card-title>
                  Profile
                </v-card-title>
                <v-card-text>
                  <v-row justify="center">
                    <v-col class="col-md-6 col-12">
                      <v-form>
                        <!-- Firstnaùe -->
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
                        <v-text-field
                          outlined
                          :prepend-icon="nationalityIcon"
                          v-model="form.nationality.name"
                          label="Nationality"
                          class="mb-4">
                        </v-text-field>

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
                            flat
                            outlined
                            color="primary"
                            @click="previous"
                          >
                            Cancel
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            class="text-none"
                            flat
                            depressed
                            color="primary"
                          >
                            <v-icon
                              left
                              dark
                            >
                              {{ saveIcon }}
                            </v-icon>
                            Save
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
import { mdiWeight, mdiHumanMaleHeight, mdiCalendar, mdiGenderMaleFemale, mdiEarth, mdiAccount, mdiContentSave } from '@mdi/js'
export default {
  name: 'competitor',
  data() {
    return {
        loading: false,
        saveIcon: mdiContentSave,
        accountIcon: mdiAccount,
        calendarIcon: mdiCalendar,
        heightIcon: mdiHumanMaleHeight,
        weightIcon: mdiWeight,
        genderIcon: mdiGenderMaleFemale,
        nationalityIcon: mdiEarth,
        menu: null,
        form: {
            firstName: 'John',
            lastName: 'Doe',
            nationality: {
              name: "France"
            },
            birthday_date: '1990-05-01',
            gender: {
              name: 'Male'
            },
            height: 179,
            weight: 80,
            avatar: 'MALE_CAUCASIAN_BLOND_BEARD'
        },
    };
  },
  props: {
    editing: Boolean,
  },
  methods: {
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
    },
    createCompetitor() {
      // Create a competitor
    },
  }
};

</script>

<style lang="scss">  
  .v-btn__content {
    font-weight: normal;
    letter-spacing: normal;
  }
</style>