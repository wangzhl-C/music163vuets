import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import request from './services/axios'
import axios from 'axios'
// axios.get("http://localhost:3000/search?keywords=海阔天空").then(data => console.log(data));
request.request({
  url: '/search?keywords=海阔天空'
}).then(data => {
  console.log(data)
})


const app = createApp(App)

app.use(router)

app.mount('#app')
