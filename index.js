var map = require('map-stream');
var notifier = require('node-notifier');
var path = require('path');

var notificador = function ( opt ) {

	//Funciones unicamente para el objeto:
	function merge_options(obj1,obj2){
	    var obj3 = {};
	    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	    return obj3;
	}

	//Inicializando las variables default
	config = {
		"warning_length" : 3,
		"error_length" : 3
	};

	//haciendo un merge si config existe
	if ( opt  && typeof opt === 'object') {
		config = merge_options(config, opt);
	};

	return map(function ( file, cb ) {
		if ( ! file.jshint.success ) {
			var errors = [];
			var warnings = [];
			var codes = { W: 0, E: 0 };
			var codesFun = { W: function(result) {
				if ( warnings.length < config.warning_length ) {
				  	// console.log(result.error.line);
				  	warnings.push(result.file + ': line '+ result.error.line + 
			  							' col ' + result.error.character + 
			  							', ' + result.error.raw) ;
			  	}
			}, E: function(result){
				if ( errors.length < config.error_length ) {
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

module.exports = notificador;