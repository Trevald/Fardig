module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        devtool: "source-map",
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Fardig",
            },
        },
    },
};
