module.exports = {
    'plugins': [
        'postcss-flexbugs-fixes',
        [
            'postcss-preset-env',
            {
                'autoprefixer': {
                    'flexbox': 'no-2009'
                },
                'stage': 3,
                'features': {
                    'custom-properties': false
                }
            }
        ],
        [
            '@fullhuman/postcss-purgecss',
            {
                content: [
                    './src/pages/**/*.{js,jsx,ts,tsx}',
                    './src/components/**/*.{js,jsx,ts,tsx}',
                    './node_modules/bootstrap/dist/css/bootstrap.min.css'
                ],
                defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                safelist: {
                    standard: ['html', 'body', 'input', 'active', 'border-top-0', 'disabled', 'show', 'stack'],
                    greedy: [
                        /svg__/, /react-tel-input/,
                        /add-to-cart/, /fade/, /collapse/, /cart/, // animations
                        // /align/, /bg/, /breadcrumb/, /btn/, /col/, /row/, /container/, /card/, /offcanvas/,
                        // /hstack/, /justify/, /list-group/,
                        // /navbar/, /nav-/, /pagination/, 
                        /page-.*/,
                        // /form-control/, /form-floating/, /dropdown/, /input-group/,
                        // /[pm].?(-..)?-(\d|auto)/, /order(-..)?-(\d|auto)/, /offset(-..)?-(\d|auto)/,
                        // /h\d/, /gap-\d/, /display-\d/,
                        // /d(-..)?-(block|none|flex|grid)/,
                        // /text-/,
                        // /w-\d+/,
                    ]
                }
            }
        ],
    ]
}