import express from "express";
import { MobileAppController } from "../controller/mobileApp";

const router = express.Router();

router.get("/:mobileAppId", new MobileAppController().getById);
router.post("/create", new MobileAppController().createMobileApp);
router.get("/all", new MobileAppController().getAllMobileApps);
router.get("/:businessId", new MobileAppController().getMobileAppsByBusinessId);
router.put("/update/:mobileAppId", new MobileAppController().updateMobileApp);
router.delete("/delete/:mobileAppId", new MobileAppController().deleteMobileApp);

export default router;