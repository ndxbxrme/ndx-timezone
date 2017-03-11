'use strict'

module.exports = (ndx) ->
  ndx.app.post '/api/timezone', ndx.authenticate(), (req, res, next) ->
    where = {}
    where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID]
    ndx.database.update ndx.settings.USER_TABLE, 
      timezone: req.body.timezone
    , where, null, true
    res.end 'OK'
  getUserOffset = (date, userId, cb) ->
    where = {}
    where[ndx.settings.AUTO_ID] = userId
    ndx.database.select ndx.settings.USER_TABLE, where, null, true, (users) ->
      if users and users.length and users[0].timezone
        for timezone in users[0].timezone
          if date.valueOf() < timezone.date
            return cb? timezone.offset
      return cb? 0
  ndx.timezone =
    getUserOffset: getUserOffset
    getCurrentUserOffset: (date) ->
      if ndx.user and ndx.user.timezone
        for timezone in ndx.user.timezone
          if date.valueOf() < timezone.date
            return timezone.offset
      0
    getDate: (date, userId, cb) ->
      getUserOffset date, userId, (offset) ->
        utc = date.valueOf() + (date.getTimezoneOffset() * 60000)
        utc += offset * 60000
        utc