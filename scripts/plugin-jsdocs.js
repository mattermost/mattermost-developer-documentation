const espree = require('espree');
const fetch = require('sync-fetch');

// Parse the registry and extract the class methods, parameters and leading comments.
const registryContent = fetch('https://raw.githubusercontent.com/mattermost/mattermost-webapp/master/plugins/registry.js').text();
const registryParsed = espree.parse(registryContent, { comment: true, loc: true, sourceType: 'module', ecmaVersion: 10 });

const pluginRegistryClassMethods = registryParsed.body.find(statement =>
    statement.type === "ExportDefaultDeclaration" &&
    statement.declaration.id.name === "PluginRegistry"
).declaration.body.body.filter(statement =>
    statement.type === "MethodDefinition" &&
    statement.key.name !== "constructor"
)

// Group all adjacent comments in commentBlocks.
let commentBlocks = [];
let lastLine = -2;
let currentBlock = [];
registryParsed.comments.forEach(comment => {
    if (comment.loc.start.line === (lastLine + 1)) {
        currentBlock.push(comment);
    } else {
        currentBlock = [comment];
        commentBlocks.push(currentBlock);
    }

    lastLine = comment.loc.start.line;
});

// Given a comment block, compute the number of its last line.
const blockLastLine = (commentBlock) => {
    const mapped = commentBlock.map(c => c.loc.start.line);
    return Math.max(...mapped);
};

// Generate a dictionary mapping every line with a preceding comment block to
// that specific block.
const lineToPrecedingBlock = {};
commentBlocks.forEach(block => {
    const line = blockLastLine(block) + 1;
    lineToPrecedingBlock[line] = block.map(comment => comment.value);
});

// For every method in the plugin registry, build an object with its name,
// its parameters and its preceding comment block.
const methodsOutput = pluginRegistryClassMethods.map((statement) => {
    const commentBlock = lineToPrecedingBlock[statement.loc.start.line];
    return {
        Name: statement.key.name,
        Parameters: statement.value.params.map(param => param.name),
        Comments: commentBlock ? commentBlock : [],
    }
});

output = {
    Interface: {
        Methods: methodsOutput,
    },
};

process.stdout.write(JSON.stringify(output));
