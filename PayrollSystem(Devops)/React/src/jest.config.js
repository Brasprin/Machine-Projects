module.exports = {
  reporters: [
    'default',
    ['jest-silent-reporter', { useDots: true }],
    ['jest-junit', { outputDirectory: './reports', outputName: 'jest-report.xml' }]
  ]
};