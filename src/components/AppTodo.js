import { Node } from 'tiptap'
import { textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'


export default class AppTodo extends Node {

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
    return {
      // there are some props available
      // `node` is a Prosemirror Node Object
      // `updateAttrs` is a function to update attributes defined in `schema`
      // `view` is the ProseMirror view instance
      // `options` is an array of your extension options
      // `selected` is a boolean which is true when selected
      // `editor` is a reference to the TipTap editor instance
      // `getPos` is a function to retrieve the start position of the node
      // `decorations` is an array of decorations around the node
      props: ['node', 'updateAttrs', 'view'],
      
        computed: {
            content() {
                return "";
            }
        },

      template: `
        <div class="todo" style="display: flex; justify-content: flex-start; align-items: flex-start">
            <input type="checkbox">
            <div class="todo-content" ref="content" :contenteditable="view.editable.toString()"></div>
        </div>
      `,
    }
    
  }
 

}