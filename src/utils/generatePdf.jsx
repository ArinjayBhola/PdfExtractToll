import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logoBase64 from "./nimbusLogoBase64";
import { instagramIconBase64 } from "./IconBase64";
import { globeIconBase64 } from "./IconBase64";
import { emailIconBase64 } from "./IconBase64";
import { phoneIconBase64 } from "./IconBase64";
import { locationIconBase64 } from "./IconBase64";

pdfMake.vfs = pdfFonts.vfs;

export async function generateStructuredPDF(data) {
  const currentDate = () => {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

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
              makeField("Contact", data["Contact"] || "+91-9836466860"),
            ],
          },
          {
            width: "50%",
            stack: [
              makeField("Booking Date", data["Booking Date"] || currentDate()),
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
              makeField("Check in", data["Check in date"]),
            ],
          },
          {
            width: "50%",
            stack: [
              makeField("Child", data["Child"]),
              makeField("Nights", data["Nights"]),
              makeField("Check out", data["Check out date"]),
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
          "Standard Check in time is 14:00 and Standard Check out time is 12:00.",
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
            stack: [
              {
                columns: [
                  {
                    image: instagramIconBase64,
                    width: 14,
                    margin: [0, 0, 6, 0],
                    alignment: "middle",
                  },
                  {
                    text: "@nimbustours.travels",
                    fontSize: 10,
                    bold: true,
                    alignment: "left",
                    margin: [10, 0, 0, 0],
                  },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                columns: [
                  {
                    image: globeIconBase64,
                    width: 14,
                    margin: [0, 0, 6, 0],
                    alignment: "middle",
                  },
                  {
                    text: "nimbustours.in",
                    fontSize: 10,
                    bold: true,
                    alignment: "left",
                    margin: [10, 0, 0, 0],
                  },
                ],
                margin: [0, 0, 0, 5],
              },
            ],
          },
          {
            width: "33%",
            stack: [
              {
                columns: [
                  {
                    image: emailIconBase64,
                    width: 14,
                    margin: [0, 0, 6, 0],
                    alignment: "middle",
                  },
                  {
                    text: "hotels@nimbustours.in",
                    fontSize: 10,
                    bold: true,
                    alignment: "left",
                    margin: [10, 0, 0, 0],
                  },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                columns: [
                  {
                    image: phoneIconBase64,
                    width: 14,
                    margin: [0, 0, 6, 0],
                    alignment: "middle",
                  },
                  {
                    text: "+91-9836466860",
                    fontSize: 10,
                    bold: true,
                    alignment: "left",
                    margin: [10, 0, 0, 0],
                  },
                ],
                margin: [0, 0, 0, 5],
              },
            ],
          },
          {
            width: "33%",
            stack: [
              {
                columns: [
                  {
                    image: locationIconBase64,
                    width: 14,
                    margin: [0, 0, 6, 0],
                    alignment: "middle",
                  },
                  {
                    stack: [
                      { text: "1st Floor, 8/1 Loudon Street,", fontSize: 10, bold: true },
                      { text: "Kolkata - 700017, India", fontSize: 10, bold: true },
                    ],
                    alignment: "left",
                    margin: [10, 0, 0, 0],
                  },
                ],
                margin: [0, 0, 0, 5],
              },
            ],
          },
        ],
        style: "footer",
        margin: [0, 20, 0, 10],
      },
    ],

    styles: {
      title: {
        fontSize: 20,
        bold: true,
      },
      fieldKey: {
        bold: true,
        fontSize: 14,
      },
      fieldValue: {
        fontSize: 12,
      },
      termsHeader: {
        bold: true,
        fontSize: 13,
        margin: [0, 10, 0, 5],
      },
      termsList: {
        fontSize: 11,
      },
      footer: {
        fontSize: 10,
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
  return {
    text: [
      { text: `${label}: `, style: "fieldKey" },
      { text: value || "N/A", style: "fieldValue" },
    ],
    margin: [5, 10, 0, 10],
  };
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
