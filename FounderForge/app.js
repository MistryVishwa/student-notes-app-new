function generatePlan() {

    const idea = document.getElementById("idea").value;
    const audience = document.getElementById("audience").value;
    const problem = document.getElementById("problem").value;
    const revenue = document.getElementById("revenue").value;

    if (!idea || !audience || !problem || !revenue) {
        alert("Please fill all fields.");
        return;
    }

    const score = Math.floor(Math.random() * 21) + 80;

    const blueprint = `
🚀 STARTUP BLUEPRINT

Startup Name:
${idea}

━━━━━━━━━━━━━━━━━━

📌 Problem Statement
${problem}

━━━━━━━━━━━━━━━━━━

🎯 Target Audience
${audience}

━━━━━━━━━━━━━━━━━━

💰 Revenue Model
${revenue}

━━━━━━━━━━━━━━━━━━

🔥 Unique Value Proposition

${idea} provides a faster, smarter and more accessible solution compared to traditional alternatives.

━━━━━━━━━━━━━━━━━━

📱 MVP FEATURES

✅ User Authentication

✅ Dashboard

✅ Core ${idea} Functionality

✅ Analytics Panel

✅ User Feedback System

━━━━━━━━━━━━━━━━━━

🛠 Recommended Tech Stack

Frontend:
• React.js
• Tailwind CSS

Backend:
• Node.js
• Express.js

Database:
• MongoDB

Deployment:
• Vercel
• Render

━━━━━━━━━━━━━━━━━━

📅 Development Roadmap

Week 1:
Research & Wireframing

Week 2-3:
Frontend Development

Week 4-5:
Backend Development

Week 6:
Testing

Week 7:
Deployment

━━━━━━━━━━━━━━━━━━

📈 Go-To-Market Strategy

• Build Landing Page
• Share on LinkedIn
• Launch on Product Hunt
• Gather Early Users
• Iterate using Feedback

━━━━━━━━━━━━━━━━━━

⚔ Competitor Analysis

Potential Competitors:
• Existing SaaS Products
• Emerging Startups
• Manual Solutions

Your advantage:
• Better UX
• Lower Cost
• Faster Execution

━━━━━━━━━━━━━━━━━━

📊 SWOT Analysis

Strengths:
• Innovative Idea
• Scalable Model

Weaknesses:
• Initial User Acquisition

Opportunities:
• Growing Digital Market

Threats:
• Competition
• Market Changes

━━━━━━━━━━━━━━━━━━

🎤 Investor Pitch

"${idea} helps ${audience} solve ${problem} through an innovative platform with a scalable ${revenue} business model."

━━━━━━━━━━━━━━━━━━

🏆 Startup Success Score

${score}/100
`;

    document.getElementById("output").innerHTML =
        `<div class="score">Startup Score: ${score}/100</div>${blueprint}`;
}