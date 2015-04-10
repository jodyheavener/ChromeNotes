class Notes {

  constructor() {
    this.notesList = $(".notes-list");
    this.textString = document.querySelectorAll(".select-text")[0];

    this.getNotes((notesData) => {
      Object.keys(notesData).forEach((noteName) => {
        this.notesList.append(this.noteTemplate(noteName, notesData[noteName]));
      });
    });

    $(document).on("click", ".notes-list", (event) => {
      let target = $(event.target);
      let copyText = undefined;

      if (target.is("li")) {
        parent = target
        target = parent.children(".block");
      } else {
        parent = target.closest("li")
        target = parent.children(".block");
      }

      parent.addClass("selected-flash").on("webkitAnimationEnd", () => {
        parent.removeClass("selected-flash");
      })

      this.textString.innerText = target.text();

      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(this.textString);
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand("copy");
    });

    $(document).on("click", ".remove", (event) => {
      let target = $(event.target).closest("li");
      let targetText = target.children(".name").text()
      target.remove();
      delete this.notesData[targetText];
      chrome.storage.sync.set({"notesData": this.notesData});
    });
  };

  noteTemplate(noteName, noteValue) {
    return `
      <li>
        <span class="name">${noteName}</span>
        <span class="block">${noteValue}</span>
        <span class="remove"></span>
      </li>
    `;
  };

  getNotes(callback) {
    chrome.storage.sync.get((data) => {
      this.notesData = data.notesData;
      if (callback) callback(this.notesData);
    });
  };

};

new Notes();
