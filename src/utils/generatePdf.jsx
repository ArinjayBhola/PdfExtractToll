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
      {
        canvas: [{ type: "line", x1: 0, y1: 10, x2: 520, y2: 10, lineWidth: 1 }],
        margin: [0, 6, 0, 10],
      },

      ...makeSection("Guest Information", {
        "Guest Name": Array.isArray(data["Guest names"]) ? data["Guest names"]?.[0] : data["Guest names"],
        "Booking Reference": Array.isArray(data["Booking references"])
          ? data["Booking references"]?.[0]
          : data["Booking references"],
      }),

      ...makeSection("Stay Details", {
        "Check-In Date": data["Check-in/check-out dates"]?.["Check-in"] || data.checkInDate,
        "Check-Out Date": data["Check-in/check-out dates"]?.["Check-out"] || data.checkOutDate,
        "Room Category": data["Room category, inclusions, and meal plans"]?.["Room category"] || data.roomCategory,
        "Meal Plan": data["Room category, inclusions, and meal plans"]?.["Meal plan"] || data.mealPlan,
      }),

      ...makeSection("Other Details", {
        "Number of Guests": data["Number of guests"],
        "Hotel Name & Address": data["Hotel name and address"],
        Inclusions: formatList(data["Room category, inclusions, and meal plans"]?.["Inclusions"]),
        "Emergency Contact":
          data["Emergency contact, remarks, policies, etc."]?.["Emergency contact"] ||
          data["Emergency contact, remarks, policies, etc."]?.["Hotel contact"],
        "Cancellation Policy": data["Emergency contact, remarks, policies, etc."]?.["Cancellation policy"],
        Policies: formatNestedObject(data["Emergency contact, remarks, policies, etc."]),
      }),
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
        fontSize: 14,
        bold: true,
        color: "#111827",
        decoration: "underline",
        margin: [0, 10, 0, 4],
      },
      itemKey: {
        bold: true,
        color: "#374151",
        margin: [0, 2, 0, 2],
      },
      itemValue: {
        color: "#111827",
        margin: [0, 2, 0, 2],
      },
      sectionBox: {
        margin: [0, 0, 0, 12],
        fillColor: "#F9FAFB",
        padding: [10, 6, 10, 6],
      },
    },

    defaultStyle: {
      fontSize: 11,
    },

    pageMargins: [40, 60, 40, 60],
  };

  pdfMake.createPdf(docDefinition).download("Hotel-Voucher-Summary.pdf");
}

function makeSection(title, fields) {
  if (!fields || Object.keys(fields).length === 0) return [];

  const content = [];

  for (const key in fields) {
    const rawVal = fields[key];
    const val = typeof rawVal === "string" || typeof rawVal === "number" ? rawVal : formatList(rawVal);

    content.push({
      columns: [
        { text: `${key}:`, style: "itemKey", width: "30%" },
        { text: val || "N/A", style: "itemValue", width: "70%" },
      ],
    });
  }

  return [
    { text: title, style: "sectionHeader" },
    {
      stack: content,
      style: "sectionBox",
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

function formatNestedObject(obj) {
  if (!obj || typeof obj !== "object") return "N/A";

  return Object.entries(obj)
    .map(([key, value]) => {
      let formattedValue = "";

      if (typeof value === "string") {
        formattedValue = value.trim();
      } else if (Array.isArray(value)) {
        formattedValue = value.map((v) => `  - ${v}`).join("\n");
      } else if (typeof value === "object") {
        formattedValue = formatNestedObject(value);
      } else {
        formattedValue = String(value);
      }

      return `• ${key}:\n    ${formattedValue}`;
    })
    .join("\n\n");
}
