const Flipbook = {
  template: `       
    <div id="flipBook" class="container-fluid">
        <div class="loader-container flex" v-show="showLoader">
          <div class="loader"></div>
        </div>
        <div class="container">
         <div class="row py-4">
                <div class="col-12 flex">
                    <h2>Flipbook Generation</h2>
                </div>
            </div>
        </div>
        <div class="container" v-show="showMain">
            <div class="row mt-4">
                <div class="col-12 col-md-6 col-xl-3 mb-3" v-for="(val, index) in files" :key="index">
                    <div class="card flipbook-card">
                        <p>{{ val.fileName }}</p>
                        <button class="flex" v-on:click="openFlipBook(index)">
                          <iconify-icon icon="material-symbols:book-5-outline"></iconify-icon>
                          View
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <button class="add-btn flex hint--top hint--bounce" @click="triggerFileInput" aria-label="Upload PDF">
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
      fileName: "",
      files: [],
      showLoader: false,
      showMain: true,
    };
  },
  created() {
    this.readFlipBookData();
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
      var notyf = new Notyf();
      if (!this.file) {
        notyf.error("Please select a file to upload.");
        return;
      }
      this.showLoader = true;
      this.showMain = false;

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
            this.fileName = this.file.name; // Store the file name here
            console.log(this.fileName);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Uploaded Successfully 😉😎",
            });

            const newOrderKey = firebase
              .database()
              .ref()
              .child("pdf")
              .push().key;
            const pdfData = {
              fileName: this.fileName, // Include the file name
              fileUrl: this.fileUrl, // Include the file URL
            };
            const updates = {};
            updates[`/pdf/${newOrderKey}`] = pdfData;
            await firebase.database().ref().update(updates);
            this.readFlipBookData();
            this.showLoader = false;
            this.showMain = true;
          } else {
            const error = await response.json();
            notyf.error(`Error: ${error.message}`);
          }
        } catch (error) {
          notyf.error(`Error: ${error.message}`);
        }
      };
    },
    openFlipBook(id) {
      this.$router.push(`/singleflipBook/${id}`);
    },
    readFlipBookData() {
      database
        .ref("pdf")
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            let pdfFiles = snapshot.val();
            this.files = Object.keys(pdfFiles).map((key) => pdfFiles[key]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    mounted() {
      this.readFlipBookData();
    },
  },
};