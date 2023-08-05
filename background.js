// We extract only the coordinates within the square brackets from the given input

function extractCoordinates(inputStr) {
  const regex = /[-+]?\s*\d+(\.\d+)?\s*,\s*[-+]?\s*\d+(\.\d+)?/g;
  const matches = inputStr.match(regex);

  if (matches && matches.length > 0) {
    const formattedCoordinates = matches.map((match) => {
      const [lat, lon] = match.replace(/\s/g, '').split(',');
      const formattedLat = parseFloat(lat).toFixed(0);
      const formattedLon = parseFloat(lon).toFixed(0);
      return `${formattedLat},${formattedLon}`;
    });

    return `/travel ${formattedCoordinates.join(',')}`;
  }

  return '';
}

// Function to be called when right-clicked
function onContextMenuClick(info, tab) {
  if (info.menuItemId === "myContextMenu" && info.selectionText) {
    // Extract the text within the square brackets and convert it to the /travel format
    const formattedText = extractCoordinates(info.selectionText);
    if (formattedText) {
      copyToClipboard(tab.id, formattedText);
    } else {
      console.log("Incorrect format! Text within the square brackets not found.");
    }
  }
}

// Copy function
function copyToClipboard(tabId, text) {
  // We copy the text using an interactive content command
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: copyText,
    args: [text],
  });
}

// Content command function
function copyText(text) {
  const input = document.createElement("textarea");
  input.style.position = "fixed";
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

// Adding an item to the context menu
chrome.contextMenus.create({
  title: "Copy Coordinates",
  contexts: ["selection"],
  id: "myContextMenu",
});

// Listening for the chrome.contextMenus.onClicked event
chrome.contextMenus.onClicked.addListener(onContextMenuClick);



