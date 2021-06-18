module.exports = function (options) {
  return {
    optimization: {
      usedExports: true,
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: options.module.rules[0].use[0].options,
            },
          ],
        },
      ],
    },
  };
};
