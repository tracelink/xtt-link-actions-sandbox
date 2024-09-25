import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

export class FileUtils {
    static async readDataFromFile(filePath) {
        try {
            const data = await fsPromises.readFile(filePath, 'utf-8');
            return data;
        } catch (error) {
            console.error('Error reading from file:', error);
        }
    }

    static async writeDataToFile(filePath, dataToWrite) {
        if (dataToWrite) {
            if (!(dataToWrite instanceof String)) {
                dataToWrite = JSON.stringify(dataToWrite);
            }
            const folderPath = path.dirname(filePath);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            fs.writeFile(filePath, dataToWrite, {
                encoding: "utf8",
                flag: "w"
            }, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    //console.log('File has been written successfully!');
                }
            });
        }
    }

    static async writeToOutput(inputFolder, fileName, dataToWrite) {
        const outputFolder = inputFolder.replace('Input', 'Output');
        this.writeDataToFile(`${outputFolder}/${fileName}`, dataToWrite)
    }
}



