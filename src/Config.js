import { Helper } from "./helper.js";
export class Config {

    constructor(configFile){
      return Helper.readConfig(configFile);
    }
  }
  