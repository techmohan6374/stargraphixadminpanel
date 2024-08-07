const Flipbook = {
  template: `       
    <div id="flipBook" class="container-fluid">
        <div class="container">
            <div class="row py-4">
                <div class="col-12 flex">
                    <h2>Flipbook Generation</h2>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12 col-md-6 col-xl-3 mb-3" v-for="val in files" :key="val.sha">
                    <div class="card flipbook-card">
                        <p>{{ val.name }}</p>
                        <button class="flex" v-on:click="openFlipBook(val.name)">
                          <iconify-icon icon="material-symbols:book-5-outline"></iconify-icon>
                          View
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <button class="add-btn flex" title="Upload PDF" @click="triggerFileInput">
            <iconify-icon icon="fluent-emoji-high-contrast:plus"></iconify-icon>
        </button>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" accept=".pdf">
    </div>
  `,
  data() {
    return {
      file: null,
      githubToken: "",
      owner: "techmohan6374",
      repo: "flipbook-pdf-files",
      path: "pdf-files/",
      fileUrl: "",
      files: [],
    };
  },
  created() {
    this.fetchFiles();
  },
  methods: {
    async fetchFiles() {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `token ${this.githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.files = data;
        } else {
          const error = await response.json();
          console.error(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.uploadFile();
    },
    async uploadFile() {
      var notyf = new Notyf();
      if (!this.file) {
        notyf.error("Please select a file to upload.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = async () => {
        const base64Content = reader.result.split(",")[1];
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}${this.file.name}`;
        const message = `Add ${this.file.name}`;
        const content = base64Content;
        const body = JSON.stringify({
          message,
          content,
        });

        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `token ${this.githubToken}`,
              "Content-Type": "application/json",
            },
            body,
          });

          if (response.ok) {
            const result = await response.json();
            this.fileUrl = result.content.download_url;
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Uploaded Successfully 😉😎",
            });

            // Add a slight delay to ensure GitHub has updated the content
            setTimeout(() => {
              this.fetchFiles();
            }, 2000); // 2 seconds delay
          } else {
            const error = await response.json();
            notyf.error(`Error: ${error.message}`);
          }
        } catch (error) {
          notyf.error(`Error: ${error.message}`);
        }
      };
    },
    openFlipBook(pdfName){
      localStorage.setItem("pdfUrl", pdfName);
      this.$router.push(`/singleflipBook/`);
    }
  },
  mounted() {
    this.fetchFiles();
  },
};
