declare interface from {
  on(event: string | symbol, listener: (...args: Array<any>) => any): from;
  on(
    event: "remove",
    listener: (std: string, modulesArray: Array<string>) => any
  ): from;
  on(event: "removeError", listener: (stderr: string) => any): from;
  on(
    event: "install",
    listener: (std: string, modules: Array<any>) => any
  ): from;
  on(event: "installing", listener: (modulesName: Array<string>) => any): from;
  on(event: "installError", listener: (stderr: string) => any): from;
  on(
    event: "update",
    listener: (std: string, modules: Array<string>) => any
  ): from;
  on(event: "updateError", listener: (stderr: string) => any): from;
}
declare function from(module: string, callback?: (mod?: any) => any): any;
declare namespace from {
  var on: {
    (event: string | symbol, listener: (...args: any[]) => any): from;
    (
      event: "remove",
      listener: (std: string, modulesArray: string[]) => any
    ): from;
    (event: "removeError", listener: (stderr: string) => any): from;
    (event: "install", listener: (std: string, modules: any[]) => any): from;
    (event: "installing", listener: (modulesName: string[]) => any): from;
    (event: "installError", listener: (stderr: string) => any): from;
    (event: "update", listener: (std: string, modules: string[]) => any): from;
    (event: "updateError", listener: (stderr: string) => any): from;
  };
  var once: (
    event: string | symbol,
    listener: (...args: any[]) => any
  ) => typeof from;
  var emit: (event: string | symbol, ...args: any[]) => typeof from;
  var install: typeof import("./from").install;
  var i: typeof import("./from").install;
  var remove: typeof import("./from").remove;
  var r: typeof import("./from").remove;
  var include: typeof import("./from").include;
  var get: typeof import("./from").include;
  var update: typeof import("./from").update;
  var up: typeof import("./from").update;
  var version: typeof import("./from").version;
  var v: typeof import("./from").version;
}
/**
 * Install global module
 * @example
 * from.i("express", false, (mods) => {
 *   console.log(mods[0])
 * })
 */
export declare function install(
  module: string | Array<string>,
  yarn?: boolean,
  callback?: (mods: any[]) => any
): void;
/**
 * Remove global module
 * @example
 * from.r("express", false, (mods) => console.log(`Removed ${mods.join(", ")}`))
 */
export declare function remove(
  module: string | Array<string>,
  yarn: boolean | undefined,
  callback: (modNames?: Array<string>) => any
): void;
export declare function include(module: string): any;
/**
 * @example
 * let express
 * if (from.has("express")) express = from("express")
 */
export declare function has(module: string): boolean;
export declare function update(
  module: string | Array<string>,
  yarn: boolean | undefined,
  callback: (modNames?: Array<string>) => any
): void;
/**
 * Get any module version
 */
export declare function version(module: string): string | undefined;
export default from;
