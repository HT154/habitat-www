exports.config = {
  bundles: [
    { components: ['hab-test'] }
  ],
  collections: []
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
