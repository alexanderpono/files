module.exports = {
    plugins: [
        '@babel/plugin-transform-class-properties',
        [
            'module-resolver',
            {
                alias: {
                    '@src': './src',
                    '@': './'
                }
            }
        ]
    ],
    env: {
        production: {
            plugins: []
        },
        development: {
            plugins: []
        }
    }
};
