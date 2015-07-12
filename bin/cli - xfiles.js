#!/usr/bin/env node
var args = require(__dirname + '/cli_args - xfiles');
var helper_funcs = require(__dirname + '/../helper_funcs');
var err = helper_funcs.err;
if (args.length < 2)
  err('\n  Too few arguments!\n\n  Please specify both directory paths.');
var DirComparator = require(__dirname + '/../dir_comparator');
var sizify = helper_funcs.sizify;
var countify_files = helper_funcs.countify_files;
var filter = {idr: null, edr: null, ifr: null, efr: null};
var compare_dirs = function(path_1, path_2, cb) {
  new DirComparator(path_1, path_2, filter).
    on('error', function(error) {
      err('\n  Oops!\n\n  Please make sure the paths do point to the directories.\n');
    }).
    on('data', cb);
};
var path_1 = args.shift();
var path_2 = args.shift();
for (var loop_counter = 0; loop_counter < 1; ++loop_counter) {
  arg = args.shift();
  if (arg != undefined)
    arg = arg.toLowerCase();
  switch (arg) {
    case '-md':
    case '-max-depth': {
      arg = args.shift();
      var max_depth = parseInt(arg);
      if (isNaN(max_depth) || max_depth < 1)
        err('\n  Invalid argument: Maximum depth must be a non-zero natural number.\n\n  For assistance, execute:\n\n    xfiles  -h  [command]\n');
      filter.max_depth = max_depth;
      break;
    }
    default:
      args.unshift(arg);
  }
}
var filter_specified = false;
for (var loop_counter = 0; loop_counter < 1; ++loop_counter) {
  arg = args.shift();
  if (arg != undefined)
    arg = arg.toLowerCase();
  switch (arg) {
    case '-o':
    case '-overview': {
      compare_dirs(path_1, path_2, function(dtn_1, dtn_2) {
        console.log(dtn_1 != null ? (('\n  ' + dtn_1.path + '\n  ' + countify_files(dtn_1.no_of_total_files) + ' | ' + sizify(dtn_1.size)) + (dtn_2 != null ? ('\n\n  ' + dtn_2.path + '\n  ' + countify_files(dtn_2.no_of_total_files) + ' | ' + sizify(dtn_2.size)) : '')) : dtn_2 != null ? ('\n  ' + dtn_2.path + '\n  ' + countify_files(dtn_2.no_of_total_files) + ' | ' + sizify(dtn_2.size)) : '');
      });
      return;
    }
    case '-l':
    case '-list': {
      compare_dirs(path_1, path_2, function(dtn_1, dtn_2) {
        console.log(dtn_1 != null ? ('\n  ' + dtn_1.path + '\n  ' + countify_files(dtn_1.no_of_total_files) + ' | ' + sizify(dtn_1.size) + '\n\n  ' + dtn_1.total_files().map(function(file) { return file.path_from_root }).join('\n  ') + (dtn_2 != null ? '\n\n  ────────────────────────────────────────────────────────────────────────────────────────────────────────────\n\n  ' + dtn_2.path + '\n  ' + countify_files(dtn_2.no_of_total_files) + ' | ' + sizify(dtn_2.size) + '\n\n  ' + dtn_2.total_files().map(function(file) { return file.path_from_root }).join('\n  ') : '')) : (dtn_2 != null ? '\n  ' + dtn_2.path + '\n  ' + countify_files(dtn_2.no_of_total_files) + ' | ' + sizify(dtn_2.size) + '\n\n  ' + dtn_2.total_files().map(function(file) { return file.path_from_root }).join('\n  ') : ''));
      });
      return;
    }
    case '-f':
    case '-filter': {
      if (filter_specified)
        err('\n  Invalid arguments.\n\n  For assistance, execute:\n\n    xfiles  -h  [command]\n');
      var i = 0;
      loop_: for (; i < 4; ++i) {
        arg = args.shift();
        if (arg == undefined) {
          break loop_;
        }
        var groups = arg.split(/^-([eiEI][fdFD])[rR](?:-(i|ig|g|gi))?$/);
        if (groups.length != 4)
          break loop_;
        switch (groups[1].toLowerCase()) {
          case 'id':
            try {
              var pattern_string = args.shift();
              if (pattern_string == undefined)
                break loop_;
              filter.idr = new RegExp(pattern_string, groups[2]);
            } catch (error) {
              err('\n  Invalid idr!\n');
            }
            break;
          case 'ed':
            try {
              var pattern_string = args.shift();
              if (pattern_string == undefined)
                break loop_;
              filter.edr = new RegExp(pattern_string, groups[2]);
            } catch (error) {
              err('\n  Invalid edr!\n');
            }
            break
          case 'if':
            try {
              var pattern_string = args.shift();
              if (pattern_string == undefined)
                break loop_;
              filter.ifr = new RegExp(pattern_string, groups[2]);
            } catch (error) {
              err('\n  Invalid ifr!\n');
            }
            break;
          case 'ef':
            try {
              var pattern_string = args.shift();
              if (pattern_string == undefined)
                break loop_;
              filter.efr = new RegExp(pattern_string, groups[2]);
            } catch (error) {
              err('\n  Invalid efr!\n');
            }
            break;
          default:
            break loop_;
        }
      }
      if (i == 0 && filter.idr == null && filter.edr == null && filter.ifr == null && filter.efr == null)
        err('\n  Invalid arguments.\n\n  For assistance, execute:\n\n    xfiles  -h  [command]\n');
      else {
        if (i != 4)
          args.unshift(arg);
        --loop_counter;
        filter_specified = true;
        break;
      }
    }
    default: {
      compare_dirs(path_1, path_2, function(dtn_1, dtn_2) {
        console.log(dtn_1 != null ? (('\n  ' + dtn_1.path + '\n  ' + countify_files(dtn_1.no_of_total_files) + ' | ' + sizify(dtn_1.size) + '\n\n' + dtn_1.tree('  ')) + (dtn_2 != null ? ('\n\n  ────────────────────────────────────────────────────────────────────────────────────────────────────────────\n\n  ' + dtn_2.path + '\n  ' + countify_files(dtn_2.no_of_total_files) + ' | ' + sizify(dtn_2.size) + '\n\n' + dtn_2.tree('  ')) : '')) : dtn_2 != null ? ('\n  ' + dtn_2.path + '\n  ' + countify_files(dtn_2.no_of_total_files) + ' | ' + sizify(dtn_2.size) + '\n\n' + dtn_2.tree('  ')) : '');
      });
      return;
    }
  }
}
