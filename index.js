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
                todoStrings.push(line.slice(index));
            }
        }
    }
    return todoStrings;
}

function getImportant(TODOs) {
    const important = {};
    for (const TODO of TODOs) {
        const count = TODO.split("!").length - 1
        if (count !== 0){
            important[TODO] = count;
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
    const nameDict = {};
    nameDict[null] = [];
    for (const TODO of TODOs) {
        if (TODO.split(';').length >= 3) {
            const part = TODO.split(';')[0];
            let name = part.slice(8);
            if (!Object.keys(nameDict).includes(name)){
                nameDict[name] = [];
            }
            nameDict[name].push(TODO);
        }
        else {
            nameDict[null].push(TODO);
        }
    }

    return nameDict;
}

function getSortDate(TODOs) {
    const sortUserTODO = {};
    for (const TODO of TODOs) {
        let splitedTODO = TODO.split(';');
        if (splitedTODO.length >= 3) {
            let date = splitedTODO[1].trim();
            sortUserTODO[TODO] = date;
        }
        else {
            sortUserTODO[TODO] = 0;
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
            console.log(getImportant(TODOs).keys());
            break;
        case 'sort importance':
            let importantTODOs = getImportant(TODOs);
            var items = Object.keys(importantTODOs).map(key => [key, importantTODOs[key]]);
            items.sort((first, second) => second[1] - first[1]);
            console.log(items.map(x => x[0]));
            break;
        case 'sort user':
            let usersDict = getSortUser(TODOs);
            var items = Object.keys(usersDict).map(key => [key, usersDict[key]]);
            console.log(items.sort());
            break;
        case 'sort date':
            let sortByDateTODO = getSortDate(TODOs);
            var items = Object.keys(sortByDateTODO).map(key => [key, sortByDateTODO[key]]);
            items.sort((a, b) => {
                let dateA = a[1] === "0" ? new Date(0) : new Date(a[1]);
                let dateB = b[1] === "0" ? new Date(0) : new Date(b[1]);
                return dateB - dateA;
            });
            console.log(items.map(x => x[0]));
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
