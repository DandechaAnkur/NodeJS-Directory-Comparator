var EventEmitter = require('events').EventEmitter;
var util = require('util');
var DirTree = require('dir_tree');
var DirTreeNode = DirTree.DirTreeNode;
var helper_funcs = require(__dirname + '/helper_funcs');
var async_map = helper_funcs.async_map;
var default_comparator = function(dtn_1, dtn_2) {
  return dtn_1.name.toLowerCase() == dtn_2.name.toLowerCase();
};
var equal_eles = function(arr_1, arr_2, comparator) {
  var lesser_length = arr_1.length < arr_2.length ? arr_1.length : arr_2.length;
  var eq_eles = [new Array(lesser_length), new Array(lesser_length)];
  var k = 0;
  var skip_1 = {};
  var skip_2 = {};
  for (var index_1 = 0; index_1 < arr_1.length; ++index_1)
    for (var index_2 = 0; index_2 < arr_2.length; ++index_2) {
      var ele_1 = arr_1[index_1];
      var ele_2 = arr_2[index_2];
      if (!skip_1[index_1] && !skip_2[index_2] && comparator(ele_1, ele_2)) {
        eq_eles[0][k] = ele_1;
        eq_eles[1][k] = ele_2;
        ++k;
        skip_1[index_1] = skip_2[index_2] = true;
        break;
      }
    }
  eq_eles[0].length = k;
  eq_eles[1].length = k;
  return eq_eles;
};
var compare_dirs = function(dtn_1, dtn_2, comparator) {
  var files_1 = dtn_1.files;
  var files_2 = dtn_2.files;
  var eq_eles = equal_eles(files_1, files_2, comparator);
  var no_of_eqs = eq_eles[0].length;
  for (var j = 0; j < no_of_eqs; ++j) {
    eq_eles[0][j].disjoin();
    eq_eles[1][j].disjoin();
  }
  var dirs_1 = dtn_1.dirs;
  var dirs_2 = dtn_2.dirs;
  eq_eles = equal_eles(dirs_1, dirs_2, comparator);
  no_of_eqs = eq_eles[0].length;
  for (var i = 0; i < no_of_eqs; ++i)
    compare_dirs(eq_eles[0][i], eq_eles[1][i], comparator);
};
function DirComparator(dir_1, dir_2, filter, comparator) {
  EventEmitter.call(this);
  var self = this;
  function emit_(event_name) {
    var args = [];
    for (var i = 1; i < arguments.length; ++i)
      args.push(arguments[i]);
    if (self.listeners(event_name).length == 0) {
      var cb_setter = function(event_name_) {
        if (event_name_ == event_name) {
          self.removeListener(event_name, cb_setter);
          arguments[1].apply(null, args);
        }
      }
      self.on('newListener', cb_setter);
    } else
      self.emit.apply(self, [event_name].concat(args));
  }
  if (filter instanceof Function) {
    comparator = filter;
    filter = {idr: null, edr: null, ifr: null, efr: null};
  } else {
    if (!(comparator instanceof Function))
      comparator = default_comparator;
    switch (filter) {
      case undefined:
      case null:
        filter = {idr: null, edr: null, ifr: null, efr: null};
        break
      default:
        if (!(filter instanceof Object))
          filter = {idr: null, edr: null, ifr: null, efr: null};
    }
  }
  if (typeof dir_1 == 'string' && typeof dir_2 == 'string')
    async_map(
      [{path: dir_1, filter: filter}, {path: dir_2, filter: filter}],
      function(dir, cb) {
        new DirTree(dir.path, dir.filter).
          on('error', cb).
          on('data', function(dtn) {
            cb(null, dtn);
          });
      },
      function(error, dtns) {
        if (error) {
          emit_('error', error);
          return;
        }
        var dtn_1 = dtns[0];
        var dtn_2 = dtns[1];
        if (dtn_1 != null && dtn_2 != null)
          compare_dirs(dtn_1, dtn_2, comparator);
        if (dtn_1 != null) {
          dtn_1.remove_fileless_dirs();
          if (dtn_1.no_of_total_files == 0)
            dtn_1 = null;
        }
        if (dtn_2 != null) {
          dtn_2.remove_fileless_dirs();
          if (dtn_2.no_of_total_files == 0)
            dtn_2 = null;
        }
        emit_('data', dtn_1, dtn_2);
      }
    );
  else if (dir_1 instanceof DirTreeNode && dir_2 instanceof DirTreeNode) {
    compare_dirs(dtn_1, dtn_2, comparator);
    dtn_1.remove_fileless_dirs();
    dtn_2.remove_fileless_dirs();
    emit_('data', dtn_1.no_of_total_files == 0 ? null : dtn_1, dtn_2.no_of_total_files == 0 ? null : dtn_2);
  } else
    emit_('error', new Error('Invalid Arguments! Arguments can be a pair of strings or dir_tree.DirTreeNode Objects only.'));
};
util.inherits(DirComparator, EventEmitter);
module.exports = DirComparator;
