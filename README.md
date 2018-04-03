# babel-plugin-yui-compressor-fix-reserved-keywords

Babel plugin to automatically rename/fixup variable names, accessors and property names, and statements that trigger YUI compressor bugs.

Note: it will not fixup stuff that is too new for YUI compressor to know about so you should add it late to your list of plugins. Also if Babel decides you need its helpers, it will add those imports and exports after any plugins are run, it seems there is no way of fixing up those via a plug-in. If your project uses babel helpers, you need a second babel step which only runs this plug-in on the generated output.

## Example

**In**

```js
var short = function char() {
	debugger;
	return {
		default: 'yes'
	}.default;
}();
```

**Out**

```js
var _short = function _char() {
	return {
		'default': 'yes'
	}['default'];
}();
```

## Installation

```sh
$ npm install babel-plugin-yui-compressor-fix-reserved-keywords
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["yui-compressor-fix-reserved-keywords"]
}
```

### Via CLI

```sh
$ babel --plugins yui-compressor-fix-reserved-keywords script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["yui-compressor-fix-reserved-keywords"]
});
```
