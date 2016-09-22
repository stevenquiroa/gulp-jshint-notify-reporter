const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jsValidate = require('gulp-jsvalidate');
const exec = require('child_process').exec;
const map = require('map-stream');
const notifier = require('node-notifier');
const path = require('path');

const paths = {
  'scripts': ['public/scripts/*.js']
};

var notificator = function ( config ) {

	return map(function ( file, cb ) {
		if ( ! file.jshint.success ) {
			var errors = [];
			var warnings = [];
			var codes = { W: 0, E: 0 };
			var codesFun = { W: function(result) {
				if ( warnings.length <= 3 ) {
				  	// console.log(result.error.line);
				  	warnings.push(result.file + ': line '+ result.error.line + 
			  							' col ' + result.error.character + 
			  							', ' + result.error.raw) ;
			  	}
			}, E: function(result){
				if ( errors.length <= 3 ) {
				  	// console.log(result.error.line);
				  	errors.push(result.file + ': line '+ result.error.line + 
			  							' col ' + result.error.character + 
			  							', ' + result.error.raw) ;
			  	} 
			} };

			(file.jshint.results||[]).forEach(function( result ) {
			  var code = result.error.code[0];
			  codes[code]++;
			  // console.log(code);
			  codesFun[code](result);
			});

			var displayNotification = function(code, arr) {
				var image = {
					'W' : ['Warnings', '/assets/img/gulp.png'],
					'E' : ['Errors', '/assets/img/gulp-error.png']
				}
				// console.log(code, arr);
				var arrStr = arr.join('\n');

				notifier.notify({
				  'title': "JShint "+ image[code][0] + ": "+ codes[code],
				  'message': arrStr,
				  'icon' : path.join(__dirname, image[code][1] )
				});

			}
			
			if ( codes['E'] > 0 ) {	displayNotification('E', errors); }
			if ( codes['W'] > 0 ) { displayNotification('W', warnings);	}
		}
		cb(null, file);
	});
}

var scripts = function (event) {
  // if ( typeof event !== "object" ) { return gulp.src; }
  var type = event.type;
  var gulpath = event.path || paths.scripts;

  if (type === 'changed') {
	 
    return gulp.src( gulpath )
      .pipe( jshint() )
      .pipe( jshint.reporter('default') )
      .pipe( notificator() );
  }
  return gulp.src(gulpath);
}
gulp.task('scripts', scripts);

gulp.task('watch', function(){
  var watcher = gulp.watch( paths.scripts );
  watcher.on('change', scripts);
});

gulp.task('default', ['watch', 'scripts']);