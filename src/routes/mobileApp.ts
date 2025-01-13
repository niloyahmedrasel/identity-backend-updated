import express from "express";
import { MobileAppController } from "../controller/mobileApp";

const router = express.Router();


router.post("/create", new MobileAppController().createMobileApp);
router.get("/:businessId?", new MobileAppController().getAllMobileApps);
router.get("/businessId/:businessId", new MobileAppController().getMobileAppsByBusinessId);
router.put("/update/:mobileAppId", new MobileAppController().updateMobileApp);
router.delete("/delete/:mobileAppId", new MobileAppController().deleteMobileApp);
router.get("/:mobileAppId", new MobileAppController().getById);

export default router;