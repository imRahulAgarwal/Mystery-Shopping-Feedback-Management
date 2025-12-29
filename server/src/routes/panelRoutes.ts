import express from "express";
import * as industry from "../controllers/industry.js";

const panelRouter = express.Router();

panelRouter.get("/v1/industries", industry.readIndustries);
panelRouter.get("/v1/industries/:id", industry.readIndustry);
panelRouter.post("/v1/industries", industry.createIndustry);
panelRouter.put("/v1/industries/:id", industry.updateIndustry);
panelRouter.patch("/v1/industries/:id", industry.restoreIndustry);
panelRouter.delete("/v1/industries/:id", industry.deleteIndustry);

export default panelRouter;
