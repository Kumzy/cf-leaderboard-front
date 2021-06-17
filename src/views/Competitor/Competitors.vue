<template>
  <v-container fluid>
    <h1>Competitors</h1>

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
            @click="addCompetitor"
          >
            <v-icon
              left
              dark
            >
              {{ addAccountIcon }}
            </v-icon>
            Add
          </v-btn> 
           
        </v-col>
      </v-row>

    <ag-grid-vue
      id="competitorsGrid"
      :style="{width, height}"
      class="ag-theme-material"
      :columnDefs="columnDefs"
      :domLayout="domLayout"
      :rowData="rowData"
      :gridOptions="gridOptions">
      <!-- :frameworkComponents="frameworkComponents"> -->
      </ag-grid-vue>
    </div>
  </v-container>

</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue';
import btnCellRenderer from '@/renderers/BtnCellRenderer.vue';
// import { getAge } from '@/utils/date.js';
import { mdiMagnify, mdiRefresh, mdiAccountPlus } from '@mdi/js';
import { getCompetitors } from '@/api/competitor';
import { getToken } from '@/utils/auth';

export default {
  name: 'competitors',
  components: {
    AgGridVue
  },
  data() {
    return {
      calculateLoading: false,
      logged: false,
      addAccountIcon: mdiAccountPlus,
      searchIcon: mdiMagnify,
      refreshIcon: mdiRefresh,
      refreshLoading: false,
      align:'start',
      justify:'start',
      columnDefs: null,
      rowData: null,
      search: null,
      gridApi: null,
      height: '100%',
      width: '100%',
      gridOptions: {
        suppressRowTransform: true,     
        suppressCellSelection: true,
        overlayNoRowsTemplate: 'No competitors found',
        components: {
          countryCellRenderer: countryCellRenderer,
        }
      },
      data: {
        week: {
          year: 2021,
          month: 2,
          day: 16
        }
      },
      genders:['All','Male','Female']
    };
  },
  created() {
    const hasToken = getToken()
    if (hasToken) {
      this.logged = true;
    }
    // Link resize of window to the ag-grid
    window.addEventListener("resize", this.windowResized);
    this.getCompetitors();
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
        headerName: 'Firstname', 
        field: 'firstname', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true 
      },
      { 
        headerName: 'Lastname', 
        field: 'lastname', 
        width: 400,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true 
      },
      { 
        headerName: 'Nationality', 
        field: 'nationality', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: false, 
        resizable:true,
        suppressMovable: true,
        valueGetter: 'data.nationality.name',
        cellRenderer: 'countryCellRenderer'
      },
      { 
        headerName: 'Age',
        field: 'birthday_date',
        width: 100,
        minWidth: 80,
        editable: false,
        sortable: true,
        resizable:true,
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
      },
      { 
        headerName: 'Height', 
        field: 'height', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          return params.value + ' cm';
        }
      },
      { 
        headerName: 'Weight', 
        field: 'weight', 
        width: 200,
        minWidth: 100,
        editable: false, 
        sortable: true, 
        resizable:true,
        suppressMovable: true,
        valueFormatter:  function(params) {
          return params.value + ' kg';
        }
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
        cellRendererFramework: btnCellRenderer,
        cellRendererParams: {logged: this.logged},
      }
    ];
    this.rowData = [
    ];
    
  },
  methods: {
    windowResized() {
      this.gridApi.sizeColumnsToFit();
    },
    getCompetitors() {
      this.refreshLoading = true;
      getCompetitors().then(response => {
        this.rowData = response.data.items
        this.gridApi.sizeColumnsToFit();
        this.refreshLoading = false
      })
    },
    refreshData() {
      this.getCompetitors()
    },
    generate() {
     
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    addCompetitor() {
      this.$router.push({ name: 'competitor_add' })
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