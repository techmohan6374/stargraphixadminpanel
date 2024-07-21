// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyDN_104D8x9ha8OAKaRR9iyao-us5xylaY",
    authDomain: "stargraphix-order.firebaseapp.com",
    databaseURL: "https://stargraphix-order-default-rtdb.firebaseio.com",
    projectId: "stargraphix-order",
    storageBucket: "stargraphix-order.appspot.com",
    messagingSenderId: "122684226020",
    appId: "1:122684226020:web:996d269138fabe972eaff1",
    measurementId: "G-P5LNVB8Q7S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

const Admin = {
    template: `
    <div id="adminPage">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="row py-4 flex">
                    <h2 class="flex">Admin Panel</h2>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 col-xl-6" v-for="val in orderData">
                        <div class="card mb-3">
                            <div class="row w-100">
                                <div class="col-12">
                                    <div class="row content mb-3">
                                        <div class="col-12 col-xl-3">Full Name :</div>
                                        <div class="col-12 col-xl-8 fw-bold">{{val.firstName}}&nbsp;{{val.lastName}}</div>
                                    </div>
                                    <div class="row content mb-3">
                                        <div class="col-12 col-xl-3">Email :</div>
                                        <div class="col-12 col-xl-8 fw-bold">{{val.email}}</div>
                                    </div>
                                    <div class="row content mb-3">
                                        <div class="col-12 col-xl-3">Phone :</div>
                                        <div class="col-12 col-xl-8 fw-bold">{{val.phoneNo}}</div>
                                    </div>
                                    <div class="row content mb-3">
                                        <div class="col-12 col-xl-3 mb-2">Product :</div>
                                        <div class="col-12 col-xl-8">
                                            <span class="product-name">{{val.productName}}</span>
                                        </div>
                                    </div>
                                     <div class="row content">
                                        <div class="col-12 col-xl-3 mb-2">Message :</div>
                                        <div class="col-12 col-xl-8">
                                            <p class="message">{{val.productDescription}}</p>
                                        </div>
                                    </div>
                                    <div class="row content">
                                        <div class="col-12 flex" style="justify-content:flex-end;">
                                            <button class="view-btn flex" v-on:click="openImage(val.imageUrl)">
                                                <iconify-icon icon="mdi:show"></iconify-icon>
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    `,
    data() {
        return {
            orderData:[],
        };
    },
    methods: {
        readOrderData() {
            database.ref('orders').once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    let orders = snapshot.val();
                    this.orderData = Object.keys(orders).map(key => orders[key]);
                    console.log(this.orderData);
                }
            }).catch((error) => {
                console.error(error);
            });
        },
        openImage(src){
            $.fancybox.open([
                {
                    src: src,
                    opts: {
                        caption: this.selectedProductName,
                        animationEffect: "fade",
                        transitionEffect: "slide"
                    }
                }
            ], {
                loop: false,
                buttons: [
                    "zoom",
                    "share",
                    "slideShow",
                    "fullScreen",
                    "download",
                    "close"
                ]
            });
        },
    },
    mounted(){
        this.readOrderData();
    }
};
