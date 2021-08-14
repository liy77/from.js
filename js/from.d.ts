/**
 * Install global module
 * @example
 * from.i("express", false, (mods) => {
 *   console.log(mods[0])
 * })
 */
export declare function install(module: string | Array<string>, yarn?: boolean, callback?: (mods: any[]) => any): void;
/**
 * Remove global module
 * @example
 * from.r("express", false, (mods) => console.log(`Removed ${mods.join(", ")}`))
 */
export declare function remove(module: string | Array<string>, yarn: boolean | undefined, callback: (modNames?: Array<string>) => any): void;
declare function from(module: string, callback?: (mod?: any) => any): any;
declare namespace from {
    var install: typeof import("./from").install;
    var i: typeof import("./from").install;
    var remove: typeof import("./from").remove;
    var r: typeof import("./from").remove;
    var include: typeof import("./from").include;
    var get: typeof import("./from").include;
}
export declare function include(module: string): any;
/**
 * @example
 * let express
 * if (from.has("express")) express = from("express")
 */
export declare function has(module: string): boolean;
export default from;
