'use strict';

const RESERVED_NAMES = ['abstract', 'else', 'instanceof', 'super', 'boolean', 'enum', 'int', 'switch', 'break', 'export', 'interface', 'synchronized', 'byte', 'extends', 'let', 'this', 'case', 'false', 'long', 'throw', 'catch', 'final', 'native', 'throws', 'char', 'finally', 'new', 'transient', 'class', 'float', 'null', 'true', 'const', 'for', 'package', 'try', 'continue', 'function', 'private', 'typeof', 'debugger', 'goto', 'protected', 'var', 'default', 'if', 'public', 'void', 'delete', 'implements', 'return', 'volatile', 'do', 'import', 'short', 'while', 'double', 'in', 'static', 'with'];

function needsTransform(identifierName) {
	return RESERVED_NAMES.indexOf(identifierName) > -1;
}

export default function ({types: t}) {
	return {
		visitor: {
			// visitor contents
			MemberExpression(path) {
				let node = path.node;
				if(node.computed || !t.isIdentifier(node.property) || !needsTransform(node.property.name)) {
					return;
				}
				node.property = t.stringLiteral(node.property.name);
				node.computed = true;
			},
			ObjectProperty(path) {
				let node = path.node;
				if(!t.isIdentifier(node.key) || !needsTransform(node.key.name)) {
					return;
				}
				node.key = t.stringLiteral(node.key.name);
			},
			FunctionDeclaration(path) {
				if(needsTransform(path.node.id.name)) {
					path.scope.parent.rename(path.node.id.name);
				}
			},
			FunctionExpression(path) {
				if(path.node.id && needsTransform(path.node.id.name)) {
					path.scope.rename(path.node.id.name);
				}
			},
			Function(path) {
				path.node.params.map(lval => lval.name).filter(needsTransform).forEach(name => path.scope.rename(name))
			},
			VariableDeclarator(path) {
				if(needsTransform(path.node.id.name)) {
					path.scope.rename(path.node.id.name);
				}
			},
			DebuggerStatement(path) {
				path.remove();
			}
		}
	};
};
