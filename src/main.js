import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'

import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './permission'

Vue.config.productionTip = false

Vue.use(VueQuillEditor)
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')