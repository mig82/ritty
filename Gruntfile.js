module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': ['views/*.html', 'directives/*.html', 'directives/menu/*.html', 'app/js/models/*.js']
        }
      }
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'ritty'
        },
        files: {
          'app/js/translations.js': ['po/*.po']
        }
      },
    }

	});

  grunt.loadNpmTasks('grunt-angular-gettext');

	// Load the plugin that provides the "uglify" task.
	//grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	//grunt.registerTask('default', ['uglify']);

};