var fs = require('fs')
var args = process.argv.slice(2)
const docs = __dirname + '/cli_docs - xfiles'
var help = function(command) {
  switch(command) {
    case '-o':
    case '-overview':
      return fs.readFileSync(docs + '/-overview.txt').toString()
    case '-f':
    case '-filter':
      return fs.readFileSync(docs + '/-filter.txt').toString()
    case '-md':
    case '-max-depth':
      return fs.readFileSync(docs + '/-max-depth.txt').toString()
    case '-h':
      return fs.readFileSync(docs + '/-h.txt').toString()
    case '-l':
    case '-list':
      return fs.readFileSync(docs + '/-list.txt').toString()
    default:
      console.log('\n  Invalid arguments.\n\n  For assistance, execute:\n\n    xfiles  -h  [command]\n');
      process.exit(-1);
   }
}
switch (args.length) {
  case 0:
    console.log(help('-h'))
    process.exit(0)
  case 1:
    switch (args[0].toLowerCase()) {
      case '-h':
      case '-help':
        console.log(help('-h'))
        process.exit(0)
    }
    break
  default:
    switch (args[0].toLowerCase()) {
      case '-h':
      case '-help':
        console.log(help(args[1]))
        process.exit(0)
    }
}
module.exports = args
