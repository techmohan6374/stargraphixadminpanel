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
                <div class="col-12 col-xl-3 mb-3" v-for="val in 15" :key="val">
                    <div class="card flipbook-card">
                        <p>APPLE FOOD DIGITAL BUSINESS CARD.pdf</p>
                        <button class="flex"><iconify-icon icon="material-symbols:book-5-outline"></iconify-icon>
                            View</button>
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
      githubToken: "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",
      owner: "techmohan6374",
      repo: "flipbook-pdf-files",
      path: "pdf-files/",
      fileUrl: "",
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.uploadFile();
    },
    async uploadFile() {
      if (!this.file) {
        alert("Please select a file to upload.");
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
            alert("File uploaded successfully!");
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      };
    },
  },
};