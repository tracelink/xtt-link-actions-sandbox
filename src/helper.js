import fs from "fs"

export class Helper {
    // Function to read and parse the configuration file
    static readConfig(file) {
        try {
            const configFile = fs.readFileSync(file, 'utf-8');//'config/config.json'
            const config = JSON.parse(configFile);
            return config;
        } catch (error) {
            console.error('Error reading config file:', error.message);
            return null;
        }
    }
}
