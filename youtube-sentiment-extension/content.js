console.log("YouTube Sentiment Analyzer content script loaded");

let debounceTimeout;
const DEBOUNCE_DELAY = 2000;  // 2 seconds debounce delay

// Function to fetch sentiment analysis from backend
async function fetchSentimentAnalysis(comments) {
  
  // Debounce the request to avoid excessive calls
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/analyze_sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comments })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sentiment analysis');
      }

      const data = await response.json();
      displaySentimentLabel(data.sentiment);  // Displaying sentiment label

    } catch (error) {
      console.error("Error fetching sentiment analysis:", error);
    }
  }, DEBOUNCE_DELAY);  // Wait for 2 seconds after the last comment change
}

function extractComments() {
  // Selecting all text content of comments inside the comment section
  const commentElements = document.querySelectorAll('ytd-comment-thread-renderer #content-text, ytd-comment-renderer #content-text');
  
  // Mapping over the elements to extract and return the text content of each comment
  return Array.from(commentElements).map(el => el.textContent.trim());
}

function displaySentimentLabel(sentiment) {
  
  let existingLabel = document.querySelector("#sentiment-label");

  if (!existingLabel) {
    // Create the label element if it doesn't exist
    existingLabel = document.createElement("div");
    existingLabel.id = "sentiment-label";
    existingLabel.className = "sentiment-label";

    // Locate the target element (ytd-comments-header-renderer or ytd-comments)
    const targetDiv = document.querySelector("ytd-comments-header-renderer");

    if (targetDiv) {
      // Inserting the label in the correct location
      targetDiv.insertAdjacentElement("afterend", existingLabel);
      console.log("Sentiment label added.");
    } else {
      console.error("Target div not found.");
    }
  }

  // Setting the text content based on the sentiment
  existingLabel.textContent = `Sentiment Analysis: ${sentiment}`;

  // Adding the class based on sentiment
  existingLabel.classList.remove('positive', 'negative', 'neutral');

  if (sentiment === "Positive") {
    existingLabel.classList.add("positive");
  } else if (sentiment === "Negative") {
    existingLabel.classList.add("negative");
  } else if (sentiment === "Neutral") {
    existingLabel.classList.add("neutral");
  }
}

// Function to wait for the comment section to load
function waitForComments() {
  
  const targetNode = document.querySelector("ytd-comments");  // This is the main comment section container
  if (targetNode) {
    // Starting the observer once comments are found
    startObserver(targetNode);
  } else {
    console.log("ytd-comments not found, retrying...");
    // Retry after 2 seconds if comments are not found
    setTimeout(waitForComments, 2000);
  }
  
}

function startObserver(targetNode) {
  const observer = new MutationObserver(async () => {
    const comments = extractComments();
    if (comments.length > 0) {
      fetchSentimentAnalysis(comments);  // Call the function to get sentiment analysis
    }
  });

  // Observe changes within the comment section
  observer.observe(targetNode, { childList: true, subtree: true });
  console.log("MutationObserver started on comment section.");
}

// Start waiting for the comments section to load :)
waitForComments();
