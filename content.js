document.addEventListener("DOMContentLoaded", function () {
    // Get the button element when the DOM is loaded
    var button = document.getElementById("btn");
  
    // If the button element exists, add a click event listener to it
    if (button) {
      button.addEventListener("click", function () {
        // Add the URL of the website you want to go to here.
        var targetURL = "https://www.dofuspourlesnoobs.com/";
  
        // Use the tabs.create method to open a new tab and navigate to the target URL.
        chrome.tabs.create({ url: targetURL });
      });
    }
  });
  