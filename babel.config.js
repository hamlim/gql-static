module.exports = function(api) {
  api.cache(true)
  return {
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-modules-commonjs',
    ],
  }
}
