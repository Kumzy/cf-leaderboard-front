<template>
  <div>
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
          <v-btn
            class="text-none"
            style="letter-spacing: normal;"
            :loading="calculateLoading"
            color="secondary"
            @click="generateFakeData"
          >
            Generate fake data
          </v-btn>

          <!-- Button refresh -->
          <v-btn
            :loading="refreshLoading"
            :disabled="refreshLoading"
            color="blue-grey"
            class="text-none ml-4 white--text"
            style="letter-spacing: normal;"
            @click="refreshData"
          >
            Refresh
            <v-icon
              right
              dark
            >
              {{ refreshIcon }}
            </v-icon>
          </v-btn>

          <!-- Button add -->
          <v-btn
            class="text-none ml-4"
            style="letter-spacing: normal;"
            color="primary"
          >Add</v-btn> 
           
        </v-col>
      </v-row>

    <ag-grid-vue
      id="competitorsGrid"
      style="width: 100%;"
      class="ag-theme-material"
      :columnDefs="columnDefs"
      :domLayout="domLayout"
      :rowData="rowData"
      :gridOptions="gridOptions">
      <!-- :frameworkComponents="frameworkComponents"> -->
      </ag-grid-vue>
    </div>
  </div>

</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from 'ag-grid-vue';
import btnCellRenderer from '@/renderers/BtnCellRenderer.vue';
// import { getAge } from '@/utils/date.js';
import { mdiMagnify, mdiRefresh } from '@mdi/js'

export default {
  name: 'competition',
  components: {
    AgGridVue
  },
  data() {
    return {
      calculateLoading: false,
      searchIcon: mdiMagnify,
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
        components: {
          countryCellRenderer: countryCellRenderer,
          // btnCellRenderer: BtnCellRenderer
        }
      },
      // frameworkComponents:{
      //   btnCellRenderer: BtnCellRenderer,
      // },
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
    window.addEventListener("resize", this.windowResized);
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
        cellRenderer: 'countryCellRenderer',
      },
      { 
        headerName: 'Age',
        field: 'birthdate',
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
        suppressMovable: true
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
      }
    ];
    this.rowData = [
    ];

    
  },
  methods: {
    windowResized() {
      this.gridApi.sizeColumnsToFit();
    },
    refreshData() {
      this.refreshLoading = true;
      // setTimeout(() => (this.refreshLoading = false), 3000)
      setTimeout(() => this.refreshLoading = false, 2000);
    },
    generate() {
     
    },
    searchGrid() {
      this.gridApi.setQuickFilter(this.search);
    },
    generateFakeData() {
      this.rowData = [
        { firstname: 'John', lastname: 'Doe', nationality: 'France', gender: 'Male', birthdate: '1990-05-01', height: 179, weight: 80 },
        { firstname: 'Jean', lastname: 'Crapaud', nationality: 'France', gender: 'Male', birthdate: '1991-05-01', height: 174, weight: 65},
      ];
      this.gridApi.sizeColumnsToFit();
    }
  }
};

function countryCellRenderer(params) {
    //get flags from here: http://www.freeflagicons.com/
    var COUNTRY_CODES = {
        Ireland: "ie",
        Luxembourg: "lu",
        Belgium: "be",
        Spain: "es",
        "United Kingdom": "gb",
        France: "fr",
        Germany: "de",
        Sweden: "se",
        Italy: "it",
        Greece: "gr",
        Iceland: "is",
        Portugal: "pt",
        Malta: "mt",
        Norway: "no",
        Brazil: "br",
        Argentina: "ar",
        Colombia: "co",
        Peru: "pe",
        Venezuela: "ve",
        Uruguay: "uy"
    };
    if (params.value === "" || params.value === undefined || params.value === null) {
        return '';
    } else {
        var flag = '<img class="flag" border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' + COUNTRY_CODES[params.value] + '.png">';
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