(function() {
  'use strict';
  module.exports = function(ndx) {
    ndx.app.post('/api/timezone', ndx.authenticate(), function(req, res, next) {
      var where;
      where = {};
      where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID];
      ndx.database.update(ndx.settings.USER_TABLE, {
        timezone: req.body.timezone
      }, where, null, true);
      return res.end('OK');
    });
    return ndx.app.use('/api/*', function(req, res, next) {
      var getTimezoneOffset;
      if (ndx.user) {
        getTimezoneOffset = function(date) {
          var i, len, ref, timezone;
          ref = ndx.user.timezone;
          for (i = 0, len = ref.length; i < len; i++) {
            timezone = ref[i];
            if (date < timezone.date) {
              return timezone.offset;
            }
          }
          return 0;
        };
        ndx.user.getTimezoneOffset = getTimezoneOffset;
        ndx.user.getTimezoneDate = function(d) {
          var utc;
          utc = d.valueOf() + (d.getTimezoneOffset() * 1000 * 60);
          utc += ndx.user.getTimezoneOffset(d.valueOf()) * 1000 * 60;
          return utc;
        };
      }
      return next();
    });
  };

}).call(this);

//# sourceMappingURL=index.js.map
