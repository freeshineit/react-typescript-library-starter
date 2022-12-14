const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
// const path = require("path");
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const through = require('through2');
const vite = require('vite');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const tsconfig = require('./tsconfig.json');
const packageJson = require('./package.json');
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

function clean() {
  return del(['./lib/**', './docs/**', './dist/**']);
}

const srcDir = `./src/lib`;

const packageName = packageJson.name.split('/');
const filename =
  packageName.length > 1 ? packageName[packageName.length - 1] : packageName[0];

// 驼峰
const libraryName = filename.replace(/\-(\w)/g, function (all, letter) {
  return letter.toUpperCase();
});

const banner = `/*
* ${filename}.js v${packageJson.version}
* (c) ${new Date().getFullYear()} ${packageJson.author}
* Released under the MIT License.
*/`;

function buildStyle() {
  return gulp
    .src([`${srcDir}/**/*.scss`], {
      base: srcDir,
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        autoprefixer({
          overrideBrowserslist: 'iOS >= 10, Chrome >= 49',
        }),
      ])
    )
    .pipe(gulp.dest('./lib/es'))
    .pipe(gulp.dest('./lib/cjs'));
}

function copyAssets() {
  return gulp
    .src(`${srcDir}/assets/**/*`)
    .pipe(gulp.dest('lib/assets'))
    .pipe(gulp.dest('lib/es/assets'))
    .pipe(gulp.dest('lib/cjs/assets'));
}

function buildCJS() {
  return gulp
    .src(['lib/es/**/*.js'])
    .pipe(
      babel({
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      })
    )
    .pipe(gulp.dest('lib/cjs/'));
}

function buildES() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
    isolatedModules: false,
  });
  return gulp
    .src([`${srcDir}/**/*.{ts,tsx}`], {
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(tsProject)
    .pipe(
      babel({
        plugins: ['./scripts/babel-transform-scss-to-css'],
      })
    )
    .pipe(gulp.dest('lib/es/'));
}

function buildDeclaration() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
    isolatedModules: false,
    declaration: true,
    emitDeclarationOnly: true,
  });
  return gulp
    .src([`${srcDir}/**/*.{ts,tsx}`], {
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(tsProject)
    .pipe(gulp.dest('lib/es/'))
    .pipe(gulp.dest('lib/cjs/'));
}

function getViteConfigForPackage({ env, formats, external }) {
  const name = filename;
  const isProd = env === 'production';
  // https://github.com/vitejs/vite/blob/main/packages/vite/src/node/config.ts
  return {
    root: process.cwd(),
    mode: env,
    logLevel: 'silent',
    define: { 'process.env.NODE_ENV': `"${env}"` },
    // Set to `false` or an empty string to disable copied static assets to build dist dir.
    publicDir: false,
    build: {
      lib: {
        name: libraryName,
        entry: './lib/es/index.js',
        formats,
        fileName: format => `${name}.${format}${isProd ? '' : `.${env}`}.js`,
      },
      rollupOptions: {
        external,
        output: {
          dir: './lib/bundle',
          // exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      minify: isProd ? 'esbuild' : false,
    },
  };
}

async function buildBundles(cb) {
  const envs = ['development', 'production'];
  const configs = envs.map(env =>
    getViteConfigForPackage({
      env,
      formats: ['es', 'cjs', 'umd'],
      external: ['react', 'react-dom'],
    })
  );

  await Promise.all(configs.map(config => vite.build(config)));
  cb && cb();
}

function buildCompatibleUMD() {
  return gulp
    .src(`lib/bundle/${filename}.umd.js`)
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                chrome: '49',
                ios: '9',
              },
            },
          ],
        ],
      })
    )
    .pipe(rename(`${filename}.compatible.umd.js`))
    .pipe(gulp.dest('lib/bundle/'))
    .pipe(rename(`${filename}.js`))
    .pipe(gulp.dest('lib/umd/'));
}

// Deprecated
function umdWebpack() {
  return gulp
    .src('lib/es/index.js')
    .pipe(
      webpackStream(
        {
          output: {
            filename: `${filename}.js`,
            library: {
              type: 'umd',
              name: libraryName,
            },
          },
          mode: 'production',
          optimization: {
            usedExports: true,
          },
          performance: {
            hints: false,
          },
          resolve: {
            extensions: ['.js', '.json'],
          },
          plugins: [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: 'report/report.html',
            }),
            new StatoscopeWebpackPlugin({
              saveReportTo: 'report/statoscope/report.html',
              saveStatsTo: 'report/statoscope/stats.json',
              open: false,
            }),
          ],
          module: {
            rules: [
              {
                test: /\.js$/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      [
                        '@babel/preset-env',
                        {
                          loose: true,
                          modules: false,
                          targets: {
                            chrome: '49',
                            ios: '10',
                          },
                        },
                      ],
                      '@babel/preset-typescript',
                      '@babel/preset-react',
                    ],
                  },
                },
              },
              {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                type: 'asset/inline',
              },
              {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
              },
            ],
          },
          externals: [
            {
              react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React',
              },
              'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM',
              },
            },
          ],
        },
        webpack
      )
    )
    .pipe(gulp.dest('lib/umd/'));
}

function copyMetaFiles() {
  return gulp.src(['./README.md', './LICENSE.txt']).pipe(gulp.dest('./lib/'));
}

function generatePackageJSON() {
  return gulp
    .src('./package.json')
    .pipe(
      through.obj((file, enc, cb) => {
        const rawJSON = file.contents.toString();
        const parsed = JSON.parse(rawJSON);
        delete parsed.scripts;
        delete parsed.devDependencies;
        delete parsed.publishConfig;
        delete parsed.files;
        delete parsed.resolutions;
        delete parsed.packageManager;
        const stringified = JSON.stringify(parsed, null, 2);
        file.contents = Buffer.from(stringified);
        cb(null, file);
      })
    )
    .pipe(gulp.dest('./lib/'));
}

exports.umdWebpack = umdWebpack;
exports.buildBundles = buildBundles;

exports.default = gulp.series(
  clean,
  buildES,
  buildCJS,
  gulp.parallel(buildDeclaration, buildStyle),
  copyAssets,
  copyMetaFiles,
  generatePackageJSON,
  buildBundles,
  buildCompatibleUMD,
  umdWebpack
);
