import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export function generateStructuredPDF(data) {
  const docDefinition = {
    content: [
      {
        columns: [
          { text: "Nimbus", style: "brand" },
          {
            text: "Hotel Voucher Summary",
            style: "title",
            alignment: "right",
          },
        ],
      },
      { canvas: [{ type: "line", x1: 0, y1: 10, x2: 520, y2: 10, lineWidth: 1 }] },
      "\n",

      makeSection("Guest Information", {
        "Lead Guest": data.leadGuestName,
        "Booking Reference": data.bookingReference,
      }),

      makeSection("Stay Details", {
        "Check-In Date": data.checkInDate,
        "Check-Out Date": data.checkOutDate,
        "Room Category": data.roomCategory,
        "Meal Plan": data.mealPlan,
      }),

      makeSection(
        "Other Details",
        filterUnknownFields(data, [
          "leadGuestName",
          "bookingReference",
          "checkInDate",
          "checkOutDate",
          "roomCategory",
          "mealPlan",
        ]),
      ),
    ],
    styles: {
      brand: {
        fontSize: 24,
        bold: true,
        color: "#1A73E8",
      },
      title: {
        fontSize: 16,
        bold: true,
        color: "#374151",
      },
      sectionHeader: {
        fontSize: 13,
        bold: true,
        margin: [0, 10, 0, 6],
        color: "#111827",
        decoration: "underline",
      },
      itemKey: {
        bold: true,
        margin: [0, 2],
      },
      itemValue: {
        margin: [0, 2],
      },
    },
    defaultStyle: {
      fontSize: 11,
    },
    pageMargins: [40, 60, 40, 60],
  };

  pdfMake.createPdf(docDefinition).download("Hotel-Voucher-Summary.pdf");
}

// Format a section with key-value pairs
function makeSection(title, fields) {
  if (!fields || Object.keys(fields).length === 0) return [];

  const content = [];

  for (const key in fields) {
    let val = fields[key];
    if (Array.isArray(val)) val = val.join(", ");
    else if (typeof val === "object" && val !== null) val = JSON.stringify(val, null, 2);
    else if (val === undefined || val === null) val = "N/A";

    content.push({
      columns: [
        { text: `${key}:`, style: "itemKey", width: "30%" },
        { text: val, style: "itemValue", width: "70%" },
      ],
    });
  }

  return [{ text: title, style: "sectionHeader" }, ...content, "\n"];
}

// Remove fields already rendered, return rest
function filterUnknownFields(obj, knownKeys) {
  const rest = {};
  Object.keys(obj).forEach((k) => {
    if (!knownKeys.includes(k)) {
      rest[prettifyKey(k)] = obj[k];
    }
  });
  return rest;
}

// Convert camelCase to readable text
function prettifyKey(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}
