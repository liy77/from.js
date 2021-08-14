"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.has = exports.include = exports.remove = exports.install = void 0;
var path = process.execPath;
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
var module_1 = __importDefault(require("module"));
path = path_1.default.resolve(path, '../');
/**
 * Install global module
 * @example
 * from.i("express", false, (mods) => {
 *   console.log(mods[0])
 * })
 */
function install(module, yarn, callback) {
    if (yarn === void 0) { yarn = false; }
    var pkg = yarn ? 'yarn' : 'npm';
    var install = pkg === 'yarn' ? 'add' : 'install';
    var execText = "cd " + path + " && " + pkg + " " + install + " ";
    var modulesToInstall = [];
    if (Array.isArray(module)) {
        for (var _i = 0, module_2 = module; _i < module_2.length; _i++) {
            var mod = module_2[_i];
            execText += mod + " ";
            var version = mod.includes('@') ? mod.split('@')[1] : 'latest';
            var moduleName = version !== 'latest' ? mod.split('@')[0] : mod;
            modulesToInstall.push({
                text: moduleName + "@" + version,
                name: moduleName,
            });
        }
    }
    else {
        execText += module;
        var version = module.includes('@') ? module.split('@')[1] : 'latest';
        var moduleName = version !== 'latest' ? module.split('@')[0] : module;
        modulesToInstall.push({
            text: moduleName + "@" + version,
            name: moduleName,
        });
    }
    var modulesName = modulesToInstall.map(function (mod) { return mod.name; });
    console.log("Installing " + modulesName.join(', ') + " with from...");
    child_process_1.default.exec(execText, function (err, std) {
        if (err)
            throw err;
        console.log(std, "\n\nInstalled " + modulesName.join(', ') + " globaly.\n" + modulesName
            .map(function (mod) { return "Use from(\"" + mod + "\") to import module."; })
            .join('\n'));
        var modules = [];
        modulesName.forEach(function (mod) {
            modules.push(from(mod));
        });
        if (callback)
            callback(modules);
    });
}
exports.install = install;
/**
 * Remove global module
 * @example
 * from.r("express", false, (mods) => console.log(`Removed ${mods.join(", ")}`))
 */
function remove(module, yarn, callback) {
    if (yarn === void 0) { yarn = false; }
    var pkg = yarn ? 'yarn' : 'npm';
    var uninstall = pkg === 'yarn' ? 'remove' : 'uninstall';
    var execText = "cd " + path + " && " + pkg + " " + uninstall + " ";
    if (Array.isArray(module)) {
        for (var _i = 0, module_3 = module; _i < module_3.length; _i++) {
            var mod = module_3[_i];
            execText += mod + " ";
        }
    }
    else
        execText += module;
    child_process_1.default.exec(execText, function (err, std) {
        if (err)
            throw err;
        console.info(std);
    });
    if (callback)
        callback(Array.isArray(module) ? module : [module]);
}
exports.remove = remove;
function from(module, callback) {
    var mod = include(module);
    if (callback)
        callback(mod);
    return mod;
}
function include(module) {
    var mod = module_1.default.createRequire(path_1.default.resolve(path, './node_modules'))(module);
    function checkModule(mod) {
        if ('default' in mod)
            mod = mod.default;
        if ('fromExport' in mod)
            mod = mod.fromExport;
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
    }
    catch (_a) {
        return false;
    }
}
exports.has = has;
from.install = install;
from.i = from.install;
from.remove = remove;
from.r = from.remove;
from.include = include;
from.get = from.include;
exports.default = from;
