const path = require('path');
const os = require('os');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}
module.exports = {
    entry: {
      main: '@/main'
    },
    output: {
        path: resolve('dist/dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: 'vue-style-loader!css-loader',
                        less: 'vue-style-loader!css-loader!less-loader',
                        scss: 'style-loader!css-loader!sass-loader',
                        sass: 'style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    postLoaders: {
                        html: 'babel-loader'
                    }
                }
            },
            {
                test: /iview\/.*?js$/,
                loader: 'happypack/loader?id=happybabel',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happybabel',
                exclude: /node_modules/
            },
            {
                test: /\.js[x]?$/,
                include: resolve('src'),
                exclude: /node_modules/,
                loader: 'happypack/loader?id=happybabel'
            },
            {
              test:/\.svg$/,
              loader:'svg-sprite-loader',
              include: resolve('src/images/svg')
            },
            {
                test: /\.(gif|jpg|png|svg)\??.*$/,
                loader: 'url-loader?limit=1024&publicPath=../dist/',
                exclude: resolve('src/images/svg'),
            },
            {
                test: /\.(eot|ttf|woff)\??.*$/,
                loader: 'url-loader?limit=1024&publicPath=../dist/'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $:'jquery',
            jQuery:'jquery'
        })
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'swiper': 'swiper/dist/js/swiper.js'
        },
        symlinks:false,
        cacheWithContext:false
    }
};
