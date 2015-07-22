'use strict';

module.exports = function (grunt) {

  // :: lazy load grunt components
  require ('jit-grunt')(grunt, {
    eslint : 'gruntify-eslint'
  });

  grunt.initConfig({

    pkg : grunt.file.readJSON('./package.json'),

    eslint : {
      options : {
        config : '.eslintrc'
      },
      build : {
        options : {},
        src : [
          'scripts/**/*.{js,es6}'
        ]
      }
    },

    clean : {
      dist : {
        files : [{
          dot : true,
          src : [
            '.tmp',
            'dist',
          ]
        }]
      }
    },

    copy : {
      build : {
        files : [
          {
            expand : true,
            cwd : 'dist',
            dest : '../gh-pages',
            src : '**/*.*'
          }
        ]
      },
      develop : {
        files : [
          {
            src : 'index.html',
            dest : 'dist/index.html'
          }
        ]
      }
    },

    browserify : {
      options : {
        banner : '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.author %> | license : <%= pkg.license %> */'
      },
      build : {
        options : {
          transform : ['babelify'],
          extensions : ['.js', '.es6']
        },
        src : 'scripts/app.js',
        dest : 'dist/scripts/app.js'
      }
    },

    uglify : {
      build : {
        options : {
          preserveComments : 'some'
        },
        files : {
          'dist/scripts/app.min.js' : 'dist/scripts/app.js'
        }
      }
    },

    less : {
      options : {
        paths : [
          'styles'
        ]
      },
      build : {
        files : {
          '.tmp/app.css' : 'styles/app.less'
        }
      }
    },

    autoprefixer : {
      options : {
        browsers : ['last 1 version']
      },
      build : {
        files : [{
          expand : true,
          cwd : '.tmp/',
          src : '{,*/}*.css',
          dest : 'dist/styles'
        }]
      }
    },

    watch : {
      scripts : {
        files : [
          'scripts/**/*.{js,es6}'
        ],
        tasks : ['eslint', 'browserify', 'uglify']
      },
      styles : {
        files : [
          'styles/**/*.less'
        ],
        tasks : ['less, autoprefixer']
      },
      views : {
        files : [
          '**/*.html'
        ],
        tasks : ['copy:develop']
      },
      livereload : {
        files : [
          'index.html',
          '{scripts,styles}/**/*.*'
        ],
        options : {
          livereload : true
        }
      }
    }

  });

  grunt.registerTask('build', [
    'clean',
    'eslint',
    'browserify',
    'uglify',
    'less',
    'autoprefixer',
    'copy:develop'
    ]);

  grunt.registerTask('update-pages', ['build', 'copy:build']);

};