const getName = () => {
    return new Promise((resolve) => {
        browser.storage.sync.get("name", (data) => {
            let name = data.name;
            if (Array.isArray(name)) {
                name = name[0];
            }
            resolve(name || "Name not available");
        });
    });
};

const getResumeText = () => {
    return new Promise((resolve) => {
        browser.storage.sync.get("resumeText", (data) => {
            resolve(data.resumeText || "Resume data not available");
        });
    });
};

const redirect = async () => {
    const name = await getName();
    const resumeText = await getResumeText();  
    if (name && resumeText &&
        name !== "Name not available" &&
        resumeText !== "Resume data not available") {
        location.replace("home.html");
    }
};

redirect();

document.querySelector('.custom-file-upload').addEventListener('click', function(e) {
    e.preventDefault();
    browser.tabs.create({
        url: "fileupload.html"
    });
    window.close();
});

document.getElementById("resumeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    browser.tabs.create({
        url: "fileupload.html"
    });
    window.close();
});