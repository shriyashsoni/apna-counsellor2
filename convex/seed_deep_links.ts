import { mutation } from "./_generated/server";

export const seedDeepLinks = mutation({
  handler: async (ctx) => {
    const resources = [
      {
        name: "JoSAA 2026",
        links: [
          { label: "Official Business Rules (Brochure)", url: "https://josaa.nic.in/document/business-rules-josaa-2024/" },
          { label: "Seat Matrix 2025/26", url: "https://josaa.nic.in/seat-matrix/" },
          { label: "Opening & Closing Ranks 2024", url: "https://josaa.nic.in/document/opening-and-closing-ranks-2024/" },
        ]
      },
      {
        name: "MCC AIQ NEET",
        links: [
          { label: "Information Bulletin (Brochure)", url: "https://mcc.nic.in/information-bulletin-ug/" },
          { label: "Counseling Schedule 2025", url: "https://mcc.nic.in/counseling-schedule-ug/" },
          { label: "UG Seat Matrix 2025", url: "https://mcc.nic.in/seat-matrix-ug/" },
        ]
      },
      {
        name: "MHT-CET Cell (Maharashtra)",
        links: [
          { label: "Engineering Information Brochure", url: "https://cetcell.mahacet.org/wp-content/uploads/2023/12/MHT-CET-2024-Information-Brochure.pdf" },
          { label: "Document Verification Checklist", url: "https://fe2024.mahacet.org/2023/Documents/Checklist_Documents.pdf" },
          { label: "MHT-CET Cutoffs 2024 (CAP III)", url: "https://fe2024.mahacet.org/2023/2023ENGG_CAP3_CutOff.pdf" },
        ]
      },
      {
        name: "KEA (Karnataka)",
        links: [
          { label: "UGET Information Bulletin", url: "https://cetonline.karnataka.gov.in/kea/bulletins" },
          { label: "Engineering Seat Matrix", url: "https://cetonline.karnataka.gov.in/kea/seatmatrix" },
          { label: "First Round Cutoffs", url: "https://cetonline.karnataka.gov.in/kea/cutoff" },
        ]
      },
      {
        name: "COMEDK Karnataka",
        links: [
          { label: "Information Brochure (UGET)", url: "https://www.comedk.org/uploads/UGET-2024-BROCHURE.pdf" },
          { label: "Counselling Process Guide", url: "https://www.comedk.org/counselling-process" },
          { label: "Consolidated Cutoffs 2024", url: "https://www.comedk.org/cutoff" },
        ]
      },
      {
        name: "WBJEEB (West Bengal)",
        links: [
          { label: "Information Bulletin (Engineering)", url: "https://wbjeeb.nic.in/wbjee-information-bulletin/" },
          { label: "Counselling Notification", url: "https://wbjeeb.nic.in/wbjee-counselling-notification/" },
          { label: "Opening & Closing Ranks", url: "https://wbjeeb.nic.in/wbjee-opening-closing-ranks/" },
        ]
      },
      {
        name: "MP DTE (Madhya Pradesh)",
        links: [
          { label: "Rulebook for BE/B.Tech", url: "https://dte.mponline.gov.in/portal/services/onlinecounselling/counshomepage/home.aspx" },
          { label: "Tentative Schedule 2025", url: "https://dte.mponline.gov.in/portal/services/onlinecounselling/counshomepage/home.aspx" },
        ]
      },
      {
        name: "UPTAC (Uttar Pradesh)",
        links: [
          { label: "Information Brochure (AKTU)", url: "https://uptac.admissions.nic.in/information-bulletin/" },
          { label: "Counselling Schedule", url: "https://uptac.admissions.nic.in/counselling-schedule/" },
          { label: "Opening & Closing Ranks", url: "https://uptac.admissions.nic.in/opening-and-closing-ranks/" },
        ]
      },
      {
        name: "Jac Delhi",
        links: [
          { label: "Information Brochure (JAC Delhi)", url: "https://jacdelhi.admissions.nic.in/information-bulletin/" },
          { label: "Counselling Schedule", url: "https://jacdelhi.admissions.nic.in/counselling-schedule/" },
          { label: "Cutoffs 2024", url: "https://jacdelhi.admissions.nic.in/opening-and-closing-ranks/" },
        ]
      },
      {
        name: "JAC Chandigarh",
        links: [
          { label: "Information Brochure", url: "https://chdjtac.admissions.nic.in/information-bulletin/" },
          { label: "Counselling Schedule", url: "https://chdjtac.admissions.nic.in/counselling-schedule/" },
        ]
      }
    ];

    for (const res of resources) {
      const existing = await ctx.db.query("counselings").filter(q => q.eq(q.field("name"), res.name)).first();
      if (existing) {
        await ctx.db.patch(existing._id, { links: res.links });
      }
    }

    return `Successfully updated ${resources.length} counselings with deep resource links.`;
  },
});
