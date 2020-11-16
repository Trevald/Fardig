const version = require("./package.json").version;

module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        devtool: "source-map",
    },
    chainWebpack: (config) => {
        config.plugin("define").tap((args) => {
            console.log("args", args);
            args[0]["process.env"].APP_VERSION = JSON.stringify(version);
            return args;
        });
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Fardig",
            },
        },
    },
};
