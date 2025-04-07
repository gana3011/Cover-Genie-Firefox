const url = window.location.href;

browser.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (message.action === "extractJobDetails") {
        let companyElement, positionElement, jobDescriptionElement;
        if(/^https:\/\/www\.linkedin\.com\/jobs\//.test(url)){
            companyElement = document.querySelector(".job-details-jobs-unified-top-card__company-name");
            positionElement = document.querySelector(".job-details-jobs-unified-top-card__job-title h1 a");
            jobDescriptionElement = document.getElementById("job-details");
            
        }
        else if(/^https?:\/\/www\.naukri\.com\/job-listings/.test(url)){
            companyElement = document.querySelector(".styles_jd-header-comp-name__MvqAI a");
            positionElement = document.querySelector(".styles_jd-header-title__rZwM1");
            jobDescriptionElement = document.querySelector(".styles_JDC__dang-inner-html__h0K4t");
        }

        else if(/^https?:\/\/in\.indeed\.com/.test(url)){
            companyElement = document.querySelector(".jobsearch-JobInfoHeader-companyNameSimple");
            positionElement = document.querySelector('h2[data-testid="simpler-jobTitle"]');
            jobDescriptionElement = document.getElementById("jobDescriptionText");
        }
        
        let companyName = companyElement ? companyElement.innerText.trim() : "Company Not Found";
        let position = positionElement ? positionElement.innerText.trim() : "Position Not Found"; 
        let jobDescription = jobDescriptionElement ? jobDescriptionElement.innerText.trim() : "Job Description not Found";
    
    
        sendResponse({ companyName, position, jobDescription});
    }
    return true; 
});