// This script is a template to push scraped data to Convex
// You would run this after extracting data from official websites

const { ConvexClient } = require("convex/browser");
require("dotenv").config();

// The deployment URL would be in your .env file after running 'npx convex dev'
const client = new ConvexClient(process.env.CONVEX_URL);

async function pushData(data) {
    console.log("Pushing data to Convex...");
    
    // Example: Adding a counseling
    const counselingId = await client.mutation("counselings:addCounseling", {
        name: "JoSAA",
        category: "Engineering",
        region: "India",
        exam: "JEE Main / Advanced",
        officialUrl: "https://josaa.nic.in"
    });

    console.log("Added counseling with ID:", counselingId);
}

// pushData();
