<template>
  <div>
    <v-btn 
      class="text-none"
      color="primary"
      small
    >View</v-btn>

    <v-btn
      class="text-none ml-2"
      color="error"
      small>
      Delete
    </v-btn>
  </div>
</template>

<script>

import Vue from "vue";

export default Vue.extend({

});
// export default {
//   name: 'BtnCellRenderer',
//   data() {
//     return {
//     }
//   }
// }
</script>
// export default Vue.extend({
//     template: `
//           <span>
//               <v-btn @click="btnClickedHandler()">Click me!</button>
//           </span>
//       `,
//     methods: {
//       btnClickedHandler() {
//         this.params.clicked(this.params.value);
//       }
//     },
// });
