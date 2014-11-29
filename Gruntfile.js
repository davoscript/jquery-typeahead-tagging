module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            min: {
                options: {
                    paths:  ["css/"],
                    compress: true
                },
                files: {
                    "css/typeahead.tagging.min.css": "css/typeahead.tagging.less"
                }
            },
            max: {
                options: {
                    paths:  ["css/"]
                },
                files: {
                    "css/typeahead.tagging.css": "css/typeahead.tagging.less"
                }
            }
        },
        jshint: {
            files  : ['js/typeahead.tagging.js', 'test/tagging-test.js'],
            options: {
                globals: {
                    jQuery  : true,
                    console : true,
                    document: true
                }
            }
        },
        uglify: {
            compress: {
                options: {
                    mangle: false
                },
                files: {
                    "js/typeahead.tagging.min.js": ["js/typeahead.tagging.js"]
                }
            }
        },
        watch: {
            uglify: {
                files: ['js/typeahead.tagging.js'],
                tasks: ['jshint', 'uglify']
            },
            jshint: {
                files: ['js/typeahead.tagging.js', 'test/tagging-test.js'],
                tasks: ['jshint']
            },
            css: {
                files: ['css/*.less'],
                tasks: ['less']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
