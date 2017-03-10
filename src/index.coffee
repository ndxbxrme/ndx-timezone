'use strict'

module.exports = (ndx) ->
  ndx.app.post '/api/timezone', ndx.authenticate(), (req, res, next) ->
    where = {}
    where[ndx.settings.AUTO_ID] = ndx.user[ndx.settings.AUTO_ID]
    ndx.database.update ndx.settings.USER_TABLE, 
      timezone: req.body.timezone
    , where, null, true
    res.end 'OK'
  ndx.app.use '/api/*', (req, res, next) ->
    if ndx.user
      getTimezoneOffset = (date) ->
        for timezone in ndx.user.timezone
          if date < timezone.date
            return timezone.offset
        0
      ndx.user.getTimezoneOffset = getTimezoneOffset
      ndx.user.getTimezoneDate = (d) ->
        utc = d.valueOf() + (d.getTimezoneOffset() * 1000 * 60)
        utc += ndx.user.getTimezoneOffset(d.valueOf()) * 1000 * 60
        utc
    next()