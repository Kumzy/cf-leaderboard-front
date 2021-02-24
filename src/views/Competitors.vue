<template>
  <div class="about">
    <h1>Competitors</h1>

    <div class="filter-container">
      
      <v-btn
      depressed
      :loading="calculateLoading"
      color="primary"
      @click="generateFakeData"
    >
      Generate fake data
    </v-btn>

      <ag-grid-vue
        id="competitors"
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
// import { getAge } from '@/utils/date.js';

export default {
  name: 'competition',
  components: {
    AgGridVue
  },
  data() {
    return {
      calculateLoading: false,
      align:'start',
      justify:'start',
      columnDefs: null,
      rowData: null,
      gridOptions: {
        suppressRowTransform: true,     
        suppressCellSelection: true,
        overlayNoRowsTemplate: 'No competitors found',
        components: {
          countryCellRenderer: countryCellRenderer
        }
      },
      frameworkComponents: null,
      data: {
        week: {
          year: 2021,
          month: 2,
          day: 16
        }
      },
    };
  },
  created() {

  },
  beforeMount() {
    this.domLayout = 'autoHeight';

    this.columnDefs = [
      { 
        headerName: 'Firstname', 
        field: 'firstname', 
        width: 400,
        editable: false, 
        sortable: false, 
        suppressMovable: true 
      },
      { 
        headerName: 'Lastname', 
        field: 'lastname', 
        width: 400,
        editable: false, 
        sortable: false, 
        suppressMovable: true 
      },
      { 
        headerName: 'Nationality', 
        field: 'nationality', 
        width: 200,
        editable: false, 
        sortable: false, 
        suppressMovable: true,
        cellRenderer: 'countryCellRenderer',
      },
      { 
        headerName: 'Age',
        field: 'birthdate',
        width: 100,
        editable: false,
        sortable: false,
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
        editable: false, 
        sortable: false, 
        suppressMovable: true
      },
      { 
        headerName: 'Height', 
        field: 'height', 
        width: 200,
        editable: false, 
        sortable: false, 
        suppressMovable: true,
        valueFormatter:  function(params) {
          return params.value + ' cm';
        }
      },
      { 
        headerName: 'Weight', 
        field: 'weight', 
        width: 200,
        editable: false, 
        sortable: false, 
        suppressMovable: true,
        valueFormatter:  function(params) {
          return params.value + ' kg';
        }
      },
      { 
        headerName: 'Profile', 
        field: 'profile', 
        width: 200,
        editable: false, 
        sortable: false, 
        suppressMovable: true,
        cellRenderer: (params) => {
          const route = {
            name: "competitor-profile",
            params: { id: params.data.id }
          };

          const link = document.createElement("a");
          link.href = this.$router.resolve(route).href;
          link.innerText = "View";
          // link.innerText = params.value;
          link.addEventListener("click", e => {
            e.preventDefault();
            this.$router.push(route);
          });
          return link;
        }
      }
    ];
    this.rowData = [
    ];

    
  },
  methods: {
    generate() {
     
    },
    generateFakeData() {
      this.rowData = [
        { firstname: 'John', lastname: 'Doe', nationality: 'France', gender: 'Male', birthdate: '1990-05-01', height: 179, weight: 80 },
        { firstname: 'Jean', lastname: 'Crapaud', nationality: 'France', gender: 'Male', birthdate: '1991-05-01', height: 174, weight: 65},
      ];
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