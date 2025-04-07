import * as pdfjsLib from "./libs/pdfjs/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./libs/pdfjs/pdf.worker.mjs";

export async function extractTextFromResume(data, type) {
    if (type === "application/pdf") {
        
        try {
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(" ") + "\n";
            }
            return text.trim();
        } catch (error) {
            console.error("PDF extraction error:", error);
            throw new Error("Error processing PDF: " + error.message);
        }
    } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // For Word documents, you would need a server-side solution or additional libraries
        // This is a placeholder
        return "Word document support requires additional processing. Consider converting to PDF.";
    }
    
    return "Unsupported file format: " + type;
}