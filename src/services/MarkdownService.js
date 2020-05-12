import TurndownService from "turndown"
const marked = require('marked');

export default class Markdown {

    constructor() {
        this.initToMarkdownConverter();
    }

    initToMarkdownConverter() {
        this.turndownService = new TurndownService({
            headingStyle: "atx",
        });     

        this.turndownService.addRule('todo', {
            filter: (node) => {
                return node.getAttribute("data-type") === "app_todo";  // [data-type="${this.name}"]
            },
            replacement: function (content, node) {
                const state = node.getAttribute("data-state") === "done" ? "x" : " ";
                return `[${state}] ${content}\n`;
            }
        });        
    }

    fromHTML(html) {
        const markdown = this.turndownService.turndown(html);

        return markdown;
    } 

    getMarkedRenderer() {
        return {
            paragraph(text) {
                console.log("markedRendererParagraph");
                const re = /^\[[\s|x]\].*$/gmi
                const re2 = /(\[[\s|x]\])/gmi
                const hasTodos  = text.match(re);
                
                // Break if no todos
                if (!hasTodos) { return `<p>${text}</p>`; }
                const textLines = text.split(/\r?\n/);
                let returnValue = "";
                
                textLines.forEach(textLine => {
                    let isTodo = textLine.match(re2);
                    if (isTodo) {
                        const todoIndicator = isTodo[0];
                        const state = todoIndicator.includes("x") ? "done" : "not started";
                        returnValue+= `<p data-type="app_todo" data-state="${state}">${textLine.replace(todoIndicator, "")}</p>`;                        
                    } else {
                        returnValue+=`<p>${textLine}</p>`;
                    }
                });

                return returnValue;
            }
        }
    }

    toHTML(markdown) {
        const renderer = this.getMarkedRenderer();
        marked.use({renderer})
        
        return marked(markdown);    
    }

}