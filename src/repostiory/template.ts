import { ITemplate } from "../model/interface/template";
import { baseRepository } from "./baseRepostiory";
import  {Template}  from "../model/template";


export class TemplateRepository extends baseRepository<ITemplate>{
    constructor(){
        super(Template);
    }
}