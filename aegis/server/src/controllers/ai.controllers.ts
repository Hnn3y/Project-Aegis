import { Request, Response } from "express";

import { analyzeMission } from "../services/gemini.service.js";

export async function missionAnalysis(
    req: Request,
    res: Response
) {

    try {

        const result =
            await analyzeMission(req.body);

        res.json(JSON.parse(result));

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Gemini Analysis Failed"

        });

    }

}