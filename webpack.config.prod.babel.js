import webpack from 'webpack';
import path from 'path';

export default {
  entry: [
    'babel-regenerator-runtime',
    path.resolve(__dirname, 'src/')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        WEBPACK: true
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        use: {
          loader: 'babel-loader',
        },
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  mode: 'production'
};
