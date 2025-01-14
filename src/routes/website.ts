import express from "express";
import { WebsiteController } from "../controller/website";
import upload from "../middleware/uploadMediaFile";

const router = express.Router();


router.get("/:websiteId", new WebsiteController().getById);
router.post("/create",upload.single("logo"), new WebsiteController().createWebsite);
router.get("/:businessId?", new WebsiteController().getAllWebsites);
router.get("/businessId/:businessId", new WebsiteController().getbyBusinessId);
router.put("/update/:websiteId",upload.single("logo"), new WebsiteController().updateWebsite);
router.delete("/delete/:websiteId", new WebsiteController().deleteWebsite);


export default router;