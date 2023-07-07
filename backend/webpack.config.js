const path = require('path');

module.exports = {
  entry: './server.js', // Specify the entry point of your backend application
  output: {
    path: path.resolve(__dirname, 'dist'), // Specify the output directory for the bundled code
    filename: 'bundle.js', // Specify the output file name
  },
  // Add any necessary loaders, plugins, or other configuration options
};