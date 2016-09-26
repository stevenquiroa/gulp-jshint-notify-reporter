# gulp-jshint-notify-reporter

Gulp jshint reporter, send system notification when error or waning is triggered.

## Usage

```js
var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('lint', function() {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe( notificator() );
});
```

## Options

Plugin options:

- `warning_length`
  - Default is `3`
  - Define how many warnings show in notification.

- `error_length`
  - Default is `3`
  - Define how many errors show in notification.
