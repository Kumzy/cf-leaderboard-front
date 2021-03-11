<template>
  <v-container fluid>
    <h1>Competitions</h1>

    <v-alert
      dismissible
      :value="alert"
      type="error"
    >
      {{ alertText }}
    </v-alert>

    <v-row align="center">
      <!-- Left group -->
      <v-col 
        class="d-flex"
        cols="12"
        sm="3"
      >
        
        
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
            {{ icons.refresh }}
          </v-icon>
          Refresh
        </v-btn>

        <!-- Button add -->
        <v-btn
          v-if="logged"
          class="text-none ml-4"
          style="letter-spacing: normal;"
          color="primary"
          @click="addCompetition"
        >
          <v-icon
            left
            dark
          >
            {{ icons.plus }}
          </v-icon>
          Create competition
        </v-btn> 
        <ModalCreateCompetition ref="createModal"></ModalCreateCompetition>
      </v-col>
    </v-row>

  <ag-grid-vue
    id="competitionsGrid"
    style="width: 100%;"
    class="ag-theme-material mt-10"
    :columnDefs="columnDefs"
    :domLayout="domLayout"
    :rowData="rowData"
    :gridOptions="gridOptions">
    <!-- :frameworkComponents="frameworkComponents"> -->
    </ag-grid-vue>
  
  </v-container>
</template>

<script>
import { getToken } from '@/utils/auth';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue';
import btnCompetitionCellRenderer from '@/renderers/BtnCompetitionCellRenderer.vue';
import { mdiRefresh, mdiPlus  } from '@mdi/js';
import { getCompetitions } from '@/api/competition';
import ModalCreateCompetition from '@/components/competition/ModalCreateCompetition.vue'

export default {
  name: 'competitions',
  components: {
    AgGridVue,
    ModalCreateCompetition
  },
  data() {
    return {
      alert: false,
      alertText: null,
      calculateLoading: false,
      icons : {
        plus: mdiPlus,
        refresh: mdiRefresh
      },
      refreshLoading: false,
      columnDefs: null,
      rowData: null,
      gridApi: null,
      gridOptions: {
        suppressRowTransform: true,     
        suppressCellSelection: true,
        overlayNoRowsTemplate: 'No competitions found',
        components: {
          countryCellRenderer: countryCellRenderer,
        }
      },
      logged: false
    };
  },
  created() {
    // Link resize of window to the ag-grid
    const hasToken = getToken()
    if (hasToken) {
      this.logged = true;
    }
    window.addEventListener("resize", this.windowResized);
    this.getCompetitions();
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
        headerName: 'Name', 
        field: 'name', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true 
      },
      { 
        headerName: 'Start date', 
        field: 'date_start', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true 
      },
      { 
        headerName: '# Competitors', 
        field: 'competitors', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          if (params.value === "" || params.value === undefined || params.value === null || params.value.length == 0) {
            return '-';
          } else {
            return params.value.length;
          }
        }
      },
      { 
        headerName: 'Categories',
        field: 'categories',
        width: 200,
        minWidth: 80,
        editable: false,
        sortable: false,
        resizable:true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          if (params.value === "" || params.value === undefined || params.value === null || params.value.length == 0) {
            return '-';
          } else if (params.value.length > 0) {
            return params.value.map(e => e.name).join(' / ');
          } else {
            return '-';
          }
        }
      },
      { 
        headerName: 'Actions', 
        field: 'actions', 
        width: 200,
        minWidth: 170,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        cellRendererFramework: btnCompetitionCellRenderer,
      }
    ];
    this.rowData = [
    ];
    
  },
  methods: {
    windowResized() {
      this.gridApi.sizeColumnsToFit();
    },
    getCompetitions() {
      this.refreshLoading = true;
      getCompetitions().then(response => {
        this.rowData = response.data.items
        this.gridApi.sizeColumnsToFit();
        //this.refreshLoading = false
      })
      .catch(e => {
        this.alertText = e
        this.alert = true; 
        setTimeout(() => this.alert = false, 5000);
      })
      .finally(
        this.refreshLoading = false
      )
    },
    refreshData() {
      this.getCompetitions()
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    addCompetition() {
      // TODO: Show modal + on response, send post route
      this.$refs.createModal
        .open()
        .then((resolve) => {
          if (resolve && resolve === true) {
            this.refreshData();
          }
        })
    }
  }
};

function countryCellRenderer(params) {
  // TODO: Maybe try to use cellRendererParams in coldef to pass directly the iso code instead of retrieveing it from row data
  // get flags from here: http://www.freeflagicons.com/
  if (params.value === "" || params.value === undefined || params.value === null || params.data.nationality === null || params.data.nationality.iso2 === null) {
      return '';
  } else {
      var flag = '<img class="flag" border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' + params.data.nationality.iso2 + '.png">';
      return flag + ' ' + params.value;
  }
}

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