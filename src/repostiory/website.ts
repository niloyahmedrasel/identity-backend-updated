import { IWebsite } from "../model/interface/website";
import { Website } from "../model/website";
import { baseRepository } from "./baseRepostiory";


export class WebsiteRepository extends baseRepository<IWebsite>{
    constructor(){
        super(Website);
    }
}