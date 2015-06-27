module.exports = {
    entry: {
        emit: './src/emit.js',
    },
    resolve:{
        modulesDirectories: [
            'node_modules',
            'src'
        ]
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    output: {
        path: './dist',
        filename: '[name].js',
        library: 'emit',
        libraryTarget: 'umd'
    }
}
