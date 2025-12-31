import express from "express";
import * as industry from "../controllers/industry.js";
import { checkPermission, isLoggedIn } from "../middlewares/authMiddleware.js";

const panelRouter = express.Router();

panelRouter.use(isLoggedIn);

panelRouter.get("/v1/industries", checkPermission("read_industry"), industry.readIndustries);
panelRouter.get("/v1/industries/:id", checkPermission("read_industry"), industry.readIndustry);
panelRouter.post("/v1/industries", checkPermission("create_industry"), industry.createIndustry);
panelRouter.put("/v1/industries/:id", checkPermission("update_industry"), industry.updateIndustry);
panelRouter.patch("/v1/industries/:id", checkPermission("update_industry"), industry.restoreIndustry);
panelRouter.delete("/v1/industries/:id", checkPermission("delete_industry"), industry.deleteIndustry);

export default panelRouter;
