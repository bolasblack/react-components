import path from 'path'
import Sass from 'sass'
import webpack from 'webpack'
import { isDev, NODE_ENV } from './consts'

export interface WebpackConfigOptions {
  /** Webpack.Configuration['context'], default is process.cwd() */
  context?: string
  /** Default false in production and true in development */
  cssSourceMap?: boolean
}

export class WebpackConfig {
  private readonly context: string

  private readonly cssSourceMap: boolean

  constructor(private options: WebpackConfigOptions = {}) {
    this.context = this.options.context || process.cwd()
    this.cssSourceMap = this.options.cssSourceMap == null ? isDev : this.options.cssSourceMap
  }

  public readonly basicConfig = {
    mode: NODE_ENV === 'production' ? 'production' : 'development',
    context: this.context,
    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#sourcemap
    // > cheap-source-map options don't work with this plugin.
    devtool: isDev ? 'cheap-source-map' : 'source-map',
    resolve: <webpack.Resolve>{
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      mainFields: ['typescript:main', 'jsnext:main', 'module', 'main'],
    },
    output: <webpack.Output>{
      devtoolModuleFilenameTemplate: info => {
        const resourcePath = info.resourcePath.startsWith('/')
                           ? path.relative(this.context, info.resourcePath)
                           : info.resourcePath
        return `webpack:///${resourcePath}`
      },
    },
  }

  public readonly tsRules = [
    {
      test: /\.tsx?$/,
      use: [
        'react-hot-loader/webpack',
        {
          loader: 'babel-loader',
          options: {
            rootMode: "upward",
          },
        },
        'ts-loader',
        {
          loader: 'astroturf/loader',
          options: { extension: '.scss' },
        }
      ],
    },
    {
      test: /\.tsx?$/,
      enforce: 'pre',
      use: [{
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
        },
      }],
    },
  ]

  public readonly cssRules = [
    {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            sourceMap: this.cssSourceMap,
          },
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: this.cssSourceMap,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: this.cssSourceMap,
            config: {
              path: __dirname,
            },
          },
        },
      ]
    },
  ]

  public readonly scssRules = [
    {
      test: /\.(scss|sass)$/,
      use: [
        this.cssRules[0].use,
        {
          loader: 'sass-loader',
          options: {
            sourceMap: this.cssSourceMap,
            outputStyle: 'compressed',
            implementation: Sass,
          },
        },
      ],
    },
  ]

  public readonly assetsRules = [
    {
      test: /\.(svg|svgz)$/,
      issuer: /(\.tsx?)$/,
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: 'react-svg-loader',
          options: {
            svgo: svgoConfig,
          },
        },
      ],
    },
    {
      test: /\.(svg|svgz)$/,
      issuer: /\.(less|css|sass|scss)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
  ]

  public readonly plugins = [
    new webpack.ProvidePlugin({
      regeneratorRuntime: 'regenerator-runtime',
      React: 'react',
      ReactDOM: 'react-dom',
    }),
  ]
}

const svgoConfig = {
  plugins: [
    { removeTitle: true },
    {
      // https://github.com/svg/svgo/blob/174c37208017e5909d5f7db2e8faba49663a945a/plugins/removeAttrs.js#L22
      removeAttrs: {
        attrs: ['stroke', 'stroke-width'],
      },
    },
  ],
  floatPrecision: 2,
}
