let selectionButton = null;
let speechBubble = null;

function createSelectionButton() {
  const button = document.createElement("button");
  const container = document.createElement("div");
  const icon = document.createElement("img");
  const text = document.createElement("span");

  const svgCode = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
  <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>OpenAI icon</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`;
  const svgUri = "data:image/svg+xml," + encodeURIComponent(svgCode);
  icon.src = svgUri;
  icon.alt = "Summarize with GPT";

  // Set text content of button
  text.innerHTML = `Summarize with <br/> <span style="font-size: 1.5rem; font-weight: bold;">ChatGPT</span>`;

  // Add icon and text to container
  container.appendChild(icon);
  container.appendChild(text);

  // Add container to button
  button.appendChild(container);

  button.classList.add("selection-button");
  button.addEventListener("click", onSelectionButtonClick, false);
  return button;
}

function createSpeechBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("speech-bubble");
  return bubble;
}

function onMouseUp(event) {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    if (!selectionButton) {
      selectionButton = createSelectionButton();
      document.body.appendChild(selectionButton);
    }

    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    selectionButton.style.left = `${rect.left + window.scrollX}px`;
    selectionButton.style.top = `${rect.top + window.scrollY - 60}px`;
    selectionButton.style.display = "block";
  } else if (selectionButton) {
    selectionButton.style.display = "none";
  }
}

function onSelectionButtonClick(event) {
  event.stopPropagation();

  if (!speechBubble) {
    speechBubble = createSpeechBubble();
    document.body.appendChild(speechBubble);
  }

  const buttonRect = selectionButton.getBoundingClientRect();
  speechBubble.style.left = `${buttonRect.right + window.scrollX + 10}px`;
  speechBubble.style.top = `${buttonRect.top + window.scrollY}px`;
  speechBubble.style.display = "block";

  const selectedText = window.getSelection().toString();
  speechBubble.textContent = "Generating summary...";

  getSummaryFromChatGPT(selectedText).then((gptSummary) => {
    speechBubble.textContent = gptSummary;
  });

  document.addEventListener("click", onDocumentClick, false);
}

function onDocumentClick(event) {
  if (event.target !== selectionButton && event.target !== speechBubble) {
    speechBubble.style.display = "none";
    document.removeEventListener("click", onDocumentClick, false);
  }
}

function onDocumentKeyDown(event) {
  if (event.key === "Escape" && modal && modal.style.display === "flex") {
    modal.style.display = "none";
  }
}

async function getSummaryFromChatGPT(text) {
  try {
    // Get the value from the ext local storage
    const { apiKey } = await chrome.storage.local.get(["apiKey"]);
    console.log("API Value is:", apiKey);

    const apiUrl = "https://api.openai.com/v1/completions";
    const prompt = `Please summarize the following text:\n${text}\nSummary:`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.log("data.error :>> ", data.error);
      return data.error.code;
    }
    const summary = data.choices[0].text.trim();

    return summary;
  } catch (error) {
    console.log("error", error);
    return "Error loading summary: " + error.message;
  }
}

document.addEventListener("mouseup", onMouseUp, false);
document.addEventListener("keydown", onDocumentKeyDown, false);
