```

---------------------------
   T E R M I N O L O G Y
---------------------------

  Dir,
    is used as the short form for the word Directory.

  DTN,
    is used as the acronym of Dir Tree Node.
    DirTreeNode is a Class whose properties & methods can be found
    documented at,
      git: https://github.com/DandechaAnkur/NodeJS-Directory-Tree
      npm: https://www.npmjs.com/package/dir_tree

-----------------------------
   I N T R O D U C T I O N
-----------------------------

  This is a NodeJS module.
  It can find the difference between two directories in terms of files.

  The module exports an EventEmitter Class - DirComparator.

  Its constructor takes the 2 target dir paths as its arguments.

  Its object will emit either an error event or a data event depending
  on whether it failed or succeeded.

---------------
   U S A G E
---------------

  var DirComparator = require('dir_comparator')

  var dir_comparator_obj =

    new DirComparator(dir_1, dir_2, filter, comparator_func)

      // These parameters are discussed further below.

  dir_comparator_obj.on('error', function(error) {

    // The error is an Error Object.
    // The error handling can be done here.

  })

  dir_comparator_obj.on('data', function(dtn_1, dtn_2) {

    // dtn_1 & dtn_2 are DirTreeNode Objects.

    // They themselves contain the mutually exclusive files.

    // dtn_1 corresponds to the dir_1 &
    // dtn_2 corresponds to the dir_2.

    // dtn_1 will have the files missing in dtn_2 & vice versa.

    // dtn_1 will be null if dir_1 has no files exclusive to dir_2
    // & vice versa.

  })

-------------------------
   P A R A M E T E R S
-------------------------

[01] dir_1 & dir_2
     -----   -----

  Both of them can be either strings or DirTreeNode Objects.

  They correspond to the two target dirs' paths.

  In the case that they are strings will the filters be applied.


[02] filter
     ------

  When the dir_1 & dir_2 are strings, the filter can be used
  to filter the files & the dirs using patterns.

  Specifying the filter is optional.

  The filter is an Object that should have the following structure:

    {
      idr,        // RegExp Object
      edr,        // RegExp Object
      ifr,        // RegExp Object
      edr,        // RegExp Object
      max_depth  // positive integer
    }

  All these properties are optional too.

  The filter.max_depth is a positive integer that can control the
  depth of a dir tree i.e, how deep inside to go from its root dir.

  Through the filter you can,

    1. choose to compare only the specific file & dir paths,

    2. ignore specific file & dir paths from being compared at all.

  These --> idr, edr, ifr, efr <-- are RegExp Objects or patterns
  that one can use to filter files & directories.

  Let's call,
    idr - include dir regex
    edr - exclude dir regex
    ifr - include file regex
    efr - exclude file regex

  File filtering logic:
  --------------------

    A dir will be searched only if it's not excluded.
      (its path isn't like edr)
      An excluded dir will not be searched at all.

    After that, if the dir is not included (path isn't like idr),
      then the "files of this dir" will be skipped.
      Though the "dirs of this dir" will be considered for search.

    Whenever a compatible dir is found (path is idr-edr passed),
      each of the "files of this dir" is tested:
        to be not excluded (path isn't like efr) and
        to be included (path is like ifr).
      If so then the file is considered a successful match.

  If you do not want to utilize any of the idr, edr, ifr, efr, then
  pass null or undefined instead; or even simpler, just omit that
  property in the filter itself.

[03] comparator_func
     ---------------

  By default, the module will compare the names of the files & the dirs.

  To override this behaviour pass a Function as the comparator_func.

    function(dtn_1, dtn_2) {

      // this function will compare the two DirTreeNode Objects passed
      // to it and will return true if they are equal, false otherwise.

      // note that this function has to handle both the dir & the file
      // type DTN Objects.

    }

  Specifying the comparator_func is optional.

----------------------------
   A  C.L.I.  T H I N G Y
----------------------------

  There's also a CLI tool in the package, named:

    xfiles

  It can find by names the mutually exclusive files in the stated two dirs.

  Use:
  ---

    It can show you the mutually exclusive files as embedded into the
    two dir trees corresponding to your two stated dirs.

    It can tell you the total sizes & the total counts of those files
    as well as list those files too.

  To know more on using the CLI tool, simply execute:

    xfiles

  Finally, you may want to have a look at the demo example packaged
  inside.

```
