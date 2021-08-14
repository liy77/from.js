let path = process.execPath;

import Path from 'path';
import child from 'child_process';
import Module from 'module';

path = Path.resolve(path, '../');

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
  callback?: (mods: any[]) => any,
) {
  const pkg = yarn ? 'yarn' : 'npm';
  const install = pkg === 'yarn' ? 'add' : 'install';

  let execText = `cd ${path} && ${pkg} ${install} `;

  let modulesToInstall: Array<{ text: string; name: string }> = [];
  if (Array.isArray(module)) {
    for (const mod of module) {
      execText += `${mod} `;

      const version = mod.includes('@') ? mod.split('@')[1] : 'latest';
      const moduleName = version !== 'latest' ? mod.split('@')[0] : mod;

      modulesToInstall.push({
        text: `${moduleName}@${version}`,
        name: moduleName,
      });
    }
  } else {
    execText += module;

    const version = module.includes('@') ? module.split('@')[1] : 'latest';
    const moduleName = version !== 'latest' ? module.split('@')[0] : module;
    modulesToInstall.push({
      text: `${moduleName}@${version}`,
      name: moduleName,
    });
  }

  const modulesName = modulesToInstall.map((mod) => mod.name);

  console.log(`Installing ${modulesName.join(', ')} with from...`);
  child.exec(execText, (err, std) => {
    if (err) throw err;

    console.log(
      std,
      `\n\nInstalled ${modulesName.join(', ')} globaly.\n${modulesName
        .map((mod) => `Use from("${mod}") to import module.`)
        .join('\n')}`,
    );

    const modules: any = [];
    modulesName.forEach((mod) => {
      modules.push(from(mod));
    });

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
  callback: (modNames?: Array<string>) => any,
) {
  const pkg = yarn ? 'yarn' : 'npm';
  const uninstall = pkg === 'yarn' ? 'remove' : 'uninstall';

  let execText = `cd ${path} && ${pkg} ${uninstall} `;

  if (Array.isArray(module)) {
    for (const mod of module) {
      execText += `${mod} `;
    }
  } else execText += module;

  child.exec(execText, (err, std) => {
    if (err) throw err;

    console.info(std);
  });

  if (callback) callback(Array.isArray(module) ? module : [module]);
}

function from(module: string, callback?: (mod?: any) => any) {
  const mod = include(module);

  if (callback) callback(mod);
  return mod;
}

export function include(module: string) {
  const mod = Module.createRequire(Path.resolve(path, './node_modules'))(
    module,
  );

  function checkModule(mod: any) {
    if ('default' in mod) mod = mod.default;
    if ('fromExport' in mod) mod = mod.fromExport;
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

from.install = install;
from.i = from.install;
from.remove = remove;
from.r = from.remove;
from.include = include;
from.get = from.include;

export default from;
