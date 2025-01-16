import express from "express";
import { MobileAppController } from "../controller/mobileApp";
import upload from "../middleware/uploadMediaFile";

const router = express.Router();


router.post("/create", upload.single("logo"), new MobileAppController().createMobileApp);
router.get("/:mobileAppId", new MobileAppController().getById);
router.get("/:businessId?", new MobileAppController().getAllMobileApps);
router.get("/businessId/:businessId", new MobileAppController().getMobileAppsByBusinessId);
router.put("/update/:mobileAppId", upload.single("logo"), new MobileAppController().updateMobileApp);
router.delete("/delete/:mobileAppId", new MobileAppController().deleteMobileApp);


export default router;