import { mutation } from "./_generated/server";

export const seedDeepLinksPart2 = mutation({
  handler: async (ctx) => {
    const resources = [
      {
        name: "GUJCET (Gujarat)",
        links: [
          { label: "Information Brochure (ACPC)", url: "https://gujacpc.admissions.nic.in/information-bulletin/" },
          { label: "Seat Matrix & Guidelines", url: "https://gujacpc.admissions.nic.in/seat-matrix/" },
          { label: "Previous Years' Cutoffs", url: "https://gujacpc.admissions.nic.in/cut-off/" },
        ]
      },
      {
        name: "REAP Rajasthan",
        links: [
          { label: "Information Booklet (REAP)", url: "https://cegreap2024.com/documents/Information_Booklet_REAP.pdf" },
          { label: "Tentative Seat Matrix", url: "https://cegreap2024.com/seat-matrix/" },
          { label: "Schedule & Instructions", url: "https://cegreap2024.com/schedule/" },
        ]
      },
      {
        name: "HSTES (Haryana)",
        links: [
          { label: "B.Tech Prospectus", url: "https://hstes.org.in/prospectus" },
          { label: "Key Dates & Schedule", url: "https://hstes.org.in/key-dates" },
          { label: "Opening & Closing Ranks", url: "https://techadmissionshry.gov.in/cutoff" },
        ]
      },
      {
        name: "OJEE (Odisha)",
        links: [
          { label: "Information Brochure", url: "https://ojee.nic.in/information-brochure/" },
          { label: "Seat Matrix", url: "https://ojee.nic.in/seat-matrix/" },
          { label: "Counseling Schedule", url: "https://ojee.nic.in/counselling-schedule/" },
        ]
      },
      {
        name: "CEE Kerala (KEAM)",
        links: [
          { label: "KEAM Prospectus", url: "https://cee.kerala.gov.in/keamonline2024/public/pdf/prospectus.pdf" },
          { label: "Last Rank Details", url: "https://cee.kerala.gov.in/keamonline2024/public/pdf/last_rank.pdf" },
          { label: "Category List", url: "https://cee.kerala.gov.in/keamonline2024/public/pdf/category_list.pdf" },
        ]
      },
      {
        name: "BCECEB (Bihar)",
        links: [
          { label: "UGEAC Prospectus", url: "https://bceceboard.bihar.gov.in/pdf/Prospectus_UGEAC.pdf" },
          { label: "Seat Matrix", url: "https://bceceboard.bihar.gov.in/SeatMatrix.php" },
          { label: "Cutoff Ranks", url: "https://bceceboard.bihar.gov.in/Cutoff.php" },
        ]
      },
      {
        name: "JCECEB (Jharkhand)",
        links: [
          { label: "Information Bulletin", url: "https://jceceb.jharkhand.gov.in/links/download.aspx" },
          { label: "Counseling Notices", url: "https://jceceb.jharkhand.gov.in/links/notice.aspx" },
        ]
      },
      {
        name: "TN Medical Selection",
        links: [
          { label: "MBBS/BDS Prospectus", url: "https://tnmedicalselection.net/news/prospectus.pdf" },
          { label: "Seat Matrix", url: "https://tnmedicalselection.net/news/seat_matrix.pdf" },
        ]
      },
      {
        name: "UP NEET",
        links: [
          { label: "Information Brochure", url: "https://upneet.gov.in/info-brochure/" },
          { label: "Merit List", url: "https://upneet.gov.in/merit-list/" },
        ]
      },
      {
        name: "WBMCC Medical",
        links: [
          { label: "Information Bulletin", url: "https://wbmcc.nic.in/information-bulletin/" },
          { label: "Seat Matrix", url: "https://wbmcc.nic.in/seat-matrix/" },
        ]
      }
    ];

    for (const res of resources) {
      const existing = await ctx.db.query("counselings").filter(q => q.eq(q.field("name"), res.name)).first();
      if (existing) {
        await ctx.db.patch(existing._id, { links: res.links });
      }
    }

    return `Successfully updated another ${resources.length} state counselings with deep resource links.`;
  },
});
