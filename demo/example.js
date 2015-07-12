var DirTree = require('dir_tree');
var DirComparator = require(__dirname + '/../dir_comparator');
var sep = require('path').sep;

var helper_funcs = require(__dirname + '/../helper_funcs');
var err = helper_funcs.err;
var sizify = helper_funcs.sizify;
var countify_files = helper_funcs.countify_files;
var async_series = helper_funcs.async_series;

var A = __dirname + sep + 'DummyDirs' + sep + 'A';
var B = __dirname + sep + 'DummyDirs' + sep + 'B';

var funcs = [];

[['A', A], ['B', B]].forEach(function(pair) {
  funcs.push(function(notify_async) {
    new DirTree(pair[1]).
      on('error', notify_async).
      on('data', function(dtn) {
        if (dtn == null)
          err('\n  Oops!\n  Unable to read dirs!');
        console.log('\n  The "' + pair[0] + '" dir:\n\n' + dtn.tree('    '));
        notify_async();
      });
  });
});

funcs.push(function(notify_async) {

  // Let's find differeces between dirs a & b..
  var dco = new DirComparator(A, B);

  dco.on('error', notify_async);

  dco.on('data', function(dtn_A, dtn_B) {
    console.log('\n\n  --------------------\n\n\n  Mutually exclusive files in the dirs "A" & "B" are as follows:');
    [dtn_A, dtn_B].forEach(function(dtn) {
      if (dtn == null)
        return;
      console.log('\n    ' + dtn.path + '\n    ' + countify_files(dtn.no_of_total_files) + ' | ' + sizify(dtn.size) + '\n\n' + dtn.tree('    '));
    });
    notify_async();
  });
});

funcs.push(function(notify_async) {

  // Let's provide our own comparator..

  // By default the comparision of names is case-insensitive.
  // Let's make it case-sensitive.
  var comparator_func = function(dtn_A, dtn_B) {

    return dtn_A.name == dtn_B.name;
  };

  var dco = new DirComparator(A, B, comparator_func);

  dco.on('error', notify_async);

  dco.on('data', function(dtn_A, dtn_B) {
    console.log('\n\n  --------------------\n\n\n  Case-sensitive comparision:');
    [dtn_A, dtn_B].forEach(function(dtn) {
      if (dtn == null)
        return;
      console.log('\n    ' + dtn.path + '\n    ' + countify_files(dtn.no_of_total_files) + ' | ' + sizify(dtn.size) + '\n\n' + dtn.tree('    '));
    });
    notify_async();
  });
});

funcs.push(function(notify_async) {

  // Let's ignore 1.txt files "in both dirs"..
  var dco = new DirComparator(A, B, {efr: /1\.txt$/});

  dco.on('error', notify_async);

  dco.on('data', function(dtn_A, dtn_B) {
    console.log('\n\n  --------------------\n\n\n  Let\'s revert to the case-insensitive comparision & ignore 1.txt files:');
    [dtn_A, dtn_B].forEach(function(dtn) {
      if (dtn == null)
        return;
      console.log('\n    ' + dtn.path + '\n    ' + countify_files(dtn.no_of_total_files) + ' | ' + sizify(dtn.size) + '\n\n' + dtn.tree('    '));
    })
    notify_async();
  });
});

funcs.push(function(notify_async) {

  // Let's restrict it to finding the differenes at only the first level of the child dirs..
  var dco = new DirComparator(A, B, {max_depth: 1});

  dco.on('error', notify_async);

  dco.on('data', function(dtn_A, dtn_B) {
    console.log('\n\n  --------------------\n\n\n  Now let\'s restrict it to finding the differenes at only the first level of the child dirs:');
    [dtn_A, dtn_B].forEach(function(dtn) {
      if (dtn == null)
        return;
      console.log('\n    ' + dtn.path + '\n    ' + countify_files(dtn.no_of_total_files) + ' | ' + sizify(dtn.size) + '\n\n' + dtn.tree('    '));
    })
    notify_async();
  });
});

async_series(funcs);
