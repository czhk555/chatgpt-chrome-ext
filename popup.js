document.addEventListener("DOMContentLoaded", async () => {
  const inputElement = document.getElementById("apiKeyInput");
  const saveApiKeyButton = document.getElementById("saveApiKeyButton");
  const checkboxElement = document.getElementById("checkbox");
  const reloadText = document.getElementById("reloadText");

  checkboxElement.addEventListener("change", function () {
    chrome.storage.local.set({ isEnebled: this.checked });
    reloadText.style.display = "block";
  });

  let { apiKey } = await chrome.storage.local.get(["apiKey"]);
  let { isEnebled } = await chrome.storage.local.get(["isEnebled"]);

  if (!isEnebled) {
    checkboxElement.checked = false;
  }

  if (apiKey) {
    inputElement.value = "****";
  }

  saveApiKeyButton.addEventListener("click", () => {
    apiKey = inputElement.value;
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
