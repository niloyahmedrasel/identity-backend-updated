import express from "express";
import cors from "cors";
import path from "path";
import { dbConnect } from "./config/db";
import websiteRouter from "./routes/website";
import TemplateRouter from "./routes/template";
import mobileAppRouter from "./routes/mobileApp";
import { KeycloakAdminClient } from "./setup/keycloak";
import { UserStore } from "./store/userStore";
import KeyCloak from "./middleware/keycloakAuth";

const app = express();
const port = 5000;

app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(express.json());
app.use(cors());
dbConnect();

export async function createApp() {
  await KeycloakAdminClient.init();
  await UserStore.initialize();
}

createApp();
app.use(KeyCloak.middleware);

app.use("/api/websites", websiteRouter);
app.use("/api/templates", TemplateRouter);
app.use("/api/mobileApps", mobileAppRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
