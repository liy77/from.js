# 🚀 From.js
An easy and fast importer of global modules

- [🚀 From.js](#-fromjs)
  - [📦 Installation](#-installation)
    - [🧐 How to use](#-how-to-use)
      - [✨ Importing](#-importing)
          - [Common Js](#common-js)
          - [Js Modules](#js-modules)
      - [📥 Install module](#-install-module)
      - [🗑 Removing module](#-removing-module)
      - [🎈 Importing module](#-importing-module)
      - [🤔 Checking if a module is installed](#-checking-if-a-module-is-installed)
  - [🎗 License](#-license)
## 📦 Installation

**YARN**
```bash
yarn add from.js
```

**NPM**
```bash
npm install from.js
```

### 🧐 How to use

#### ✨ Importing
###### Common Js
```js
const fromJs = require("from-module");
```

###### Js Modules
```js
import fromJs from "from-module";
```

#### 📥 Install module
```js
// False to install with npm
// True to install with yarn

fromJs.i("moduleName", false, (mods) => `Installed ${mods[0]}!`)
```

#### 🗑 Removing module
```js
fromJs.r("moduleName", (mods) => `Removed ${mods[0]}!`)
```

#### 🎈 Importing module
```js
fromJs("moduleName", (mod) => {
    // Your code here
})
```

#### 🤔 Checking if a module is installed
```js
if (fromJs.has("moduleName")) console.log("The module is installed")
else console.log("The module is not installed")
```


## 🎗 License
MIT License

Copyright (c) 2021 Brian Rhudy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
