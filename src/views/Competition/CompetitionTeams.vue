<template>
  <v-container fluid>
    <h1>{{ this.data.name }} - Team list</h1>
    <v-row align="center">
      <!-- Left group -->
      <v-col 
        class="d-flex"
        cols="12"
        sm="3"
      >
        <v-text-field
          v-model="search"
          label="Search for a team/competitor"
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
          @click="addTeam"
        >
          <v-icon
            left
            dark
          >
            {{ addAccountIcon }}
          </v-icon>
          Add Team
        </v-btn> 
        <ModalAddTeamToCompetition ref="addTeamToCompetitionModal"></ModalAddTeamToCompetition>
          
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
import { mdiMagnify, mdiRefresh, mdiAccountPlus, mdiGenderFemale  } from '@mdi/js';
// import btnCellRendererCompetitionCompetitors from '@/renderers/BtnCellRendererCompetitionCompetitors.vue';
import { getCompetition } from '@/api/competition';
import ModalAddTeamToCompetition from '@/components/competition/ModalAddTeamToCompetition.vue'

export default {
  name: 'competition_competitors',
  components: {
    AgGridVue,
    ModalAddTeamToCompetition
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
        overlayNoRowsTemplate: 'No teams found',
      },
      data: {},
      competition_id: null,
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
        headerName: 'Team name', 
        field: 'name', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true 
      },
      { 
        headerName: 'Competitor #1', 
        field: 'competitors', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.competitors[0].longname',
      },
      { 
        headerName: 'Competitor #2', 
        field: 'competitors', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.competitors[1].longname',
      },
      { 
        headerName: 'Profile', 
        field: 'profile', 
        width: 200,
        minWidth: 170,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        // cellRendererFramework: btnCellRendererCompetitionCompetitors,
        // cellRendererParams: {logged: this.logged},
      }
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
        this.$route.meta.title = this.data.name + ' teams';
        this.rowData = this.data.teams
        this.gridApi.sizeColumnsToFit();
        this.refreshLoading = false
      })
    },
    refreshData() {
      this.getCompetition(this.competition_id);
    },
    generate() {
     
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    addTeam() {
      this.$refs.addTeamToCompetitionModal
        .open(this.data)
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