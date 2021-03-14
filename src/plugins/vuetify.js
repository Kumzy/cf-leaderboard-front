import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueMask from 'v-mask'

Vue.use(Vuetify)
Vue.use(VueMask)

const opts = {
    icons: {
        iconfont: 'mdiSvg',
    }
}

export default new Vuetify(opts)