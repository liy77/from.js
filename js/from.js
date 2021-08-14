"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.version =
  exports.update =
  exports.has =
  exports.include =
  exports.remove =
  exports.install =
    void 0;
var path = process.execPath;
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
var module_1 = __importDefault(require("module"));
var events_1 = require("events");
var fs_1 = __importDefault(require("fs"));
path = path_1.default.resolve(path, "../");
var fromEvents = new events_1.EventEmitter();
function from(module, callback) {
  var mod = include(module);
  if (callback) callback(mod);
  return mod;
}
/**
 * Install global module
 * @example
 * from.i("express", false, (mods) => {
 *   console.log(mods[0])
 * })
 */
function install(module, yarn, callback) {
  if (yarn === void 0) {
    yarn = false;
  }
  var pkg = yarn ? "yarn" : "npm";
  var install = pkg === "yarn" ? "add" : "install";
  var execText = "cd " + path + " && " + pkg + " " + install + " ";
  var modulesToInstall = [];
  if (Array.isArray(module)) {
    for (var _i = 0, module_2 = module; _i < module_2.length; _i++) {
      var mod = module_2[_i];
      execText += mod + " ";
      var version_1 = mod.includes("@") ? mod.split("@")[1] : "latest";
      var moduleName = version_1 !== "latest" ? mod.split("@")[0] : mod;
      modulesToInstall.push({
        text: moduleName + "@" + version_1,
        name: moduleName,
      });
    }
  } else {
    execText += module;
    var version_2 = module.includes("@") ? module.split("@")[1] : "latest";
    var moduleName = version_2 !== "latest" ? module.split("@")[0] : module;
    modulesToInstall.push({
      text: moduleName + "@" + version_2,
      name: moduleName,
    });
  }
  var modulesName = modulesToInstall.map(function (mod) {
    return mod.name;
  });
  from.emit("installing", modulesName);
  child_process_1.default.exec(execText, function (err, std, stderr) {
    if (err) throw err;
    if (stderr) from.emit("installError", stderr);
    console.log(
      "\n\nInstalled " +
        modulesName.join(", ") +
        " globaly.\n" +
        modulesName
          .map(function (mod) {
            return 'Use from("' + mod + '") to import module.';
          })
          .join("\n")
    );
    var modules = [];
    modulesName.forEach(function (mod) {
      modules.push(from(mod));
    });
    from.emit("install", std, modules);
    if (callback) callback(modules);
  });
}
exports.install = install;
/**
 * Remove global module
 * @example
 * from.r("express", false, (mods) => console.log(`Removed ${mods.join(", ")}`))
 */
function remove(module, yarn, callback) {
  if (yarn === void 0) {
    yarn = false;
  }
  var pkg = yarn ? "yarn" : "npm";
  var uninstall = pkg === "yarn" ? "remove" : "uninstall";
  var execText = "cd " + path + " && " + pkg + " " + uninstall + " ";
  if (Array.isArray(module)) {
    for (var _i = 0, module_3 = module; _i < module_3.length; _i++) {
      var mod = module_3[_i];
      execText += mod + " ";
    }
  } else execText += module;
  var modules = Array.isArray(module) ? module : [module];
  child_process_1.default.exec(execText, function (err, std, stderr) {
    if (err) throw err;
    if (stderr) from.emit("removeError", stderr);
    from.emit("remove", std, modules);
  });
  if (callback) callback(modules);
}
exports.remove = remove;
function include(module) {
  var mod = module_1.default.createRequire(
    path_1.default.resolve(path, "./node_modules")
  )(module);
  function checkModule(mod) {
    if ("default" in mod) mod = mod.default;
    if ("fromExport" in mod) mod = mod.fromExport;
  }
  checkModule(mod);
  return mod;
}
exports.include = include;
/**
 * @example
 * let express
 * if (from.has("express")) express = from("express")
 */
function has(module) {
  try {
    from.include(module);
    return true;
  } catch (_a) {
    return false;
  }
}
exports.has = has;
function auditFix() {}
function update(module, yarn, callback) {
  if (yarn === void 0) {
    yarn = false;
  }
  var pkg = yarn ? "yarn" : "npm";
  var execText = "cd " + path + " && " + pkg + " up ";
  if (Array.isArray(module)) {
    for (var _i = 0, module_4 = module; _i < module_4.length; _i++) {
      var mod = module_4[_i];
      execText += mod + " ";
    }
  } else execText += module;
  var modules = Array.isArray(module) ? module : [module];
  child_process_1.default.exec(execText, function (err, std, stderr) {
    if (err) throw err;
    if (stderr) from.emit("updateError", stderr);
    from.emit("update", std, modules);
  });
  if (callback) callback(modules);
}
exports.update = update;
/**
 * Get any module version
 */
function version(module) {
  var v = JSON.parse(
    fs_1.default.readFileSync(
      path_1.default.resolve(path, "./package.json"),
      "utf-8"
    )
  ).dependencies[module];
  if (v) return v;
}
exports.version = version;
function on(event, listener) {
  fromEvents.on(event, listener);
  return from;
}
from.on = on;
/**
 * Adds a **one-time** `listener` function for the event named `eventName`.
 * The next time `eventName` is triggered, this listener is removed and then invoked.
 */
from.once = function once(event, listener) {
  fromEvents.once(event, listener);
  return from;
};
from.emit = function emit(event) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  fromEvents.emit.apply(fromEvents, __spreadArray([event], args));
  return from;
};
from.install = install;
from.i = from.install;
from.remove = remove;
from.r = from.remove;
from.include = include;
from.get = from.include;
from.update = update;
from.up = from.update;
from.version = version;
from.v = from.version;
exports.default = from;
