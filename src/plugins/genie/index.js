import Commands from "./Commands";
import defaultCommands from "./default-commands";

const Genie = {
    install(vue, args = {}) {
        if (this.intalled) {
            return;
        }

        // Set up object
        this.installed = true;
        this.params = args;
        this.name = "genie";

        const commands = new Commands();

        // Add default commands
        defaultCommands.forEach((command) => {
            commands.addCommand(command);
        });

        vue.prototype["$" + this.name] = commands;
    },
};

export default Genie;
