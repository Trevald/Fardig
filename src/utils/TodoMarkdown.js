export default class TodoMarkdown {

    

    paragraph(text) {

    }


}


const renderer = {
    paragraph(text) {
        const re = /^\[[\s|x]\].*$/gmi
        const re2 = /(\[[\s|x]\])/gmi
        const hasTodos  = text.match(re);

        console.log("text", text);
        
        // Break if no todos
        if (!hasTodos) {
            return `<p>${text}</p>`;
        }
        const textLines = text.split(/\r?\n/);
        
        let returnValue = "";
        textLines.forEach(textLine => {
            let isTodo = textLine.match(re2);
            if (isTodo) {
                const todoIndicator = isTodo[0];
                const isTicked = todoIndicator.includes("x");                        
                returnValue+= `<p data-type="app_todo" data-done="${isTicked}">${textLine.replace(todoIndicator, "")}</p>`;                        
            } else {
                returnValue+=`<p>${textLine}</p>`;
            }
        });

        return returnValue;
    }
}
marked.use({ renderer });
const content = marked(TEXT_FILE);
