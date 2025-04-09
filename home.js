import { apiCall } from "./api.js";

let jobDetails;

// Get user's name from storage
const getUserName = () => {
    return new Promise((resolve) => {
        browser.storage.sync.get("name", (data) => {
            resolve(Array.isArray(data.name) ? data.name[0] : data.name || "User");
        });
    });
};

//user email from storage
const getUserEmail = () => {
    return new Promise((resolve) => {
        browser.storage.sync.get("email", (data) => {
            resolve(data.email|| "Email");
        });
    });
};

//user phone no from storage
const getUserPhone = () => {
    return new Promise((resolve) => {
        browser.storage.sync.get("phone", (data) => {
            resolve(data.phone || "Phone");
        });
    });
};

const userName = await getUserName();

document.getElementById("greeting").innerHTML =  `Welcome to CoverGenie<br>${userName}`;

// Extract job details
browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) {
        alert("No active tab found.");
        return;
    }


    browser.tabs.sendMessage(tabs[0].id, { action: "extractJobDetails" }, async (response) => {
        // browser.tabs.reload(tabs[0].id);
        if (browser.runtime.lastError) {
            console.error("Error:", browser.runtime.lastError.message);
            alert("Could not extract job details.");
            return;
        }
        
        if (response && response.companyName) {
            document.getElementById("companyName").innerText = `Name : ${response.companyName}`;
            document.getElementById("jobTitle").innerText = `Position: ${response.position}`;
            jobDetails = `
            Company Name: ${response.companyName}
            Job Title: ${response.position}
            Job Description: ${response.jobDescription}
            `;
        } else {
            alert("Failed to extract job details. Please make sure you're on a job listing page.");
        }
    });
});

const getPersonalDetails = async ()=>{
    const email = await getUserEmail();
    const phone = await getUserPhone();
    return {email,phone};
}


// Function to get resume text from Chrome storage
const getResumeText = () => {
    return new Promise((resolve) => {
        browser.storage.sync.get("resumeText", (data) => {
            resolve(data.resumeText || "Resume data not available");
        });
    });
};

// Add event listeners to both buttons
document.querySelectorAll("#generateCoverLetter, #generateDm").forEach((button) => {
    button.addEventListener("click", async () => {
        if (!jobDetails) {
            alert("Job details are not available yet. Please wait.");
            return;
        }
        button.disabled = true;

        try {
            const resumeText = await getResumeText();
            const {email,phone} = await getPersonalDetails();
            console.log(email);
            console.log(phone);
            console.log(userName);
            let prompt = "";

        if (button.id === "generateCoverLetter") {
            prompt = `Generate a personalized and compelling cover letter based on the following resume details:

            Candidate Information:
            - **Name:** ${userName}
             - **Phone:** ${phone}
            - **Email:** ${email}
            Resume:
            ${resumeText}
            
            Job Description:
            ${jobDetails}
            
            Ensure the cover letter is tailored to the job role, highlighting relevant skills, experience, and enthusiasm for the position. Maintain a professional yet engaging tone, keeping the length between 250-300 words.`;
        } else if (button.id === "generateDm") {
            prompt = `Generate a concise and engaging LinkedIn DM to reach out to a recruiter or hiring manager based on the following details:
- **Name:** ${userName}

Resume:
${resumeText}

Job Description:
${jobDetails}

Ensure the message is polite, professional, and clearly conveys interest in the role. Keep it short (2-3 sentences) and include a call to action, such as asking for a quick chat or more details about the job.`;
        }

        // Call the API and update the textarea
        const responseText = await apiCall(resumeText, jobDetails, prompt);
        const coverLetterTextarea = document.getElementById("coverLetter");
        coverLetterTextarea.value = responseText;
        } 
        catch (error) {
        console.error("Error generating:", error);
        alert("An error occurred while generating. Please try again.");
        }
        finally{
            button.disabled = false;
        }
    });
});

// Copy to clipboard
document.getElementById("copy").addEventListener("click", () => {
    const coverLetterTextarea = document.getElementById("coverLetter");
    coverLetterTextarea.select();
    navigator.clipboard.writeText(coverLetterTextarea.value)
        .then(() => alert("Copied to clipboard"))
        .catch((err) => console.error("Failed to copy:", err));
});

document.getElementById("download").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const coverLetterText = document.getElementById("coverLetter").value;

    const paragraphs = coverLetterText.split("\n").map(p => p.trim()).filter(p => p.length > 0);
    const tableData = paragraphs.map(paragraph => [paragraph]);

    doc.autoTable({
        startY: 30,
        margin: { left: 10, right: 10 },
        body: tableData,
        styles: { fontSize: 12, cellWidth: 'auto', halign: 'justify' }, 
        theme: 'plain' 
    });
    doc.save("CoverGenie.pdf");
});


document.getElementById("home").addEventListener("click", () => {
    browser.storage.sync.clear(() => {
        setTimeout(() => {
            window.location.href = "popup.html";
        }, 500);
    });
});

