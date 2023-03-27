document.addEventListener("DOMContentLoaded", () => {
  const summarizeButton = document.getElementById("summarize");
  summarizeButton.addEventListener("click", () => {
    const inputElement = document.getElementById("apiKeyInput");
    const apiKey = inputElement.value;
    if (!apiKey) {
      document.getElementById("errorDiv").style.display = "block";
    } else {
      chrome.storage.local.set({ apiKey }, function () {
        console.log("Value saved to local storage", apiKey);
      });
      inputElement.value = "";
      window.close();
    }
  });
});
