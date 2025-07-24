import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logoBase64 from "./nimbusLogoBase64";
pdfMake.vfs = pdfFonts.vfs;

export async function generateStructuredPDF(data) {
  const docDefinition = {
    content: [
      {
        canvas: [
          {
            type: "rect",
            x: 0,
            y: 0,
            w: 595,
            h: 40,
            color: "#D32F2F",
          },
        ],
        absolutePosition: { x: 0, y: 0 },
        margin: [0, 0, 0, 45],
      },

      {
        columns: [
          {
            width: "60%",
            stack: [
              {
                image: logoBase64,
                width: 180,
                margin: [0, 6, 0, 0],
              },
              {
                text: "Nimbus Tours and Travels Pvt. Ltd.",
                margin: [90, 5, 0, 0],
                fontSize: 12,
                bold: true,
              },
            ],
          },
          {
            width: "40%",
            canvas: [
              {
                type: "polyline",
                points: [
                  { x: 0, y: 0 },
                  { x: 280, y: 0 },
                  { x: 280, y: 45 },
                  { x: 60, y: 45 },
                ],
                closePath: true,
                color: "#00332e",
              },
            ],
            height: 45,
            margin: [0, 0, 0, 0],
          },
        ],
        margin: [0, 0, 0, 10],
      },

      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
      {
        text: "Voucher",
        style: "title",
        alignment: "center",
        margin: [0, 12, 0, 12],
      },

      {
        columns: [
          {
            width: "50%",
            stack: [
              makeField("Hotel", data["Hotel Name"]),
              makeField("Address", data["Address"]),
              makeField("Contact", data["Contact"]),
            ],
          },
          {
            width: "50%",
            stack: [
              makeField("Booking Date", data["Booking Date"]),
              makeField("Hotel Confirmation", data["Hotel Confirmation"]),
            ],
          },
        ],
        margin: [0, 10, 0, 10],
      },

      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
      makeField("Guest Name", data["Guest Name"]),
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 10, 0, 10] },

      {
        columns: [
          {
            width: "50%",
            stack: [
              makeField("Adults", data["Adults"]),
              makeField("Rooms", data["Rooms"]),
              makeField("Check in", data["Check in"]),
            ],
          },
          {
            width: "50%",
            stack: [
              makeField("Child", data["Child"]),
              makeField("Nights", data["Nights"]),
              makeField("Check out", data["Check out"]),
            ],
          },
        ],
        margin: [0, 0, 0, 10],
      },

      makeField("Room Category", data["Room Category"]),
      makeField("Inclusions", formatList(data["Inclusions"])),

      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 10, 0, 10] },

      { text: "Terms and Conditions:", style: "termsHeader" },
      {
        ul: [
          "Standard Check in time is 13:00 and Standard Check out time is 12:00.",
          "Government ID is mandatory at the time of Check in.",
          "City Tax/Resort fees to be paid directly at the hotel if applicable.",
          "If a late check-in is planned, contact the property directly for their late check-in policy.",
        ],
        style: "termsList",
        margin: [0, 4, 0, 30],
      },

      {
        columns: [
          {
            width: "33%",
            stack: [{ text: "📶  @nimbustours.travels", margin: [0, 0, 0, 3] }, { text: "🌐  nimbustours.in" }],
          },
          {
            width: "33%",
            stack: [{ text: "✉️  hotels@nimbustours.in", margin: [0, 0, 0, 3] }, { text: "📞  +91-9836466860" }],
          },
          {
            width: "33%",
            stack: [
              { text: "📍  1st Floor, 8/1 Loudon Street,", margin: [0, 0, 0, 3] },
              { text: "Kolkata - 700017, India" },
            ],
          },
        ],
        style: "footer",
        margin: [0, 0, 0, 0],
      },
    ],

    styles: {
      title: {
        fontSize: 18,
        bold: true,
      },
      fieldKey: {
        bold: true,
        fontSize: 12,
        margin: [0, 8, 0, 2],
      },
      fieldValue: {
        margin: [0, 0, 0, 12],
        fontSize: 11,
      },
      termsHeader: {
        bold: true,
        fontSize: 12,
        margin: [0, 6, 0, 3],
      },
      termsList: {
        fontSize: 10,
      },
      footer: {
        fontSize: 9,
        alignment: "center",
        color: "#555",
      },
    },

    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(docDefinition).download("Hotel-Voucher-Summary.pdf");
}

function makeField(label, value) {
  return [
    { text: `${label}:`, style: "fieldKey" },
    {
      text: value || "N/A",
      style: "fieldValue",
      noWrap: false,
      preserveLeadingSpaces: true,
    },
  ];
}

function formatList(val) {
  if (!val) return "N/A";
  if (Array.isArray(val)) return val.map((v) => `• ${v}`).join("\n");
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  }
  return val;
}
