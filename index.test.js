const from = require("./")

console.log(from.version("express"))

from.on("installing", (modules) => console.log(`Installing ${modules}`));
from.i("eventemitter3", true)

from.on("install", (std, modules) => console.log(modules))
