module.exports = {
    entry   : './test/index',

    output  : {
        filename : 'index.js'
    },

    module: {
        loaders: [
            {
                test    : /\.js$/,
                include : /(src|test)/,
                loader  : 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },

    resolve : {
        modulesDirectories : ['node_modules'],
        extensions : ['', '.js']
    },

    resolveLoader : {
        modulesDirectories : ['node_modules'],
        moduleTemplates : ['*-loader', '*']
    },

    watchOptions : {
        aggregateTimeout : 100
    },

    devtool : 'eval'
};