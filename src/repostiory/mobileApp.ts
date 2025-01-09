import { IMobileApp } from "../model/interface/mobileApp";
import { MobileApp } from "../model/mobileApp";
import { baseRepository } from "./baseRepostiory";

export class MobileRepository extends baseRepository<IMobileApp>{
    constructor(){
        super(MobileApp);
    }
}