const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { Console } = require('console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODO() {
    const filesTexts = Object.values(getFiles());
    const todoStrings = [];
    for (const fileText of filesTexts) {
        const fileLines = fileText.split('\n');
        for (const line of fileLines) {
            if (line.includes("// TODO")) {
                todoStrings.push(line);
            }
        }
    }
    console.log(todoStrings);
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getTODO();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
