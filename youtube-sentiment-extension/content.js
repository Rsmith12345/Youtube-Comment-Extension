console.log("YouTube Sentiment Analyzer content script loaded");

function displaySentimentLabel() {
  // Check if the label already exists
  let existingLabel = document.querySelector("#sentiment-label");
  if (existingLabel) return;

  // Create the label element
  const label = document.createElement("div");
  label.id = "sentiment-label";
  label.textContent = "Comments Sentiment: Positive"; // Placeholder sentiment
  label.className = "sentiment-label";

  label.style.marginBottom = "10px";  // Adjust the value as needed


  // Locate the target element (ytd-comments-header-renderer or ytd-comments)
  const targetDiv = document.querySelector("ytd-comments-header-renderer");

  if (targetDiv) {
    // Insert the label after the target element
    targetDiv.insertAdjacentElement("afterend", label); 
    console.log("Sentiment label added.");
  } else {
    console.error("Target div not found.");
  }
}

// Use MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(() => {
  const targetDiv = document.querySelector("ytd-comments-header-renderer");
  if (targetDiv) {
    displaySentimentLabel();
    observer.disconnect(); // Stop observing once the element is found
  }
});

// Start observing the DOM
observer.observe(document.body, { childList: true, subtree: true });
