const fs = require('fs');
const fsp = require('fs-promise');
const metadata = require('react-component-metadata');
const globp = promisify(require('glob'));

generate('site/data/PluginJSDocs.md').then(result => console.log(result));

function generate(dst) {
    // Load 'new' component metadata for components added to the UI that are
    // not overriding existing components
    let parsedComponents;
    try {
        parsedComponents = JSON.parse(fs.readFileSync(__dirname + '/mattermost-webapp/plugins/docs.json', {encoding: 'utf-8'}));
    } catch (err) {
        console.error(err);
    }

    // Look through the web app for pluggable components
    return globp(__dirname + '/mattermost-webapp/components/**/*.jsx').then((files) => {

        const results = files.map(filename => fsp.readFile(filename, 'utf-8').then(content => metadata(content)));

        return Promise.all(results).then((data) => {
            data.forEach(components => {
                Object.keys(components).forEach(key => {
                    const component = components[key];
                    // Pluggable components must have a getComponentName method
                    if (component.methods && component.methods.getComponentName) {
                        parsedComponents[key] = component;
                    }
                });
            });

            let result = '';
            Object.keys(parsedComponents).forEach((key) => {
                const component = parsedComponents[key];
                result += metadataToMarkdown(key, component);
            });

            return JSON.stringify({Reference: result});
        }).catch(err => console.error(err));
    });
}

function metadataToMarkdown(name, component) {
    const desc = component.desc ? component.desc.replace(/(?:\r\n|\r|\n)/g, ' ') : '';
    let result = `### ${name}\n${desc}\n\n`;

    result += '#### Props\n';
    result += '| Prop | Type | Required | Default | Description |\n';
    result += '| :---- | :---- | :--------: | :------- | :----------- |\n';
    if (component.props && Object.keys(component.props).length > 0) {

        Object.keys(component.props).forEach((key) => {
            const prop = component.props[key];
            const desc = prop.desc ? prop.desc.replace(/(?:\r\n|\r|\n)/g, ' ') : '';
            const defaultValue = prop.defaultValue == null ? 'none' : prop.defaultValue;

            // Skip internal props
            if (desc.includes('@internal')) {
                return;
            }

            result += `| ${key} | ${prop.type.name} | ${prop.required ? 'Y' : 'N'} | ${defaultValue} | ${desc} |\n`;

        });

    }

    // Every pluggable component gets theme as a prop
    result += "| theme | object | Y | none | Theme object containing the colors and data used to set the user's color scheme |\n\n"

   return result;
}

function promisify(fn) {
    return function (...args) {
        return new Promise(function(resolve, reject) {
            function finish(err, result){
                if (err) {
                    return reject(err);
                }
                    resolve(result);
                }
                fn.apply(null, args.concat(finish));
            }
        );
    };
}
