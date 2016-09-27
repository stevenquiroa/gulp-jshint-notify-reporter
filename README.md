# gulp-jshint-notify-reporter

Send native system notifications when an error or warning occur.

## Instalation

`npm install gulp-jshint-notify-reporter --save`


## Usage

```js
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var notificator = require('gulp-jshint-notify-reporter');

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
  - Default: `3`
  - Define how many warnings are shown up.

- `error_length`
  - Default: `3`
  - Define how many errors are shown up.
