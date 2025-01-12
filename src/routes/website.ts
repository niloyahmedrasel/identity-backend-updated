import express from "express";
import { WebsiteController } from "../controller/website";

const router = express.Router();



router.post("/create", new WebsiteController().createWebsite);
router.get("/all", new WebsiteController().getAllWebsites);
router.get("/businessId/:businessId", new WebsiteController().getbyBusinessId);
router.get("/:websiteId", new WebsiteController().getById);
router.put("/update/:websiteId", new WebsiteController().updateWebsite);
router.delete("/delete/:websiteId", new WebsiteController().deleteWebsite);


export default router;