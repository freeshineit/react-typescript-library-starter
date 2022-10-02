module.exports = function () {
  return {
    visitor: {
      ImportDeclaration(path, source) {
        if (path.node.source.value.endsWith('.scss')) {
          path.node.source.value = path.node.source.value.replace(
            /\.scss$/,
            '.css'
          );
          console.log(path.node.source.value);
        }
      },
    },
  };
};
