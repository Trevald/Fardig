import { Node } from 'tiptap'
import { textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'

import AppTodo from "./AppTodo";

export default class AppTodoNode extends Node {

    get name() {
        return 'app_todo'
    }

    get schema() {
        return {
        // here you have to specify all values that can be stored in this node
        attrs: {
            text: { default: null },
            datetime: { default: null },
            tags: { default: [] },
            notification: { default: null}
        },

        
        marks: "",
        content: "text*",
        group: 'block', 
        selectable: true,
        defining: true,
        draggable: false,
        isText: true,
        
        parseDOM: [{
            priority: 51,
            tag: `[data-type="${this.name}"]`
        }],
        
        toDOM: () => {
            return ["p", {
                "data-type": this.name
            }]
        }
    }
  }

  // this command will be called from menus to add a todo
  // `type` is the prosemirror schema object for this todo
  // `schema` is a collection of all registered nodes and marks
  commands({ type, schema, attrs }) {
    return () => toggleBlockType(type, schema.nodes.paragraph, attrs)
  }

    // here you can register some shortcuts
    // in this case you can create a todo with `ctrl` + `>`
    keys({ type, schema, attrs }) {
        return {
            'Ctrl-t': toggleBlockType(type, schema.nodes.paragraph, attrs)
        }
    }

    // a todo will be created when you are on a new line and type `[` followed by a space
    inputRules({ type }) {
        return [
            textblockTypeInputRule(/^\[\s$/, type),
        ]
    }  

  // return a vue component
  // this can be an object or an imported component
  
    get view() {
        return AppTodo;
    }

}