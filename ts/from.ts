let path = process.execPath;

import Path from "path";
import child from "child_process";
import Module from "module";
import { EventEmitter } from "events";
import Fs from "fs";

path = Path.resolve(path, "../");

const fromEvents = new EventEmitter();

declare interface from {
  on(event: string | symbol, listener: (...args: Array<any>) => any): from;
  on(
    event: "remove",
    listener: (std: string, modulesArray: Array<string>) => any
  ): from;
  on(event: "removeError", listener: (stderr: string) => any): from;
  on(event: "install", listener: (std: string, modules: Array<any>) => any): from;
  on(event: "installing", listener: (modulesName: Array<string>) => any): from;
  on(event: "installError", listener: (stderr: string) => any): from;
  on(
    event: "update",
    listener: (std: string, modules: Array<string>) => any
  ): from;
  on(event: "updateError", listener: (stderr: string) => any): from;
}
function from(module: string, callback?: (mod?: any) => any) {
  const mod = include(module);

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
export function install(
  module: string | Array<string>,
  yarn: boolean = false,
  callback?: (mods: any[]) => any
) {
  const pkg = yarn ? "yarn" : "npm";
  const install = pkg === "yarn" ? "add" : "install";

  let execText = `cd ${path} && ${pkg} ${install} `;

  let modulesToInstall: Array<{ text: string; name: string }> = [];
  if (Array.isArray(module)) {
    for (const mod of module) {
      execText += `${mod} `;

      const version = mod.includes("@") ? mod.split("@")[1] : "latest";
      const moduleName = version !== "latest" ? mod.split("@")[0] : mod;

      modulesToInstall.push({
        text: `${moduleName}@${version}`,
        name: moduleName,
      });
    }
  } else {
    execText += module;

    const version = module.includes("@") ? module.split("@")[1] : "latest";
    const moduleName = version !== "latest" ? module.split("@")[0] : module;
    modulesToInstall.push({
      text: `${moduleName}@${version}`,
      name: moduleName,
    });
  }

  const modulesName = modulesToInstall.map((mod) => mod.name);

  from.emit("installing", modulesName);

  child.exec(execText, (err, std, stderr) => {
    if (err) throw err;

    if (stderr) from.emit("installError", stderr);

    console.log(
      `\n\nInstalled ${modulesName.join(", ")} globaly.\n${modulesName
        .map((mod) => `Use from("${mod}") to import module.`)
        .join("\n")}`
    );

    const modules: any = [];
    modulesName.forEach((mod) => {
      modules.push(from(mod));
    });

    from.emit("install", std, modules);
    if (callback) callback(modules);
  });
}

/**
 * Remove global module
 * @example
 * from.r("express", false, (mods) => console.log(`Removed ${mods.join(", ")}`))
 */
export function remove(
  module: string | Array<string>,
  yarn: boolean = false,
  callback: (modNames?: Array<string>) => any
) {
  const pkg = yarn ? "yarn" : "npm";
  const uninstall = pkg === "yarn" ? "remove" : "uninstall";

  let execText = `cd ${path} && ${pkg} ${uninstall} `;

  if (Array.isArray(module)) {
    for (const mod of module) {
      execText += `${mod} `;
    }
  } else execText += module;

  const modules = Array.isArray(module) ? module : [module];
  child.exec(execText, (err, std, stderr) => {
    if (err) throw err;

    if (stderr) from.emit("removeError", stderr);
    from.emit("remove", std, modules);
  });

  if (callback) callback(modules);
}

export function include(module: string) {
  const mod = Module.createRequire(Path.resolve(path, "./node_modules"))(
    module
  );

  function checkModule(mod: any) {
    if ("default" in mod) mod = mod.default;
    if ("fromExport" in mod) mod = mod.fromExport;
  }

  checkModule(mod);
  return mod;
}

/**
 * @example
 * let express
 * if (from.has("express")) express = from("express")
 */
export function has(module: string) {
  try {
    from.include(module);
    return true;
  } catch {
    return false;
  }
}

export function auditFix() {}

export function update(
  module: string | Array<string>,
  yarn: boolean = false,
  callback: (modNames?: Array<string>) => any
) {
  const pkg = yarn ? "yarn" : "npm";

  let execText = `cd ${path} && ${pkg} up `;

  if (Array.isArray(module)) {
    for (const mod of module) {
      execText += `${mod} `;
    }
  } else execText += module;

  const modules = Array.isArray(module) ? module : [module];
  child.exec(execText, (err, std, stderr) => {
    if (err) throw err;

    if (stderr) from.emit("updateError", stderr);
    from.emit("update", std, modules);
  });

  if (callback) callback(modules);
}

/**
 * Get any module version
 */
export function version(module: string) {
  const v = JSON.parse(
    Fs.readFileSync(Path.resolve(path, "./package.json"), "utf-8")
  ).dependencies[module];

  if (v) return <string>v;
}

/**
 * Adds the `listener` function to the end of the listeners array for the event named `eventName`.
 * No checks are made to see if the `listener` has already been added.
 * Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added, and called, multiple times.
 */

function on(
  event: string | symbol,
  listener: (...args: Array<any>) => any
): from;
function on(
  event: "remove",
  listener: (std: string, modulesArray: Array<string>) => any
): from;
function on(event: "removeError", listener: (stderr: string) => any): from;
function on(event: "install", listener: (std: string, modules: Array<any>) => any): from;
function on(
  event: "installing",
  listener: (modulesName: Array<string>) => any
): from;
function on(event: "installError", listener: (stderr: string) => any): from;
function on(
  event: "update",
  listener: (std: string, modules: Array<string>) => any
): from;
function on(event: "updateError", listener: (stderr: string) => any): from;
function on(event: string | symbol, listener: (...args: Array<any>) => any) {
  fromEvents.on(event, listener);
  return from;
}

from.on = on;

/**
 * Adds a **one-time** `listener` function for the event named `eventName`.
 * The next time `eventName` is triggered, this listener is removed and then invoked.
 */
from.once = function once(
  event: string | symbol,
  listener: (...args: any[]) => any
) {
  fromEvents.once(event, listener);
  return from;
};

from.emit = function emit(event: string | symbol, ...args: any[]) {
  fromEvents.emit(event, ...args);
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

export default from;
