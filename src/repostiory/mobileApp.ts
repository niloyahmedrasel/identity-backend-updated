import { IMobileApp } from "../model/interface/mobileApp";
import { MobileApp } from "../model/mobileApp";
import { baseRepository } from "./baseRepsoitory";

export class MobileRepository extends baseRepository<IMobileApp> {
  constructor() {
    super(MobileApp);
  }
}
