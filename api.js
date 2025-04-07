import { API_KEY } from "./config.js";

export const apiCall = async(resumeText,jobDetails,prompt)=>{
    if (!resumeText || !jobDetails) {
        alert("Please upload a resume and extract job details first.");
        return;
    }    
    // console.log(resumeText);
    // console.log(jobDetails);
    const api_endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };
    try {
        const response = await fetch(api_endpoint,{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        const data = await response.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Error generating response.";
    }
}