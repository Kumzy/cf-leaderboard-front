<template>
  <div>
    <h1>Competition {{ this.data.name }}</h1>

    <div class="filter-container">

      <v-row align="center">
        <!-- Left group -->
        <v-col 
          class="d-flex"
          cols="12"
          sm="3"
        >
          <v-text-field
            v-model="search"
            label="Search for a competitor"
            solo
            dense
            :prepend-inner-icon="searchIcon"
            clearable
            @input="searchGrid"
          >
          </v-text-field>
          
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
            class="text-none ml-4"
            style="letter-spacing: normal;"
            color="primary"
            @click="addScore"
          >
            <v-icon
              left
              dark
            >
              {{ addAccountIcon }}
            </v-icon>
            Add score
          </v-btn> 
          <ModalCreateScore ref="createScoreModal"></ModalCreateScore>
           
        </v-col>
      </v-row>

    <ag-grid-vue
      id="competitionGrid"
      style="width: 100%;"
      class="ag-theme-material"
      :columnDefs="columnDefs"
      :domLayout="domLayout"
      :rowData="rowData"
      :gridOptions="gridOptions">
      </ag-grid-vue>
    </div>
  </div>

</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue';
import { mdiMagnify, mdiRefresh, mdiAccountPlus, mdiGenderFemale  } from '@mdi/js';
import { getCompetition } from '@/api/competition';
import ModalCreateScore from '@/components/score/ModalCreateScore.vue'

export default {
  name: 'competition',
  components: {
    AgGridVue,
    ModalCreateScore
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
      search: null,
      gridApi: null,
      gridOptions: {
        suppressRowTransform: true,     
        suppressCellSelection: true,
        overlayNoRowsTemplate: 'No competitors found',
      },
      data: {},
      competition_id: null,
      genders: []
    };
  },
  created() {
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
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable: true,
        suppressMovable: true ,
        headerTooltip: 'Determined by total points. The athlete with the fewest points wins.'
      },
      { 
        headerName: 'Name', 
        field: 'name', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true 
      },
      { 
        headerName: 'Age',
        field: 'birthday_date',
        width: 100,
        minWidth: 80,
        editable: false,
        sortable: false,
        resizable: true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          // TODO: Move in a function
          var today = new Date();
          var birthDate = new Date(params.value);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
          {
              age--;
          }
          return age;
        }
      },
      { 
        headerName: 'Gender', 
        field: 'gender', 
        width: 200,
        minWidth: 80,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.gender.name',
        cellRenderer: function() {
          const propsObj = {
            props: {
              overlap: true,
              left: true,
              color: 'success',
            },
          };
          const icon = document.createElement('v-icon', { props: { color: 'success', large: true } }, mdiGenderFemale);
          const span = document.createElement('span', { slot: 'badge' }, '5');
          return document.createElement('v-badge', propsObj, [span, icon]);
        }
      },
      { 
        headerName: 'Points', 
        field: 'points', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        headerTooltip: 'The sum of an athlete\'s workout rankings. Based on a points-per-place ranking system.'
      },
    ];
    this.rowData = [
    ];
    
  },
  methods: {
    windowResized() {
      this.gridApi.sizeColumnsToFit();
    },
    getCompetition(id) {
      this.refreshLoading = true;
      getCompetition(id).then(response => {
        
        this.data = response.data.item;
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
              suppressMovable: true
            });
          }
          this.gridOptions.api.setColumnDefs(this.columnDefs);
        }
        this.rowData = this.data.competitors
        this.gridApi.sizeColumnsToFit();
        this.refreshLoading = false
      })
    },
    refreshData() {
      // this.getCompetitors()
    },
    generate() {
     
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    addScore() {
      this.$refs.createScoreModal
        .open(this.data)
        .then((resolve) => {
          if (resolve && resolve === true) {
            this.refreshData();
          }
        })
    }
  }
};

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