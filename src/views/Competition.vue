<template>
  <div class="about">
    <h1>Competition</h1>

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
        overlayNoRowsTemplate: 'No data available',
      },
      frameworkComponents: null,
      data: {
        week: {
          year: 2021,
          month: 2,
          day: 16
        }
      }
    };
  },
  created() {

  },
  beforeMount() {
    this.domLayout = 'autoHeight';

    this.columnDefs = [
      { 
        headerName: 'Rank',
        field: 'rank',
        editable: false,
        sortable: true,
        pinned: false,
        width: 150,
        maxWidth: 200,
        suppressMovable: true,
        cellStyle: {'font-weight': 'bold'}
      },
      { 
        headerName: 'Name', 
        field: 'name', 
        maxWidth: 400,
        editable: false, 
        sortable: false, 
        suppressMovable: true 
      },
      { 
        headerName: 'Nationality', 
        field: 'nationality', 
        maxWidth: 200,
        editable: false, 
        sortable: false, 
        suppressMovable: true 
      },
      { 
        headerName: 'Gender',
        field: 'gender',
        maxWidth: 100,
        editable: false,
        sortable: false,
        suppressMovable: true,
      },
      { 
        headerName: 'Points',
        field: 'points',
        maxWidth: 100,
        editable: false,
        sortable: false,
        suppressMovable: true,
      },
      { 
        headerName: 'Wod #1', 
        field: 'wod_1', 
        width: 300,
        editable: false, 
        sortable: true, 
        suppressMovable: true 
      },
      { 
        headerName: 'Wod #2', 
        field: 'wod_2', 
        width: 300,
        editable: false, 
        sortable: true, 
        suppressMovable: true 
      },      
      { 
        headerName: 'Wod #3', 
        field: 'wod_3', 
        width: 300,
        editable: false, 
        sortable: true, 
        suppressMovable: true 
      },
    ];
    this.rowData = [
    ];

    
  },
  methods: {
    generate() {
     
    },
    generateFakeData() {
      this.rowData = [
        { rank: 1, name: 'Julien Courtès', nationality: 'France', gender: 'Male', points: 1500, wod_1: '1st', wod_2: '1st', wod_3: '1st' },
        { rank: 2, name: 'Jean Boudet', nationality: 'France', gender: 'Male', points: 0, wod_1: 'last', wod_2: 'last', wod_3: 'last' }
      ];
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