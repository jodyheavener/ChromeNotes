// Open Options page on Browser Action click
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({
    "url": chrome.extension.getURL("options.html")
  });
});

// Create a dummy element we can set the text of to copy to the clipboard
let textStringElement = document.createElement("span");
document.body.appendChild(textStringElement);

// Set up notes data variable
let notesData = undefined;
getNotesData();

// Retrieve all existing notes data
function getNotesData() {
  chrome.storage.sync.get((data) => {
    notesData = data.notesData || {};
  });
};

// Save notes data to Chrome sync
function setNotesData() {
  chrome.storage.sync.set({"notesData": notesData}, () => {
    getNotesData();
  });
};

// Parse a note from a string with a colon in it
function parseNote(inputText) {
  let splitValues = inputText.split(/:(.+)?/);
  let noteName = splitValues[0].replace(/^ | $/g, "");
  let noteValue = splitValues[1].replace(/^ | $/g, "");

  notesData[noteName] = noteValue;
  setNotesData();
};

// Parse a note from a string with a colon in it
function copyToClipboard(text) {
  textStringElement.innerText = text;

  let selectionRange = document.createRange();
  selectionRange.selectNode(textStringElement);
  window.getSelection().addRange(selectionRange);

  document.execCommand("copy");
};

// Clear notes data
function clearData() {
  notesData = undefined;
  chrome.storage.sync.clear();
};

chrome.omnibox.onInputEntered.addListener((inputText) => {
  inputText = inputText.replace(/^ | $/g, "");

  if (inputText.indexOf(":") != -1) return parseNote(inputText);

  let removeParts = inputText.split(" ");
  if (removeParts[0] === "remove") {
    let textWithoutRemove = inputText.substr(inputText.indexOf(" ") + 1);
    if (notesData[textWithoutRemove]) {
      delete notesData[textWithoutRemove];
      setNotesData();
    }
  } else if (notesData[inputText]) {
    copyToClipboard(notesData[inputText]);
  }
});

// Update the suggestions as the user types
chrome.omnibox.onInputChanged.addListener((inputText, suggest) => {
  if (inputText.indexOf(":") != -1) return;

  let removeParts = inputText.split(" ");
  if (removeParts[0] === "remove") {
    let textWithoutRemove = inputText.substr(inputText.indexOf(" ") + 1);
    if (notesData[textWithoutRemove]) {
      suggest([{
        content: `remove ${textWithoutRemove} `,
        description: `${chrome.i18n.getMessage("removeNote")}: <match>${textWithoutRemove}</match>`
      }]);
    }
  } else {
    let suggestions = [];

    let partialMatches = Object.keys(notesData).filter((noteName) => {
      return noteName.toLowerCase().indexOf(inputText.toLowerCase()) != -1;
    })

    partialMatches.forEach((matchName) => {
      suggestions.push({
        content: `${matchName} `,
        description: `${chrome.i18n.getMessage("savedNote")}: <match>${matchName}</match> – <url>${notesData[matchName]}</url>`
      });
    });

    suggest(suggestions);
  }
});
