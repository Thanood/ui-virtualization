export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-animator-css')
    .plugin('aurelia-ui-virtualization');
    // .feature('features');

  aurelia.start().then(a => a.setRoot());
}
