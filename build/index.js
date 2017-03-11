(function() {
  'use strict';
  module.exports = function(ndx) {
    var getUserOffset;
    ndx.app.post('/api/timezone', ndx.authenticate(), function(req, res, next) {
      var where;
      where = {};
      where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID];
      ndx.database.update(ndx.settings.USER_TABLE, {
        timezone: req.body.timezone
      }, where, null, true);
      return res.end('OK');
    });
    getUserOffset = function(date, userId, cb) {
      var where;
      where = {};
      where[ndx.settings.AUTO_ID] = userId;
      return ndx.database.select(ndx.settings.USER_TABLE, where, null, true, function(users) {
        var i, len, ref, timezone;
        if (users && users.length && users[0].timezone) {
          ref = users[0].timezone;
          for (i = 0, len = ref.length; i < len; i++) {
            timezone = ref[i];
            if (date.valueOf() < timezone.date) {
              return typeof cb === "function" ? cb(timezone.offset) : void 0;
            }
          }
        }
        return typeof cb === "function" ? cb(0) : void 0;
      });
    };
    get;
    return ndx.timezone = {
      getUserOffset: getUserOffset,
      getCurrentUserOffset: function(date) {
        var i, len, ref, timezone;
        if (ndx.user && ndx.user.timezone) {
          ref = ndx.user.timezone;
          for (i = 0, len = ref.length; i < len; i++) {
            timezone = ref[i];
            if (date.valueOf() < timezone.date) {
              return timezone.offset;
            }
          }
        }
        return 0;
      },
      getDate: function(date, userId, cb) {
        return getUserOffset(date, userId, function(offset) {
          var utc;
          utc = date.valueOf() + (date.getTimezoneOffset() * 60000);
          utc += offset * 60000;
          return utc;
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=index.js.map
