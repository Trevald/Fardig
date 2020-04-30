function main(args, database, fs) {
        const action = getAction(args);
        const text = getText(args);

        switch(action) {
            case "ADD": 
            case "A": 
            case "AD": 
                addTodo(text, database, fs);
                break;
            case "LS":
                console.log("What to do:");
                console.table(database);
                break;
            default:
                console.log("Help text ...");
                
                break;
        }
    }

function addTodo(text, database, fs) {
    let todo = parseText(text, database);
    
    database.push(todo); 

    fs.writeFile("./database.json",  JSON.stringify(database), "utf8", (err) => {
        if (err) {
            return console.error(err);
        } else {
            console.info("Added !");
        }
    })

}

function getAction(args) {
    return args.length > 0 ? args[0].toUpperCase() : undefined;
}

function getText(args) {
    return args.length > 1 ? args.slice(1).join(" ") : undefined;
}

function parseText(text, database) {
    const tags = extractTagsFromString(text);
    const dateTime = extractDateTimeFromString(text);
    const content = extractContentFromText(text);
    const id = database.length;

    return {
        id,
        content,
        tags,
        dateTime
    }
}

function extractTagsFromString(text) {
    let re = /#\S*/gi
    return text.match(re);
}

function extractDateTimeFromString(text) {
    let re = /@(tomorrow|today|[0-9\-\/]{8,19}),?\s?([0-9\:?]{4,5})|@(tomorrow|today|[0-9\-\/]{8,10})/; // Examples: @2020-04-24, 13:37 | @tomorrow 1337
    const match = text.match(re);

    if (match) {
        const dateString = match[0].toUpperCase().replace("@", "");
        const time = match[1] !== undefined ? 
            {
                hours: match[1].slice(0,2),
                minutes: match[1].slice(-2)
            } : null;
        let date;
    console.log(dateString);
        switch(dateString) {
            case "TODAY":
                date = new Date();
                break;
            case "TOMORROW":
                date = new Date();
                date.setDate(date.getDate() + 1);
                break;
            default:
                date = new Date(dateString);
                break;
        }

        if (time) {
            date.setHours(time.hours);
            date.setMinutes(time.minutes);
        } else {
            date.setHours(9);
            date.setMinutes(0);
        }
        date.setSeconds(0);

        return date;
    }
}

function extractContentFromText(text) {
    let tagRe = /#\S*/gi;
    let dateRe = /@(tomorrow|today|[0-9\-\/]{8,19}),?\s?([0-9\:?]{4,5})|@(tomorrow|today|[0-9\-\/]{8,10})/;

    return text.replace(tagRe, "").replace(dateRe, "");
} 

exports.main = main;