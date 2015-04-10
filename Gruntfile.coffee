# chrome_extension_reload task requires the following binary:
# https://github.com/prasmussen/chrome-cli

module.exports = (grunt) ->

  require("load-grunt-tasks") grunt

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    watch:
      pages:
        files: "source/pages/*.slim"
        tasks: [
          "slim:pages"
          # "chrome_extension_reload"
        ]
      optionsScript:
        files: [
          "source/scripts/options/*.js"
          "!source/scripts/options/concatinated.js"
        ]
        tasks: [
          "concat:optionsScript"
          "babel:optionsScript"
          "clean:optionsScript"
          # "chrome_extension_reload"
        ]
      backgroundScript:
        files: [
          "source/scripts/background/*.js"
          "!source/scripts/background/concatinated.js"
        ]
        tasks: [
          "concat:backgroundScript"
          "babel:backgroundScript"
          "clean:backgroundScript"
          # "chrome_extension_reload"
        ]
      optionsStyles:
        files: "source/styles/**/*.scss"
        tasks: [
          "compass:optionsStyles"
          # "csso:optionsStyles"
          # "chrome_extension_reload"
        ]
      icons:
        files: "source/icons/**/*.{png}"
        tasks: [
          "imagemin:icons"
          # "chrome_extension_reload"
        ]
      manifest:
        files: "source/manifest.json"
        tasks: [
          "copy:manifest"
          # "chrome_extension_reload"
        ]
      locales:
        files: "source/locales/**/*.json"
        tasks: [
          "copy:locales"
          # "chrome_extension_reload"
        ]

    chrome_extension_reload: []

    slim:
      pages:
        options:
          pretty: true
        files: [
          expand: true
          cwd: "source/pages/"
          src: "**/*.slim"
          dest: "build/"
          ext: ".html"
        ]

    concat:
      optionsScript:
        dest: "source/scripts/options/concatinated.js"
        src: [
          "source/scripts/options/jquery.js"
          "source/scripts/options/*.js"
        ]
      backgroundScript:
        dest: "source/scripts/background/concatinated.js"
        src: "source/scripts/background/*.js"

    babel:
      options:
        compact: false
      optionsScript:
        src: "source/scripts/options/concatinated.js"
        dest: "build/scripts/options.js"
      backgroundScript:
        src: "source/scripts/background/concatinated.js"
        dest: "build/scripts/background.js"

    clean:
      build: "build/"
      optionsScript: "source/scripts/options/concatinated.js"
      backgroundScript: "source/scripts/background/concatinated.js"

    compass:
      optionsStyles:
        options:
          noLineComments: true
          outputStyle: "expanded"
          sassDir: "source/styles/"
          cssDir: "build/styles/"

    csso:
      optionsStyles:
        options:
          report: "gzip"
        files:
          "build/styles/options.css": "build/styles/options.css"

    imagemin:
      icons:
        files: [
          expand: true
          cwd: "source/icons/"
          src: "**/*.png"
          dest: "build/icons/"
        ]

    copy:
      manifest:
        files:
          "build/manifest.json": "source/manifest.json"
      locales:
        files: [
          expand: true
          cwd: "source/locales/"
          src: "**/*.json"
          dest: "build/_locales/"
        ]

  grunt.registerTask "default", [
    "build"
    "watch"
  ]

  grunt.registerTask "build", [
    "clean:build"
    "slim:pages"
    "concat:optionsScript"
    "babel:optionsScript"
    "clean:optionsScript"
    "concat:backgroundScript"
    "babel:backgroundScript"
    "clean:backgroundScript"
    "compass:optionsStyles"
    "imagemin:icons"
    "copy:manifest"
    "copy:locales"
    # "chrome_extension_reload"
  ]
