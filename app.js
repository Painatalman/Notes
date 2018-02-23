// default node packages
// const fs = require('fs');
// const os = require('os');

// useful to manage arguments, mostly key-value pairs
const yargs = require('yargs');

// local modules
const Notes = require('./notes');

// first argument is node source path
// second is the absolute path for the app
// then come the remaining arguments
// console.log(process.argv);
// const args = process.argv.substring(2);
// const command = process.argv[2];
const argv = yargs
  .command('add', 'Adds a new note', {
    title: {
      describe: 'Title Field',
      demand: true,
      alias: 't'
    },
    body: {
      describe: 'Body Field',
      demand: true,
      alias: 'b'
    }
  })
  .command('list', 'List all notes')
  .command('remove', 'Removes a note according to its title', {
    title: {
      describe: 'Title Field',
      demand: true,
      alias: 't'
    }
  })
  .command('read', 'Displays the note with a specific title', {
    title: {
      describe: 'Title Field',
      demand: true,
      alias: 't'
    }
  })
  // allows you to set the option to show help
  // to something else, like 'helpme'
  // by default, it's 'help', so this part is redundant
  // but it's nice to use as an example
  .help('help')
  .argv;
const command = argv._[0];

let note;

switch (command) {
  case 'add':
    note = Notes.addNote(argv.title, argv.body);
    if (note) {
      console.log(`
        - Note Created! -
        Title: ${note.title}

        ${note.body}
      `);
    }
    break;
  case 'remove':
    let outcome = Notes.removeNote(argv.title);
    if (outcome) {
      console.log(`note ${argv.title} remove successfully`);
    } else {
      console.log(`there was no such note: ${argv.title}`);
    }
    break;
  case 'read':
    // SHAME: could've just used logNote
    note = Notes.getNote(argv.title);
    if (note) {
      console.log(`
        Title: ${note.title}

        ${note.body}
      `);
    } else {
      console.log(`there was no such note: ${argv.title}`);
    }
    break;
  case 'list':
    Notes.logNotes();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    break;
}

// fs.appendFile('test.txt', `Hello, ${os.userInfo().username}\n`); 
