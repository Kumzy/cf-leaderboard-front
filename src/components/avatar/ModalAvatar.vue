<template>
    <v-container fluid>
      <v-dialog v-model="dialog" persistent max-width="1200" @keydown.esc="dialog = false">
        <v-card>
          <!-- Header -->
          <v-card-title class="headline">Avatar generation
          <v-spacer></v-spacer>
          
          <v-btn
            class="text-none"
            small
            depressed
            color="secondary"
            @click="randomize()"
          >
            Random
          </v-btn>
          
          
          <v-btn
            class="ml-4"
            icon
            x-small
            @click="cancel()"
          >
            <v-icon>{{ closeIcon }}</v-icon>
          </v-btn>
          </v-card-title>
          <!-- Separator -->
          <v-divider></v-divider>

          <!-- Body -->
          <v-card-text>
            <v-container>
              <v-row>
                <!-- Avatar side -->
                <v-col class="text-center col-sm-12 col-md-4">
                  <avataaars
                    :avatarOptions="avatarOptions"
                    ></avataaars>
                    
                </v-col>

                <!-- Right pane -->
                <v-col class="col-sm-12 col-md-8">
                  
                  <v-card flat>
                    <v-card-title class="headline">
                      <v-tabs v-model="tabs" grow>
                        <v-tab class="text-none">Body & Background</v-tab>
                        <v-tab class="text-none">Face</v-tab>
                        <v-tab class="text-none">Accessories</v-tab>
                        <v-tab class="text-none">Hair or Top</v-tab>
                        <v-tab class="text-none">Clothes</v-tab>
                      </v-tabs>
                      
                    </v-card-title>
                    
                    <v-tabs-items v-model="tabs">
                      <!-- Body & Background -->
                      <v-tab-item justify="left">
                        <v-card flat height="200">
                          <p></p>
                          <!-- Skin color -->
                          <v-select
                            :items="options[0].labels[2].options"
                            v-model="avatarOptions.skinColor"
                            outlined
                            label="Skin Color"
                            dense
                          ></v-select>

                          <!-- Background type -->
                          <v-radio-group
                            v-model="avatarOptions.backgroundType"
                            row
                          >
                            <template v-slot:label>
                              <div>Background Type</div>
                            </template>
                            <v-radio
                              label="Circle"
                              value="circle"
                            ></v-radio>
                            <v-radio
                              label="Transparent"
                              value="transparent"
                            ></v-radio>
                          </v-radio-group>

                          <!-- Background color -->
                          <v-select
                            v-model="avatarOptions.backgroundColor"
                            :items="options[0].labels[1].options"
                            outlined
                            label="Background Color"
                            dense
                          ></v-select>
                        </v-card>
                      </v-tab-item>

                      <!-- Face -->
                      <v-tab-item justify="left">
                        <v-card flat height="auto">
                          <p></p>
                          <!-- Eyes tpe -->
                          <v-select
                            :items="options[1].labels[1].options"
                            v-model="avatarOptions.eyesType"
                            outlined
                            label="Eyes Type"
                            dense
                          ></v-select>

                          <!-- Eyebrow Type -->
                          <v-select
                            v-model="avatarOptions.eyebrowType"
                            :items="options[1].labels[0].options"
                            outlined
                            label="Eyebrow Type"
                            dense
                          ></v-select>

                          <!-- Mouth Type -->
                          <v-select
                            v-model="avatarOptions.mouthType"
                            :items="options[1].labels[2].options"
                            outlined
                            label="Mouth Type"
                            dense
                          ></v-select>

                          <!-- Facial Hair Type -->
                          <v-select
                            v-model="avatarOptions.facialHairType"
                            :items="options[1].labels[3].options"
                            outlined
                            label="Facial Hair Type"
                            dense
                          ></v-select>

                          <!-- Facial Hair Color -->
                          <v-select
                            v-model="avatarOptions.facialHairColor"
                            :items="options[1].labels[4].options"
                            outlined
                            label="Facial Hair Color"
                            dense
                          ></v-select>
                        </v-card>
                      </v-tab-item>

                      <!-- Accessories -->
                      <v-tab-item justify="left">
                        <v-card flat height="auto">
                          <p></p>
                          <!-- Accessories -->
                          <v-select
                            :items="options[2].labels[0].options"
                            v-model="avatarOptions.accessoriesType"
                            outlined
                            label="Accessories"
                            dense
                          ></v-select>
                        </v-card>
                      </v-tab-item>

                      <!-- Hair or Top -->
                      <v-tab-item justify="left">
                        <v-card flat height="auto">
                          <p></p>
                          <!-- Top Type -->
                          <v-select
                            :items="options[3].labels[0].options"
                            v-model="avatarOptions.topType"
                            outlined
                            label="Top Type"
                            dense
                          ></v-select>

                          <!-- Top Color -->
                          <v-select
                            :items="options[3].labels[1].options"
                            v-model="avatarOptions.topColor"
                            outlined
                            label="Top Color"
                            dense
                          ></v-select>
                        </v-card>
                      </v-tab-item>

                      <!-- Clothes -->
                      <v-tab-item justify="left">
                        <v-card flat height="auto">
                          <p></p>
                          <!-- Clothes Type -->
                          <v-select
                            :items="options[4].labels[0].options"
                            v-model="avatarOptions.clothesType"
                            outlined
                            label="Clothes Type"
                            dense
                          ></v-select>

                          <!-- Clothes Color -->
                          <v-select
                            :items="options[4].labels[1].options"
                            v-model="avatarOptions.clothesColor"
                            outlined
                            label="Clothes Color"
                            dense
                          ></v-select>

                          <!-- Graphic Type -->
                          <template v-if="avatarOptions.clothesType === 'graphicShirt'">
                            <v-select
                            :items="options[4].labels[2].options"
                            v-model="avatarOptions.clothesGraphicsType"
                            outlined
                            label="Graphic"
                            dense
                            ></v-select>
                          </template>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card>

                </v-col>
              </v-row>
            </v-container>
          </v-card-text>


          <!-- Bottom actions -->
          <v-divider></v-divider>
          <v-card-actions >
            <v-spacer></v-spacer>
            <v-btn class="text-none" depressed outlined color="grey" @click="cancel()">Cancel</v-btn>
            <v-btn class="text-none"
            depressed
            dark
            color="primary"
            @click="save()">
            <v-icon
              left
              dark
            >
              {{ saveIcon }}
            </v-icon>
            Save</v-btn>
          </v-card-actions >

        </v-card>
      </v-dialog>
    </v-container>
</template> 

<script>
import Vue from "vue";
import { mdiClose, mdiContentSave } from '@mdi/js'
import optionsJSON from './avataaarsOptions.json'
import { camelCase } from "lodash"
import Avataaars from 'vue-avataaars'

export default Vue.extend({
    name: 'ModalAvatar',
    components: {
      Avataaars
    },
    data () {
      return {
        closeIcon: mdiClose,
        saveIcon: mdiContentSave,
        options: optionsJSON.tabs,
        dialog: false,
        tabs: null,
        avatarOptions: {
          backgroundType: null,
          backgroundColor: null,
          skinColor: null,
          eyesType: null,
          eyebrowType: null,
          mouthType: null,
          facialHairType: null,
          facialHairColor: null,
          accessoriesType: null,
          topType: null,
          topColor: null,
          clothesType: null,
          clothesColor: null,
          clothesGraphicsType: null
        }
        
      }
    },
    beforeMount() {
      this.avatarOptions.backgroundColor = this.options[0].labels[1].default;
      this.avatarOptions.backgroundType = this.options[0].labels[0].default;
      this.avatarOptions.skinColor = this.options[0].labels[2].default;

      this.avatarOptions.eyesType = this.options[1].labels[1].default;
      this.avatarOptions.eyebrowType = this.options[1].labels[0].default;
      this.avatarOptions.mouthType = this.options[1].labels[2].default;
      this.avatarOptions.facialHairType = this.options[1].labels[3].default;
      this.avatarOptions.facialHairColor = this.options[1].labels[4].default;

      this.avatarOptions.accessoriesType = this.options[2].labels[0].default;

      this.avatarOptions.topType = this.options[3].labels[0].default;
      this.avatarOptions.topColor = this.options[3].labels[1].default;

      this.avatarOptions.clothesType = this.options[4].labels[0].default;
      this.avatarOptions.clothesColor = this.options[4].labels[1].default;
      this.avatarOptions.clothesGraphicsType = this.options[4].labels[2].default;
    },
    methods: {
      open(avatarOptions) {
        this.dialog = true
        if ( avatarOptions == null ) {
          this.randomize()
        } else {
          //TODO: to improve, use parse/stringify to create a new object
          this.avatarOptions = JSON.parse(JSON.stringify(avatarOptions));
        }
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      save() {
        this.resolve(true)
        this.dialog = false
      },
      cancel() {
        this.resolve(false)
        this.dialog = false
      },
      randomize() {
        this.options.forEach(option => {
          option.labels.forEach(label => {
            this.avatarOptions[camelCase(label.name)] = label.options[Math.floor(Math.random() * Math.floor(label.options.length))]
          })
        })
      
      }
    }
});
</script>

<style lang="scss">  
  .v-btn__content {
    font-weight: normal;
    letter-spacing: normal;
  }
  
  .v-tab {
    font-weight: normal;
    letter-spacing: normal;
  }
</style>