import js_beautify from 'js-beautify';
import figlet from 'figlet';
import minimist from "minimist";
import { promises as fs } from 'fs';
import vm from 'vm';

export class CommonUtils {
    constructor() {

    }

    static stringify(object) {
        if (!(object instanceof String)) {
            return JSON.stringify(object);
        }
        return object;
    }

    static beautify(dataObj) {
        let dataJson;
        const options = { indent_size: 2, space_in_empty_paren: true };
        if (dataObj instanceof String) {

            dataJson = dataObj;
        }
        else {
            dataJson = JSON.stringify(dataObj);
        }

        return js_beautify(dataJson, options)
    }

    // Function to generate a banner with a message
    static generateBanner(message) {
        figlet.text(message, (err, data) => {
            if (err) {
                console.log('Error:', err);
                return;
            }
            console.log(data);
        });
    }

    /**
     * 
     * @runtime_param la = linkaction relative or absolute path,
     * @runtime_param file = in case of inbound it is maxFile and in case of outbound it is payload for ERP, 
     * @runtime_param config = config relative or absolute path path
     */
    static readArgs() {
        const argv = minimist(process.argv.slice(2));
        if (argv.help || argv.h || !(argv.la && argv.file && argv.config)) {
            console.log(`
    Usage: node index.js [options]
    
    Options:
      --la          Specify the Link Action file path (required)
      --file        Specify the maxFile for testing inbound linkaction or 
                    payload file path for outbound link action (required)
      --config      Specify the config file path (required)
      --help, -h    Display this help message
    `);
            process.exit(0);
        }
        return argv;
    }

    static async getFunctionFromFile(filePath, functionName) {
        try {
            // Resolve the file path relative to the current directory
            //const absoluteFilePath = path.resolve(__dirname, filePath);

            // Read the content of the JavaScript file
            const fileContent = await fs.readFile(filePath, 'utf8');

            // Create a script context
            const scriptContext = {};

            // Run the script in the context
            vm.createContext(scriptContext);
            vm.runInContext(fileContent, scriptContext);

            // Check if the function exists in the script context
            if (typeof scriptContext[functionName] === 'function') {
                return scriptContext[functionName];
            }
        } catch (error) {
            console.error('Error getting function from file:', error);
            return null;
        }
    }

}