const Invoice = {
    template: `
    <div id="invoicePage" style="overflow:hidden">
         <div class="row flex">
            <div class="col-12 col-md-4 col-xl-4">
                <div class="card border-0 p-4">
                    <img id="headerImg" style="display: none;" src="/resources/images/Invoice/header.jpg" alt="Header Image">
                    <img id="footerImg" style="display: none;" src="/resources/images/Invoice/footer.jpg" alt="Footer Image">
                    <h2 class="text-center fw-bold my-2 mb-3" style="font-size: 33px;">Invoice Generation</h2>
                    <input class="mb-4" type="text" placeholder="Enter your product name" v-model="product.Name" />
                    <input class="mb-4" type="number" placeholder="Enter your product qty" v-model="product.Qty" />
                    <input class="mb-4" type="number" placeholder="Enter your product price" v-model="product.Price" />
                    <button class="calculateButton mb-3 flex" v-on:click="calculate()">
                        <iconify-icon style="font-size:20px;color: white;" icon="zondicons:add-solid"></iconify-icon>
                        Add
                    </button>
                    <button class="generateButton mb-2 flex" v-on:click="popupOpen()">
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>
        <!-- Modal Popup -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered flex">
                <div class="modal-content">
                    <div class="add-product-popup flex p-4">
                        <input type="date" placeholder="Select your date" v-model="invoiceDate" />
                        <input type="text" placeholder="Enter customer name" v-model="customer.Name" />
                        <input type="number" placeholder="Enter customer phone number" v-model="customer.Phone" />
                        <input type="email" placeholder="Enter customer email id" v-model="customer.Email" />
                        <input type="number" placeholder="Enter your product discount" v-model="invoiceDiscount" />
                        <input type="number" placeholder="Enter your product GST" v-model="invoiceGST" />
                        <button class="flex generateButton" v-on:click="generatePDF()">
                            <div class="loader"></div>
                            {{downloadMessage}}
                            <iconify-icon style="font-size:25px;color: white" icon="basil:download-solid" id="downloadIcon">

                            </iconify-icon>
                        </button>
                        <div class="close flex" v-on:click="popupClose()">
                            <iconify-icon icon="majesticons:close"></iconify-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            downloadMessage: 'Download',
            popupModal: false,
            invoiceDate: moment().format('DD-MM-YYYY'),
            invoiceDiscount: null,
            invoiceGST: null,

            customer: {
                Name: '',
                Phone: null,
                Email: '',
            },

            product: {
                No: 1,
                Name: '',
                Price: null,
                Qty: null,
            },

            calculatedGST: null,
            calculatedDiscount: null,

            invoiceTableData: [],
        };
    },
    methods: {
        popupOpen() {
            $('#exampleModal').modal('show');
        },
        popupClose() {
            $('#exampleModal').modal('hide');
        },
        calculate() {
            if (this.product.Name && this.product.Price && this.product.Qty) {
                this.invoiceTableData.push({
                    itemNo: this.product.No++,
                    itemName: this.product.Name,
                    price: this.product.Price,
                    qty: this.product.Qty,
                    total: this.product.Price * this.product.Qty,
                });
                this.product.Name = '';
                this.product.Price = null;
                this.product.Qty = null;

                const notyf = new Notyf({
                    position: {
                        x: 'right',
                        y: 'bottom',
                    },
                });

                notyf.success('Successfully Added');
            }
            else {
                const notyf = new Notyf({
                    position: {
                        x: 'right',
                        y: 'bottom',
                    },
                });

                notyf.error('Please fill all fields');
            }
        },
        subTotalAmount() {
            return this.invoiceTableData.reduce(
                (total, item) => total + item.total,
                0
            );
        },
        calculateDiscountAmount() {
            if (this.invoiceDiscount && this.subTotalAmount()) {
                return (this.invoiceDiscount / 100) * this.subTotalAmount();
            }
            return 0;
        },
        calculateGSTAmount() {
            if (this.invoiceGST && this.subTotalAmount()) {
                return (this.invoiceGST / 100) * (this.subTotalAmount() - this.calculateDiscountAmount());
            }
            return 0;
        },
        calculateGrossTotal() {
            return this.subTotalAmount() - this.calculateDiscountAmount() + this.calculateGSTAmount();
        },
        convertToWords(amount) {
            var a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ",
                "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
            var b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",];

            function inWords(num) {
                if ((num = num.toString()).length > 9) return "Overflow";
                var n = ("000000000" + num)
                    .substr(-9)
                    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
                if (!n) return "";
                var str = "";
                str +=
                    n[1] != 0
                        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) +
                        "Crore "
                        : "";
                str +=
                    n[2] != 0
                        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh "
                        : "";
                str +=
                    n[3] != 0
                        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) +
                        "Thousand "
                        : "";
                str +=
                    n[4] != 0
                        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) +
                        "Hundred "
                        : "";
                str +=
                    n[5] != 0
                        ? (str != "" ? "And " : "") +
                        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
                        : "";
                return str.trim();
            }

            return inWords(amount);
        },
        getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL("image/jpeg");
            return dataURL;
        },
        generatePDF() {
            document.querySelector('.loader').style.display = 'block';
            document.querySelector('.generateButton').style.backgroundColor = 'red';
            this.downloadMessage = 'Downloading...';
            document.querySelector('#downloadIcon').style.display = 'none';
            setTimeout(() => {
                // Hide loader after six seconds
                document.querySelector('.loader').style.display = 'none';
                document.querySelector('.generateButton').style.backgroundColor = '#d82240';
                this.downloadMessage = 'Download';
                document.querySelector('#downloadIcon').style.display = 'flex';

                // Call function to generate and download PDF after delay
                this.generateAndDownloadPDF();
            }, 2000);
        },
        generateAndDownloadPDF() {

            var self = this; // Preserve reference to 'this' for use inside the image load callback

            var headerimgData = this.getBase64Image(document.querySelector('#headerImg'));
            var footerimgData = this.getBase64Image(document.querySelector('#footerImg'));

            var invoiceDate = new Date(self.invoiceDate);
            var now = moment(); // Make sure moment is imported or defined properly

            // First, load the background image
            var doc = new jsPDF();

            doc.addImage(headerimgData, 'JPEG', 0, 0, 210, 64);//Header Image Adding
            doc.addImage(footerimgData, 'JPEG', 0, 285, 210, 10);//Footer Image Adding


            doc.setFontSize(15);
            doc.setTextColor(0, 0, 0);

            // Format date using moment
            doc.text(164, 45, moment(invoiceDate).format("DD-MM-YYYY")); // Use moment() with invoiceDate

            doc.setFontSize(15);
            doc.setTextColor(223, 26, 46);
            doc.setFont("helvetica", "bold");
            doc.text(15, 70, 'INVOICE TO :'); //x,y

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            doc.text(15, 78, 'Customer Name : ' + self.customer.Name); //x,y
            doc.text(15, 86, 'Phone : ' + self.customer.Phone);
            doc.text(15, 94, 'Email : ' + self.customer.Email);

            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(15, 250, 'Terms & Conditions');

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(89, 89, 91);
            doc.text(15, 258, '1. Immediate Payment Required'); //x,y
            doc.text(15, 264, '2. Quick Delivery Assured'); //x,y
            doc.text(15, 269, '3. Liability Terms Apply'); //x,y

            var styles = {
                fontSize: 12,
                lineColor: [255, 255, 255],
                lineWidth: 1,
                minCellHeight: 10, // Use minCellHeight instead of rowHeight
            };

            var columnStyles = {
                0: { halign: "center", valign: "middle" },
                1: { halign: "left", valign: "middle" },
                2: { halign: "center", valign: "middle" },
                3: { halign: "center", valign: "middle" },
                4: { halign: "center", valign: "middle" },
            };

            var headStyles = {
                fillColor: [223, 26, 46],
                textColor: [255, 255, 255],
                halign: "center",
                valign: "middle",
                minCellHeight: 10, // Use minCellHeight instead of rowHeight
            };

            var startY = 15;
            doc.autoTable({
                head: [['S.No', 'Product Name', 'Price', 'Qty', 'Total']],
                body: self.invoiceTableData.map(data => [data.itemNo, data.itemName, data.price, data.qty, data.total]),
                styles: styles,
                margin: { top: 100, right: 10, bottom: 110, left: 10 },
                headStyles: headStyles,
                columnStyles: columnStyles,
            });


            doc.setFontSize(10);
            doc.text(140, startY + doc.lastAutoTable.finalY, 'Subtotal');
            doc.text(140, startY + doc.lastAutoTable.finalY + 8, 'Discount' + ' (' + self.invoiceDiscount + '%)');
            doc.text(140, startY + doc.lastAutoTable.finalY + 16, 'Tax' + ' (' + self.invoiceGST + '%)');

            doc.setFont("helvetica", "bold");
            doc.text(168, startY + doc.lastAutoTable.finalY, ': ' + self.subTotalAmount().toFixed(2));
            doc.text(168, startY + doc.lastAutoTable.finalY + 8, ': ' + self.calculateDiscountAmount().toFixed(2));
            doc.text(168, startY + doc.lastAutoTable.finalY + 16, ': ' + self.calculateGSTAmount().toFixed(2));

            // Draw a rectangle for additional content
            doc.setFillColor(223, 26, 46);
            doc.rect(135, startY + doc.lastAutoTable.finalY + 22, 60, 12, "F");//+150 width 10 height

            // Add text inside the rectangle
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(140, startY + doc.lastAutoTable.finalY + 30, 'Total: ');
            doc.text(158, startY + doc.lastAutoTable.finalY + 30, self.calculateGrossTotal().toFixed(2).toString());


            // Draw a rectangle for rupees to words
            doc.setFillColor(245, 245, 245);
            doc.rect(11, startY + doc.lastAutoTable.finalY + 40, 185, 10, "F");//+150 width 10 height

            // Add text inside the rectangle
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            var totalAmount = self.calculateGrossTotal();
            doc.text(13, startY + doc.lastAutoTable.finalY + 46, 'Rupees ' + self.convertToWords(Math.round(totalAmount)) + ' Only');

            var pageNumber = doc.internal.getNumberOfPages();
            if (pageNumber > 1) {
                doc.addImage(headerimgData, 'JPEG', 0, 0, 210, 64);//Header Image Adding
                doc.addImage(footerimgData, 'JPEG', 0, 285, 210, 10);//Footer Image Adding

                doc.setFontSize(15);
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");

                // Format date using moment
                doc.text(164, 50, moment(invoiceDate).format("DD-MM-YYYY")); // Use moment() with invoiceDate

                doc.setFontSize(15);
                doc.setTextColor(223, 26, 46);
                doc.setFont("helvetica", "bold");
                doc.text(15, 70, 'INVOICE TO :'); //x,y

                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
                doc.text(15, 78, 'Customer Name : ' + self.customer.Name); //x,y
                doc.text(15, 86, 'Phone : ' + self.customer.Phone);
                doc.text(15, 94, 'Email : ' + self.customer.Email);

                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "bold");
                doc.text(15, 250, 'Terms & Conditions');

                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.setTextColor(89, 89, 91);
                doc.text(15, 258, '1. Immediate Payment Required'); //x,y
                doc.text(15, 264, '2. Quick Delivery Assured'); //x,y
                doc.text(15, 269, '3. Liability Terms Apply'); //x,y
            }

            doc.save("StarGraphix_Invoice.pdf");
        }
    },
};
