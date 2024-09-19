import { promises as fsPromises } from 'fs';
import { FileUtils } from '../../utils/fileUtils.js';
import { expect } from "chai";

describe('writeDataToFile', () => {
  const filePath = 'testData/testOutput.txt';
  const dataToWrite = 'Test data to be written to the file.';
  //const fileUtils = new FileUtils();

  // Cleanup: Delete the file after the test
  after(async () => {
    await fsPromises.unlink(filePath).catch(() => {}); // Ignore errors if the file doesn't exist
  });

  it('should write data to a file', async () => {
    await FileUtils.writeDataToFile(filePath, dataToWrite);

    // Check if the file contains the expected data
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    expect(fileContent).to.equal(dataToWrite);
  });
});

describe('readDataFromFile', () => {
    const filePath = 'testData/testInput.txt';
    const testData = 'Test data to be read from the file.';
    //const fileUtils = new FileUtils();
  
    // Before each test, write test data to the file
    beforeEach(async () => {
      await fsPromises.writeFile(filePath, testData, 'utf-8');
    });
  
    // After each test, delete the file
    afterEach(async () => {
      await fsPromises.unlink(filePath).catch(() => {}); // Ignore errors if the file doesn't exist
    });
  
    it('should read data from a file', async () => {
      const readData = await FileUtils.readDataFromFile(filePath);
      console.log('readData : '+ readData);
      expect(readData).to.equal(testData);
    });
  });
