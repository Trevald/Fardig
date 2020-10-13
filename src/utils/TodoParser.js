class TodoParser {
    parseText(text) {
        const tags = this.extractTagsFromString(text);
        const dateTime = this.extractDateTimeFromString(text);
        const content = this.extractContentFromText(text);

        return {
            content,
            tags,
            dateTime,
        };
    }

    extractTagsFromString(text) {
        let re = /#\S*/gi;
        return text.match(re);
    }

    extractDateTimeFromString(text) {
        let re = /@(tomorrow|today|[0-9\-/]{8,19}),?\s?([0-9:?]{4,5})|@(tomorrow|today|[0-9-/]{8,10})/; // Examples: @2020-04-24, 13:37 | @tomorrow 1337
        const match = text.match(re);

        if (match) {
            const dateString = match[0].toUpperCase().replace("@", "");
            const time =
                match[1] !== undefined
                    ? {
                          hours: match[1].slice(0, 2),
                          minutes: match[1].slice(-2),
                      }
                    : null;
            let date;

            switch (dateString) {
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

    extractContentFromText(text) {
        let tagRe = /#\S*/gi;
        let dateRe = /@(tomorrow|today|[0-9\-/]{8,19}),?\s?([0-9:?]{4,5})|@(tomorrow|today|[0-9\-/]{8,10})/;

        return text.replace(tagRe, "").replace(dateRe, "");
    }
}

exports.TodoParser = TodoParser;
