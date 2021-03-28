<template>
  <v-container fluid>
    <h1>Competition {{ this.data.name }} - Leaderboard</h1>
      <v-row align="center">
        <!-- Left group -->
        <v-col 
          class="d-flex"
          cols="12"
          sm="3"
        >
          <!-- <v-text-field
            v-model="search"
            label="Search for a competitor"
            solo
            dense
            :prepend-inner-icon="searchIcon"
            clearable
            @input="searchGrid"
          >
          </v-text-field> -->
          <!-- Gender -->
          <v-select
            :items="data.genders"
            v-model="gender"
            item-text="name"
            return-object
            label="Division"
            dense
            outlined
            @change="genderChanged"
          ></v-select>
          
        </v-col>

        <!-- Right group -->
        <v-col class="text-right">

          <!-- Button refresh -->
          <v-btn
            :loading="refreshLoading"
            :disabled="refreshLoading"
            color="blue-grey"
            class="text-none ml-4 white--text"
            style="letter-spacing: normal;"
            @click="refreshData"
          >
            <v-icon
              left
              dark
            >
              {{ refreshIcon }}
            </v-icon>
            Refresh
          </v-btn>

          <!-- Button add -->
          <v-btn
            v-if="logged"
            class="text-none ml-4"
            style="letter-spacing: normal;"
            color="primary"
            @click="addResult"
          >
            <v-icon
              left
              dark
            >
              {{ addAccountIcon }}
            </v-icon>
            Add result
          </v-btn> 
          <ModalCreateResult ref="createResultModal"></ModalCreateResult>
           
        </v-col>
      </v-row>

    <ag-grid-vue
      id="competitionGrid"
      style="width: 100%;"
      class="ag-theme-material"
      :columnDefs="columnDefs"
      :tooltipShowDelay="tooltipShowDelay"
      :domLayout="domLayout"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :frameworkComponents="frameworkComponents">
      </ag-grid-vue>
   
  </v-container>

</template>

<script>
import { getToken } from '@/utils/auth';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue';
import { mdiMagnify, mdiRefresh, mdiAccountPlus, mdiGenderFemale  } from '@mdi/js';
import { getCompetition, getCompetitionLeaderboard } from '@/api/competition';
import { convertIntegerToTime } from '@/utils/time.js'
import ModalCreateResult from '@/components/score/ModalCreateResult.vue'
// import LeaderboardResultTooltip from '@/components/tooltips/leaderboardResultTooltip.vue';

export default {
  name: 'competition_leaderboard',
  components: {
    AgGridVue,
    ModalCreateResult
  },
  data() {
    return {
      calculateLoading: false,
      addAccountIcon: mdiAccountPlus,
      searchIcon: mdiMagnify,
      femaleIcon: mdiGenderFemale,
      refreshIcon: mdiRefresh,
      refreshLoading: false,
      align:'start',
      justify:'start',
      columnDefs: null,
      rowData: null,
      tooltipShowDelay: null,
      search: null,
      gridApi: null,
      gridOptions: {
        suppressRowTransform: true,     
        suppressCellSelection: true,
        overlayNoRowsTemplate: 'No results found',
      },
      frameworkComponents: null,
      data: {},
      competition_id: null,
      genders: [],
      gender: null,
      logged: false
    };
  },
  created() {
    const hasToken = getToken()
    if (hasToken) {
      this.logged = true;
    }
    // Link resize of window to the ag-grid
    window.addEventListener("resize", this.windowResized);
    this.competition_id = this.$route.params.id;
    if (this.competition_id && this.competition_id !== undefined && this.competition_id !== null ) {
      this.getCompetition(this.competition_id);
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.windowResized);
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
  },
  beforeMount() {
    this.domLayout = 'autoHeight';

    this.columnDefs = [
      { 
        headerName: 'Rank', 
        field: 'rank', 
        width: 75,
        minWidth: 50,
        maxWidth: 100,
        editable: false, 
        sortable: true, 
        resizable: true,
        suppressMovable: true ,
        headerTooltip: 'Determined by total points. The athlete with the fewest points wins.',
        valueGetter: 'data.rank', 
        cellStyle: {'font-weight': 'bold'}
      },
      { 
        headerName: 'Name', 
        field: 'name', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.longname', 
        tooltipField: 'competitor',
        // tooltipValueGetter: 'data.longname',
        // tooltipComponent: 'leaderboardResultTooltip',
      },
      { 
        headerName: 'Points', 
        field: 'points', 
        width: 75,
        minWidth: 50,
        maxWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        headerTooltip: 'The sum of an athlete\'s workout rankings. Based on a points-per-place ranking system.',
        valueGetter: 'data.total_points', 
      },
    ];
    this.rowData = [
    ];

    // this.tooltipShowDelay = 0;
    // this.frameworkComponents = { leaderboardResultTooltip: LeaderboardResultTooltip };
    
  },
  methods: {
    windowResized() {
      this.gridApi.sizeColumnsToFit();
    },
    getCompetition(id) {
      this.refreshLoading = true;
      getCompetition(id).then(response => {
        this.data = response.data.item;
        this.$route.meta.title = this.data.name + ' leaderboard';
        if (this.data.events.length > 0 ) {
          for(var i = 0; i < this.data.events.length; i++) {
            this.columnDefs.push({
              field: this.data.events[i].id,
              headerName: this.data.events[i].name,
              width: 200,
              minWidth: 170,
              editable: false,
              sortable: true,
              resizable:true,
              comparator: (valueA, valueB) => {
                let a = parseInt(valueA.substring(0,3))
                let b = parseInt(valueB.substring(0,3))
                if (a == b) return 0;
                return (a > b) ? 1 : -1;
              },
              suppressMovable: true,
              valueGetter: function(params) {
                var result = ''
                if ( params && params.colDef && params.colDef.field && params.data.scores.length > 0 ) {
                  params.data.scores.forEach( function( score ){
                    if ( score.event.id === params.colDef.field ) {
                      // result = 10;
                      if ( score.not_participated === true ) {
                        result =  ordinal_suffix_of(score.point) + ' (Not participated)'
                      }  else if( score.time != score.event.time_cap ) {
                        result =  ordinal_suffix_of(score.point) + ' ('+convertIntegerToTime(score.time)+') - '+score.category.name;
                      } else {
                        result =  ordinal_suffix_of(score.point) + ' ('+ score.result+' reps) - '+score.category.name;
                      }
                      
                    }
                  } );
                }
                return result;
              },
            });
          }
          this.gridOptions.api.setColumnDefs(this.columnDefs);
        }
        this.setDefaultGender()
        // this.gridApi.sizeColumnsToFit();
        this.refreshLoading = false
      })
      
    },
    getCompetitionLeaderboard(gender_id) {
      if (this.competition_id !== null && this.competition_id !== undefined && gender_id !== null && gender_id !== undefined ) {
         getCompetitionLeaderboard(this.competition_id,{'gender_id': gender_id })
         .then(response => {
          //  console.log(response)
           this.rowData = response.data.items
           this.gridApi.sizeColumnsToFit();
          //  this.gridApi.sizeColumnsToFit();
          //  this.$forceUpdate();
         })
      }
     
    },
    setDefaultGender() {
      if (this.data && this.data.genders.length > 0) {
        this.gender = this.data.genders[0]
        this.genderChanged()
      }
    },
    genderChanged() {
      if (this.gender !== null && this.gender !== undefined && 'id' in this.gender) {
        this.getCompetitionLeaderboard(this.gender.id)
      }
    },
    refreshData() {
      this.genderChanged()
    },
    generate() {
     
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    addResult() {
      this.$refs.createResultModal
        .open(this.data)
        .then((resolve) => {
          if (resolve && resolve === true) {
            this.refreshData();
          }
        })
    }
  }
};

// function wod_result_comparator(date1, date2, nodeA, nodeB, isInverted) {
//   console.log('comparator called')
//   if (date1 === null && date2 === null) {
//     return 0;
//   }
//   if (date1 === null) {
//     return isInverted ? 1 : -1;
//   }
//   if (date2 === null) {
//     return isInverted ? 1 : -1;
//   }
//   return date1 - date2;
// }

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

// function genderCellRenderer(params) {
//   if (params.value === "" || params.value === undefined || params.value === null || params.data.gender === null) {
//       return '';
//   } else {
//       var icon = `<v-icon>{{ mdiGenderFemale }}</v-icon>` // <img class="flag" border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' + {{ mdiGenderFemale }}`;
//       return icon + ' ' + params.value;
//   }
// }

</script>

<style lang="scss">  
  .ag-row-hover {
    /* putting in !important so it overrides the theme's styling as it hovers the row also */
    background-color: #dfdfff !important;
  }
  .ag-header-cell-text {
    flex: 1;
  }
  .text-center {
    text-align:'center';
  }
</style>