import { extractTextFromResume } from "./extractText.js";
import { parseResume } from "./parseResume.js";

document.getElementById("resumeForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const statusElement = document.getElementById("status");
    statusElement.textContent = "Processing resume...";
    
    let fileInput = document.getElementById("resumeUpload");
    let file = fileInput.files[0];
    
    if (!file) {
        statusElement.textContent = "Please select a file first.";
        return;
    }
   
    let reader = new FileReader();
    reader.onload = async function (e) {
        let arrayBuffer = e.target.result;
        try {
            let text = await extractTextFromResume(arrayBuffer, file.type);
            let {name, email, phone, education, skills, experience} = await parseResume(text);
            let resumeText = `
            Education: ${education}
            Skills: ${skills}
            Experience: ${experience}
            `;
           
            browser.storage.sync.set({
                resumeText: resumeText, 
                email: email, 
                phone: phone, 
                name: name
            }, () => {
                statusElement.textContent = "Resume processed successfully! Redirecting...";
                
                // Close this tab and open/focus the popup
                setTimeout(() => {
                    browser.runtime.sendMessage({ action: "resumeUploaded" });
                    window.close();
                }, 1500);
            });
           
        } catch (error) {
            console.error("Error extracting text from resume:", error);
            statusElement.textContent = "Failed to extract text from resume: " + error.message;
        }
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById("resumeUpload").addEventListener("change", function() {
    const fileName = this.files[0] ? this.files[0].name : "No file chosen";
    document.getElementById("fileName").textContent = fileName;
});