import express from "express";
import { TemplateController } from "../controller/template";

const router = express.Router();

router.post("/create", new TemplateController().createTemplate);
router.get("/all", new TemplateController().getAllTemplates);
router.get("/:templateId", new TemplateController().getTemplateById);
router.put("/update/:templateId", new TemplateController().updateTemplate);
router.delete("/delete/:templateId", new TemplateController().deleteTemplate);

export default router;