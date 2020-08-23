module.exports = api => {
    const isProd = api.env('production');
    const { minimum_chrome_version } = require(`./src/manifest.${isProd ? 'prod' : 'dev'}.json`);
    const envPreset = [
        '@babel/env',
        {
            modules: false,
            targets: minimum_chrome_version
                ? `Chrome > ${minimum_chrome_version}`
                : 'last 2 Chrome versions',
            useBuiltIns: 'usage',
            corejs: 3,
        },
    ];

    return {
        presets: [envPreset],
        plugins: ['@babel/plugin-transform-runtime'],
    };
};