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
            const index = line.indexOf("// TODO");
            if (index == 0 || index > 0 && line[index - 1] != "\"") {
                todoStrings.push(line);
            }
        }
    }
    return todoStrings;
}

function getImportant(TODOs) {
    const important = [];
    for (const TODO of TODOs) {
        if (TODO.includes('!')){
            important.push(TODO);
        }
    }
    return important;
}

function getTODOUser(TODOs, user) {
    const userTODO = [];
    for (const TODO of TODOs) {
        if (TODO.includes(user)){
            userTODO.push(TODO);
        }
    }
    return userTODO;

}

function getSortUser(TODOs) {
    const sortUserTODO = [];
    for (const TODO of TODOs) {
        if (TODO.split(';').length >= 3) {
            sortUserTODO.unshift(TODO);
        }
        else {
            sortUserTODO.push(TODO);
        }
    }
    return sortUserTODO;
}

function processCommand(command) {
    const TODOs = getTODO();
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(TODOs);
            break;
        case 'important':
            console.log(getImportant(TODOs));
            break;
        case 'sort user':
            console.log(getSortUser(TODOs));
            break;
        default:
            if (command.includes('user')) {
                let user = command.split(" ")[1];
                console.log(getTODOUser(TODOs, user));
                break;
            }
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
