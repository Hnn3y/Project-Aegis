import ai from "../config/gemini.js";

export async function analyzeMission(telemetry: any) {

    const prompt = `

You are AEGIS Mission Commander.

You are an Aerospace Systems Engineer.

Analyze the spacecraft telemetry.

Telemetry

${JSON.stringify(telemetry, null, 2)}

Return JSON only.

Format:

{
 "missionStatus":"",
 "risk":"",
 "summary":"",
 "rootCauses":[],
 "predictedFailure":"",
 "recommendations":[],
 "confidence":95
}

`;

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: prompt

    });

    return response.text;
}