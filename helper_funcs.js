var err = module.exports.err =
  function(msg) {
    console.log(msg);
    process.exit(-1);
  };
var async_series = module.exports.async_series =
  function(funcs, cb) {
    var lefts_right = cb instanceof Function ? cb : function() {};
    while (funcs.length > 0)
      lefts_right =
        (function(func, next_func) {
          return function() {
            func(function(error) {
              if (error) {
                if (cb instanceof Function)
                  cb(error);
                return;
              }
              next_func();
            });
          };
        })(funcs.pop(), lefts_right);
    lefts_right();
  };
var async_map = module.exports.async_map =
  function(vals, iterator, cb) {
    var results = new Array(vals.length);
    var j = 0;
    var cb_called = false;
    var provide_cb = function(index) {
      return function(error, data) {
        if (cb_called)
          return;
        if (error) {
          cb_called = true;
          cb(error);
          return;
        }
        results[index] = data;
        if (++j == vals.length) {
          cb_called = true;
          cb(null, results);
        }
      };
    };
    for (var i = 0; i < vals.length; ++i)
      iterator(vals[i], provide_cb(i));
  };
var sep_at_thousands = module.exports.sep_at_thousands =
  function(number) {
    return number.toLocaleString('en-US');
  };
var countify = module.exports.countify =
  function(number, singular, plural) {
    return sep_at_thousands(number) + ' ' + (number === 1 ? singular : plural);
  };
var sizify = module.exports.sizify =
  function(number) {
    var str = countify(number, 'Byte', 'Bytes');
    var suffixes = [' KB', ' MB', ' GB', ' TB'];
    while (number /= 1024, Math.floor(number) > 0)
      str += ' | ' + sep_at_thousands(number) + suffixes.shift();
    return str;
  };
var countify_files = module.exports.countify_files =
  function(number) {
    return countify(number, 'File', 'Files');
  };
