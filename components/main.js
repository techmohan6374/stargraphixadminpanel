const Main = {
    template: `
    <div id="mainPage">
        <div class="container">
            <div class="row flex">
                <div class="col-12 col-md-4 col-xl-4">
                    <div class="card flex">
                        <button class="admin-panel flex" v-on:click="openAdminPanel()">
                        <iconify-icon icon="mdi:user-add-outline"></iconify-icon>
                        Order Admin Panel
                        </button>
                        <button class="invoice-generation flex" v-on:click="openInvoicePage()">
                            <iconify-icon icon="fe:document"></iconify-icon>
                            Invoice Generation
                        </button>
                            <button class="flipbook-generation flex" v-on:click="openFlipBookPage()">
                            <iconify-icon icon="material-symbols:book-5-outline"></iconify-icon>
                            Flipbook Generation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    created() {
        const password = this.$route.params.password;
        if (password != 'stargx') {
            this.$router.push(`/login`);
        }
    },
    data() {
        return {

        };
    },
    methods: {
        openInvoicePage() {
            this.$router.push(`/invoice`);
        },
        openAdminPanel() {
            this.$router.push(`/admin`);
        },
        openFlipBookPage(){
            this.$router.push(`/flipbook`);
        }
    },
};
