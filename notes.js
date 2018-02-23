const fs = require('fs');

let notes = [];
const fileName = 'notes.json';

let isLoaded = false;

function load() {
  console.log('loading...');

  try {
    notes.push(...JSON.parse(fs.readFileSync(fileName)));
  } catch (e) {
    console.warn(
      "file-related error, will override or generate new one"
    );
  }

  isLoaded = true;  
}

function save() {
  fs.writeFileSync(fileName, JSON.stringify(notes));
}

function hasDuplicates(title) {
  return notes.find(note => note.title === title);
}

function loadIfNeeded(func) { 
  return function(...args) {
    if (!isLoaded) {
      load();
    }

    return func.call(null, ...args);
  }; 
}

module.exports.addNote = loadIfNeeded((title, body) => {
  let noteOrFailure = {
    title,
    body
  };

  if (!hasDuplicates(title)) {
    notes.push(noteOrFailure);
    save();
  } else {
    console.log('Note with such title already exists');
    noteOrFailure = false;
  }

  return noteOrFailure;
});

module.exports.getNotes = loadIfNeeded(() => {
  return notes;
});

/**
 * return true if there actually was a deletion
 */
module.exports.removeNote = loadIfNeeded((title) => {
  const noteLength = notes.length;

  notes = notes.filter(note => note.title !== title);

  save();

  return notes.length !== noteLength;
});

module.exports.getNote = loadIfNeeded((title) => {
  return notes.find(note => note.title === title);
});

const logNote = note => {
  console.log(`
  ----
  Title: ${note.title}

  ${note.body}
  ----
  `);
}

module.exports.logNote = logNote;

module.exports.logNotes = loadIfNeeded(() => {
  console.log(`Printing ${notes.length} notes:`);
  notes.forEach(logNote);
});
