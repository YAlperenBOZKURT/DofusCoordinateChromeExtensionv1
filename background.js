// We only extract the coordinates inside the closed brackets in the copied area in the appropriate format.

function extractCoordinates(inputStr) {
  const regex = /[-+]?\s*\d+(\.\d+)?\s*,\s*[-+]?\s*\d+(\.\d+)?/g;
  const matches = inputStr.match(regex);

  if (matches && matches.length > 0) {
    const formattedCoordinates = matches.map((match) => {
      const [lat, lon] = match.replace(/\s/g, "").split(",");
      const formattedLat = parseFloat(lat).toFixed(0);
      const formattedLon = parseFloat(lon).toFixed(0);
      return `${formattedLat},${formattedLon}`;
    });

    return `/travel ${formattedCoordinates.join(",")}`;
  }

  return "";
}

// Function to be called when right-clicked.
function onContextMenuClick(info, tab) {
  if (info.menuItemId === "myContextMenu" && info.selectionText) {
    // Conversion process from the text inside the closed brackets to the /travel format.
    const formattedText = extractCoordinates(info.selectionText);
    if (formattedText) {
      copyToClipboard(tab.id, formattedText);
    } else {
      console.log("Hatalı format! Kapalı parantez içindeki yazı bulunamadı.");
    }
  }
}

// Copy function
function copyToClipboard(tabId, text) {
  // We copy the text using an interactive content command.
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: copyText,
    args: [text],
  });
}

//  Content command function
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

// Adding an item to the right-click menu.
chrome.contextMenus.create({
  title: "Copy Coordinate",
  contexts: ["selection"],
  id: "myContextMenu",
});

// Listening to the chrome.contextMenus.onClicked event.
chrome.contextMenus.onClicked.addListener(onContextMenuClick);
