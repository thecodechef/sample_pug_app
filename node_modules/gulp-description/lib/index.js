'use strict';

var gulp = require('gulp');
var colors = require('chalk');

module.exports = (function (opts) {
  opts = opts || {};

  var pad = '                                        ';
  var taskGetter = {
    init: function init(conf) {
      taskGetter.config = conf;
    },

    maxTaxkNameLength: function maxTaxkNameLength() {
      var ret = 0;
      taskGetter.mainTaskList().forEach(function (taskName) {
        ret = ret < taskName.length ? taskName.length : ret;
      });

      return ret;
    },

    rightPad: function rightPad(taskName, len) {
      return (taskName + pad).substring(0, len);
    },

    mainTaskList: function mainTaskList() {
      return Object.keys(gulp.tasks).sort();
    },

    descriptionList: function descriptionList() {
      return Object.keys(taskGetter.config.description).sort();
    },

    dependencyTaskList: function dependencyTaskList(taskName) {
      var subTasks = [];
      var depTasks = gulp.tasks[taskName].dep.sort();
      depTasks.forEach(function (depTask) {
        subTasks.push(depTask);
      });

      return subTasks;
    },

    filterMainTask: function filterMainTask(task) {
      return taskGetter.config.main.indexOf(task) >= 0;
    },

    descriptionMsg: function descriptionMsg(taskName) {
      var padnum = taskGetter.maxTaxkNameLength();
      var msg = taskGetter.config.description[taskName];
      var task = taskGetter.rightPad(taskName, padnum);
      if (msg) {
        console.log(colors.blue.bold.underline(task), msg);
      } else {
        console.log(colors.red.bold.underline(task), colors.red.bold('No description given! add description message'));
      }
    },

    unDescriptionMsg: function unDescriptionMsg(taskName) {
      var padnum = taskGetter.maxTaxkNameLength();
      var tsk = gulp.tasks[taskName];
      var task = taskGetter.rightPad(taskName, padnum);
      if (!tsk) {
        console.log(colors.red.bold.underline(task), colors.red.bold('No task given! remove description message'));
      }
    }
  };

  return {
    help: function help(conf) {
      taskGetter.init(conf);
      console.log(colors.blue.bold(' === Main Task === '));
      taskGetter.mainTaskList().filter(taskGetter.filterMainTask).forEach(function (taskName) {
        return taskGetter.descriptionMsg(taskName);
      });
    },

    all: function all(conf) {
      taskGetter.init(conf);
      console.log(colors.blue.bold(' === All Task === '));
      taskGetter.mainTaskList().forEach(function (taskName) {
        taskGetter.descriptionMsg(taskName);
      });

      taskGetter.descriptionList().forEach(function (taskName) {
        taskGetter.unDescriptionMsg(taskName);
      });
    },

    dependency: function dependency(conf) {
      taskGetter.init(conf);
      var padnum = taskGetter.maxTaxkNameLength();
      console.log(colors.blue.bold(' === ependently Task === '));
      taskGetter.mainTaskList().forEach(function (taskName) {
        console.log(colors.blue.bold(taskGetter.rightPad(taskName, padnum)), colors.gray(' => '), colors.gray('[' + taskGetter.dependencyTaskList(taskName).join(', ') + ']'));
      });
    }
  };
})();