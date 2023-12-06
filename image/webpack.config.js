const path = require('path');

module.exports = {
    mode: 'production',
    target: 'node',
    node: {
        __dirname: false,
    },
    plugins: [
    ],
    resolve: {
        extensions: ['.js', '.ts']
    },
    entry: './src/app.ts',
    output: {
        filename: 'image.js',
        path: path.resolve(__dirname, 'temp/dist')
    },
    module: {
        rules: [
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                    },
                }
            },
            {
                test: /\.node$/,
                loader: "node-loader",
                options: {
                    name: "[path][name].[ext]",
                },
            },

        ]
    }
};
