const SingleFlipBook = {
  template: `
      <div class="container-fluid p-0 flex" style="min-height: 100vh;" id="power">
        <div ref="flipbook" class="_df_book" webgl="true" backgroundcolor="#e6c959" :source="selectedPdfUrl" id="df_manual_book">
        </div>
      </div>
    `,
  data() {
    return {
      selectedPdfUrl: "",
      githubToken: "",
      owner: "techmohan6374",
      repo: "flipbook-pdf-files",
      path: "pdf-files/",
      files: [],
      pdfName: "",
    };
  },
  created() {
    var pdfUrl = localStorage.getItem("pdfUrl");
    console.log(pdfUrl);
    this.selectedPdfUrl =
      "https://raw.githubusercontent.com/" +
      this.owner +'/'+
      this.repo +
      "/main/" +
      this.path +
      pdfUrl;
    console.log(this.selectedPdfUrl);
  },
  mounted() {
    if (!this.$route.query.reloaded) {
        setTimeout(() => {
            this.$router.replace({ ...this.$route, query: { reloaded: 'true' } }).then(() => {
                location.reload();
            });
        }, 2000);
    }
},
};
