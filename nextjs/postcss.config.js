module.exports = {
    plugins: [
        'postcss-flexbugs-fixes',
        [
            'postcss-preset-env',
            {
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
                features: {
                    'custom-properties': false,
                },
            },
        ],
        process.env.NODE_ENV === 'production'
            ? [
                  '@fullhuman/postcss-purgecss',
                  {
                      content: [
                          './src/pages/**/*.{js,jsx,ts,tsx}',
                          './src/components/**/*.{js,jsx,ts,tsx}',
                          //   './node_modules/bootstrap/dist/css/bootstrap.min.css',
                          './src/styles/classes.txt',
                      ],
                      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                      safelist: {
                          standard: [
                              'html',
                              'body',
                              'input',
                              'main',
                              'ol',
                              //   'ul',
                              //   'li',
                              //   'a',
                              //   'button',
                          ],
                          greedy: [/svg__/, /__next/],
                      },
                  },
              ]
            : undefined,
    ],
};
