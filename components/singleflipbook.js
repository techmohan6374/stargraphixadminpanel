const SingleFlipBook = {
  template: `
      <div class="container-fluid p-0 flex" style="min-height: 100vh;" id="singleFlipBookViewer">
          <div id="flipbookPDFContainer"></div>
          
          <div class="stargraphix-box animate__animated animate__bounceIn animate__infinite	infinite animate__slow	2s">
            <a href="http://stargraphix.in/" target="_blank">
              <img src="/resources/images/STAR GRAPHIX LOGO.png" alt="Star Graphix Logo" />
            </a>
          </div>
      </div>
    `,
  data() {
    return {
      files: [],
      selectedPdfUrl: "",
      index: null,
    };
  },
  created() {
    this.readFlipBookData();
    this.index = this.$route.params.id;
    setTimeout(() => {
      var source_pdf = this.selectedPdfUrl;
      var option_pdf = { webgl: true, backgroundColor: "#e6c959" };
      var flipBook_pdf = $("#flipbookPDFContainer").flipBook(
        source_pdf,
        option_pdf
      );
    }, 2000);
  },
  methods: {
    readFlipBookData() {
      database
        .ref("pdf")
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            let pdfFiles = snapshot.val();
            this.files = Object.keys(pdfFiles).map((key) => pdfFiles[key]);
            this.selectedPdfUrl = this.files[this.index].fileUrl;
            console.log(this.selectedPdfUrl);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.readFlipBookData();
  },
};
