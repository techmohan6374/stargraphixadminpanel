const routes = [
    { path: '/', component: Login },
    { path: '/main/:password', component: Main },
    { path: '/admin', component: Admin },
    { path: '/invoice', component: Invoice },
    { path: '/flipbook', component: Flipbook }
];

const router = new VueRouter({
    routes,
});
