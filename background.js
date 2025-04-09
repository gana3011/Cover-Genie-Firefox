browser.runtime.onMessage.addListener((message) => {
  if (message.action === "resumeUploaded") {
      browser.browserAction.openPopup();
  }
});