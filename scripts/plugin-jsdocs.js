const path = require('path');
const fsp = require('fs-promise');
const esprima = require('esprima');

// Parse the registry and extract the class methods, parameters and leading comments.
const registryContent = fsp.readFileSync(path.join(__dirname, 'mattermost-webapp/plugins/registry.js'), 'utf-8')
const registryParsed = esprima.parseModule(registryContent, { comment: true, attachComment: true });

const pluginRegistryClassMethods = registryParsed.body.find(statement =>
    statement.type === "ExportDefaultDeclaration" &&
    statement.declaration.id.name === "PluginRegistry"
).declaration.body.body.filter(statement =>
    statement.type === "MethodDefinition" &&
    statement.key.name !== "constructor"
).map(statement => ({
    Name: statement.key.name,
    Parameters: statement.value.params.map(param => param.name),
    Comments: statement.leadingComments ? statement.leadingComments.map(comment => comment.value.trim()) : [],
}));

output = {
    Interface: {
        Methods: pluginRegistryClassMethods,
    },
};

process.stdout.write(JSON.stringify(output));
