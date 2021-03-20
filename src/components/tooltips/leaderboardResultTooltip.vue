<template>
  <div class="custom-tooltip">
    <p><span>{{ competitor }}</span></p>
    <p><span>Time: </span>{{time}}</p>
    <p><span>Reps: </span>{{result}}</p>
    <p><span>Tiebreak:: </span>{{tiebreak}}</p>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: 'LeaderboardResultTooltip',
  data () {
    return {
      competitor: null,
      tiebreak: null,
      time: null,
      result: null,
    }
  },
  beforeMount() {
    var data = this.params.api.getDisplayedRowAtIndex(this.params.rowIndex)
      .data;
    data.color = this.params.color || 'white';
    this.setState(data);
  },
  mounted() {
    this.$el.style['background-color'] = this.color;
  },
  methods: {
    setState(obj) {
      const that = this;

      Object.keys(obj).forEach(function (key) {
        that[key] = obj[key];
      });
    },
  },
});
</script>

<style lang="scss">  
.custom-tooltip {
  position: absolute;
  width: 150px;
  height: 70px;
  border: 1px solid cornflowerblue;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 1s;
}

.custom-tooltip.ag-tooltip-hiding {
  opacity: 0;
}

.custom-tooltip p {
  margin: 5px;
  white-space: nowrap;
}

.custom-tooltip p:first-of-type {
  font-weight: bold;
}
</style>