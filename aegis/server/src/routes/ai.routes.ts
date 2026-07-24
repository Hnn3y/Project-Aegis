import { Router } from "express";

import { missionAnalysis } from "../controllers/ai.controller.js";

const router = Router();

router.post(

    "/mission-analysis",

    missionAnalysis

);

export default router;