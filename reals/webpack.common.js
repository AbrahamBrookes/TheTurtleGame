const path = require('path')

module.exports = {
    entry: './src/client/client.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@lib': path.resolve(__dirname, 'src/client/lib'),
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/client'),
    },
}