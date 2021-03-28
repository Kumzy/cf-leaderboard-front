<template>
  <v-container fluid>
    <!-- TODO: Add competition name -->
    <h1>{{this.competition.name }} - Scores</h1>
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
          dense
          outlined
          :prepend-inner-icon="searchIcon"
          clearable
          @input="searchGrid"
        >
        </v-text-field>
        
      </v-col>

      <!-- Right group -->
      <v-col class="text-right">

        <!-- Button refresh
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
        </v-btn> -->

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
            {{ icons.scoreboard }}
          </v-icon>
          Add Result
        </v-btn> 
        <ModalCreateResult ref="createResultModal"></ModalCreateResult>
          
      </v-col>
    </v-row>

    <ag-grid-vue
      id="competitionGrid"
      style="width: 100%;"
      class="ag-theme-material mt-5"
      :columnDefs="columnDefs"
      :domLayout="domLayout"
      :rowData="rowData"
      :gridOptions="gridOptions">
      </ag-grid-vue>

  </v-container>

</template>

<script>
import { getToken } from '@/utils/auth';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue';
import { mdiMagnify, mdiRefresh, mdiAccountPlus, mdiGenderFemale, mdiScoreboard } from '@mdi/js';
import btnCellRendererCompetitionScores from '@/renderers/BtnCellRendererCompetitionScores.vue';
import { getScores } from '@/api/score';
import { getCompetition } from '@/api/competition';
import ModalCreateResult from '@/components/score/ModalCreateResult.vue'

export default {
  name: 'competition_scores',
  components: {
    AgGridVue,
    ModalCreateResult
  },
  data() {
    return {
      icons: {
        scoreboard: mdiScoreboard
      },
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
        overlayNoRowsTemplate: 'No results found',
      },
      data: {},
      competition_id: null,
      competition: {},
      genders: [],
      logged: false,
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
      this.getScores(this.competition_id);
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
        headerName: 'Competitor', 
        field: 'competitor', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.competitor.longname',
      },
      { 
        headerName: 'Event', 
        field: 'event', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.event.name',
      },
      { 
        headerName: 'Category', 
        field: 'category', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.category.name',
      },
      { 
        headerName: 'Result/Reps', 
        field: 'result', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.result',
      },
      { 
        headerName: 'Time', 
        field: 'time', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          const minutes = Math.floor(params.value / 60);
          const seconds = params.value - minutes * 60;
          const result = minutes.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + seconds.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false })
          return result;
        }
      },
      { 
        headerName: 'Tie-break', 
        field: 'tiebreak', 
        width: 200,
        minWidth: 80,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          const minutes = Math.floor(params.value / 60);
          const seconds = params.value - minutes * 60;
          const result = minutes.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + seconds.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false })
          return result;
        }
      },
      { 
        headerName: 'Action', 
        field: 'action', 
        width: 200,
        minWidth: 170,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        cellRendererFramework: btnCellRendererCompetitionScores,
        cellRendererParams: { competition_id: this.competition_id, logged: this.logged },
      }
    ];
    this.rowData = [
    ];
    
  },
  methods: {
    windowResized() {
      this.gridApi.sizeColumnsToFit();
    },
    getScores(id) {
      this.refreshLoading = true;
      getScores(id).then(response => {
        this.rowData = response.data.items;
        // this.rowData = this.data.competitors
        this.gridApi.sizeColumnsToFit();
        this.refreshLoading = false
      })
    },
    refreshData() {
      this.getScores(this.competition_id);
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    getCompetition(id) {
      this.refreshLoading = true;
      getCompetition(id).then(response => {
        this.competition = response.data.item;
        this.$route.meta.title = this.competition.name + ' scores';
        // console.log(this.competition)
      })
    },
    addResult() {
      this.$refs.createResultModal
        .open(this.competition)
        .then((resolve) => {
          if (resolve && resolve === true) {
            this.refreshData();
          }
        })
    }
  }
};

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