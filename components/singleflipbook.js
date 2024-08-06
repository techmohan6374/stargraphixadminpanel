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
      githubToken: "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",
      owner: "techmohan6374",
      repo: "flipbook-pdf-files",
      path: "pdf-files/",
      files: [],
      pdfName: "",
    };
  },
  created() {
    this.fetchFiles();
    setTimeout(() => {
      this.pdfName = this.$route.params.pdfName;
      const pdfFile = this.files.find((x) => x.name === this.pdfName);
      this.selectedPdfUrl = pdfFile
        ? `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/${this.path}${pdfFile.name}`
        : "";
      console.log(this.selectedPdfUrl);
    }, 3000);
  },
  methods: {
    fetchFiles() {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `token ${this.githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }
        })
        .then((data) => {
          this.files = data;
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
        });
    },
  },
};
