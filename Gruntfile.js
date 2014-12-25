// Generated on 2014-12-17 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// to only match one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        webApp: 'webapp',
        app: '..',
        dist: 'webapp/dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '*.js',
                '*.json',
                '<%= config.webApp %>/**/*.js',
                '<%= config.webApp %>/**/*.json'
            ]
        },

        watch: {
            js: {
                files: ['<%= jshint.all %>'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            sass: {
            	files: ['<%= config.webApp %>/styles/**/*.scss', '<%= config.webApp %>/components/**/*.scss'],
                tasks: ['sass:dev']
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.webApp)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.webApp)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            dev: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            }
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/']
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                style: 'compressed',
                loadPath: 'bower_components/bootstrap-sass-official/assets/stylesheets/',
                trace: true
            },
            dist: {
                files: [{
                    '<%= config.webApp %>/dist/css/main.css': '<%= config.webApp %>/styles/dist.scss',
                },
                {
                	expand: true,
                	src: ["<%= config.webApp %>/components/**/*.scss"],
                	dest: "./",
                	ext: ".css"
                }]
            },
            dev: {
                options: {

                },
                files: [{
                    '<%= config.webApp %>/dev/css/main.css': '<%= config.webApp %>/styles/main.scss',
                    '<%= config.webApp %>/dev/css/bootstrap.css': '<%= config.webApp %>/styles/bootstrap-custom.scss'
                },
                {
                	expand: true,
                	src: ["<%= config.webApp %>/components/**/*.scss"],
                	dest: "./",
                	ext: ".css"
                }]
            }
        },

        nodemon: {
            dev: {
                script: './bin/www',
                options: {
                    args: ['NODE_ENV=development']
                }
            }
        },

        shell: {
            run: {
                command: 'set NODE_ENV=production && node ./bin/www'
            },
            rundev: {
                command: 'set NODE_ENV=development && nodemon ./bin/www'
            },
            rundebug: {
                command: 'set NODE_ENV=development && node --debug ./bin/www'
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('serve', 'start the server and preview your webApp, --allow-remote for remote access', function(target) {
        if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'jshint',
            'clean:dist',
            'sass:dist',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {

        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'jshint',
        'clean:dist',
        'sass:dist'
    ]);
    grunt.registerTask('build:dev', [
        'jshint',
        'clean:dev',
        'sass:dev'
    ]);

    grunt.registerTask('default', [
        'build:dev'
    ]);

    grunt.registerTask('nodemon', [
        'nodemon:dev'
    ]);
    grunt.registerTask('run', ['build','shell:run']);
    grunt.registerTask('run-dev', ['build:dev','shell:rundev']);
    grunt.registerTask('run-debug', ['build:dev','shell:rundebug']);
};
