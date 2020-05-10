import TurndownService from "turndown"

export default class Markdown {

    constructor() {
        this.createToMarkdownConverter();
    }

    createToMarkdownConverter() {
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

    convertToMarkdown(html) {
        const markdown = this.turndownService.turndown(html);

        return markdown;
    } 

}