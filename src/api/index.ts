// import apiBase from './apiBase';
// import apiVersion from './apiVersion';
const apiBase='/api'
// const apiVersion='/nest'

// const webBase = ``; // 本地调试，线上地址
const webBase=import.meta.env.VITE_APP_API

const apiUrl = `${webBase}${apiBase}`;

// const apiUrl = `http://192.168.2.103:13573${apiBase}`;//yarn vite --mode production
// const apiUrl = `http://localhost:13573${apiBase}`;//yarn vite --mode production
// const apiUrl = `http://frv228.gnway.cc:8000${apiBase}`;//yarn vite --mode production

export default apiUrl;
