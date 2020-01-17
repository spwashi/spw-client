module.exports = {
    presets:
        [
            ['@babel/preset-env', { modules: 'commonjs' }],
            '@babel/preset-flow',
            '@babel/preset-react'
        ],
    plugins:
        [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-private-methods',
        ]
};
