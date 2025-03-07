import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


const options = {
    position: "top-right",
    timeout: 2000,
    closeOnClick: true
};

const app = createApp(App)

app.use(createPinia())
app.use(Toast, options)
app.use(router)

app.mount('#app')
