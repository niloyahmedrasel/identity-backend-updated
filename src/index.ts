import express from "express";
import cors from "cors";
import { dbConnect } from "./config/db";
import websiteRouter  from "./routes/website"
import TemplateRouter  from "./routes/template"
import mobileAppRouter  from "./routes/mobileApp"
const app = express();
const port = 5000;


app.use(express.json());
app.use(cors());
dbConnect();

app.use("/api/website", websiteRouter);
app.use("/api/template", TemplateRouter);
app.use("/api/mobileApp", mobileAppRouter);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
