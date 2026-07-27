import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY missing in environment variables');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Engineering Copilot API Endpoint
  app.post('/api/copilot', async (req, res) => {
    try {
      const { prompt, satellite, allSatellites, debris } = req.body;

      const ai = getGenAI();

      const systemInstruction = `You are AEGIS, an AI Mission Intelligence Platform for spacecraft operations and digital twin engineering.
You provide precise, evidence-based spaceflight engineering answers.
Always base your answers on spacecraft telemetry, orbital mechanics, subsystem physics, and orbital debris risks provided in the context.

Return your response strictly as a JSON object matching this schema:
{
  "text": "Detailed conversational response explaining the situation with space engineering precision.",
  "confidenceScore": 95, // Integer 0-100
  "supportingEvidence": ["Evidence item 1", "Evidence item 2"],
  "engineeringReasoning": "Concise physical and mathematical reasoning behind this assessment.",
  "recommendedActions": ["Action 1", "Action 2"]
}`;

      const contextSummary = `
SATELLITE CONTEXT:
${satellite ? JSON.stringify(satellite, null, 2) : 'No specific satellite selected.'}

FLEET SUMMARY:
${allSatellites ? JSON.stringify(allSatellites.map((s: any) => ({ name: s.name, status: s.status, health: s.telemetry.overallHealthScore, risk: s.telemetry.aiRiskScore })), null, 2) : 'N/A'}

ORBITAL DEBRIS CONJUNCTIONS:
${debris ? JSON.stringify(debris.map((d: any) => ({ name: d.name, target: d.conjunctionTargetName, distanceKm: d.conjunctionDistanceKm, tcaHours: d.tcaHours, prob: d.collisionProbabilityPercent })), null, 2) : 'N/A'}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `USER QUESTION: ${prompt}\n\nOPERATIONAL DATA CONTEXT:\n${contextSummary}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              supportingEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              engineeringReasoning: { type: Type.STRING },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['text', 'confidenceScore', 'supportingEvidence', 'engineeringReasoning', 'recommendedActions'],
          },
        },
      });

      const jsonText = response.text || '{}';
      const parsed = JSON.parse(jsonText);

      res.json({
        success: true,
        data: parsed,
      });
    } catch (error: any) {
      console.error('Error in /api/copilot:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate AI Copilot response',
        fallback: {
          text: 'AEGIS Copilot experienced a communication latency error processing live telemetry data. Please verify network downlink status and try again.',
          confidenceScore: 70,
          supportingEvidence: ['Telemetry stream connection interrupted'],
          engineeringReasoning: 'API gateway timeout during high-throughput analysis.',
          recommendedActions: ['Retry query or inspect local satellite telemetry diagnostics.'],
        },
      });
    }
  });

  // AI Mission Planning Evaluation API Endpoint
  app.post('/api/evaluate-mission', async (req, res) => {
    try {
      const missionData = req.body;
      const ai = getGenAI();

      const prompt = `Evaluate pre-launch spacecraft mission configuration:
Mission Name: ${missionData.missionName}
Satellite: ${missionData.satelliteName}
Operator: ${missionData.operator}
Orbit Type: ${missionData.orbitType}
Payload: ${missionData.payloadType} (${missionData.payloadMassKg} kg)
Duration: ${missionData.missionDurationMonths} months
Target Lifespan: ${missionData.expectedLifespanYears} years

Evaluate orbital risk, expected lifespan feasibility, orbital congestion in selected orbit, collision probability, fuel efficiency, overall feasibility score (0-100), key pre-approval recommendations, and primary risk contributors.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert Spacecraft Systems Engineer & Mission Analyst evaluating satellite mission proposals.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedRiskScore: { type: Type.INTEGER },
              expectedLifespanYears: { type: Type.NUMBER },
              orbitalCongestionLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Severe'] },
              collisionProbabilityPercent: { type: Type.NUMBER },
              fuelEfficiencyRating: { type: Type.STRING, enum: ['A', 'B', 'C', 'D'] },
              feasibilityScore: { type: Type.INTEGER },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              riskContributors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'estimatedRiskScore',
              'expectedLifespanYears',
              'orbitalCongestionLevel',
              'collisionProbabilityPercent',
              'fuelEfficiencyRating',
              'feasibilityScore',
              'recommendations',
              'riskContributors',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, evaluation: parsed });
    } catch (error: any) {
      console.error('Error in /api/evaluate-mission:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI Inspection Report Generator API Endpoint
  app.post('/api/generate-inspection-report', async (req, res) => {
    try {
      const { satellite } = req.body;
      const ai = getGenAI();

      const prompt = `Generate a comprehensive AI Satellite Inspection & Engineering Health Report for spacecraft:
Name: ${satellite.name} (NORAD ID: ${satellite.noradId})
Operator: ${satellite.operator}
Orbit: ${satellite.orbitType}
Current Health Score: ${satellite.telemetry.overallHealthScore}%
Battery Health: ${satellite.telemetry.batteryHealth}%
Solar Efficiency: ${satellite.telemetry.solarPanelEfficiency}%
Thruster Health: ${satellite.telemetry.thrusterHealth}%
Fuel Remaining: ${satellite.telemetry.fuelRemaining}%
Components: ${JSON.stringify(satellite.components)}
Active Predictions: ${JSON.stringify(satellite.predictions)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are the AEGIS Autonomous AI Inspection & Diagnostic Engine producing official spaceflight engineering reports.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              healthOverview: {
                type: Type.OBJECT,
                properties: {
                  powerScore: { type: Type.INTEGER },
                  thermalScore: { type: Type.INTEGER },
                  commsScore: { type: Type.INTEGER },
                  propulsionScore: { type: Type.INTEGER },
                  overallScore: { type: Type.INTEGER },
                },
                required: ['powerScore', 'thermalScore', 'commsScore', 'propulsionScore', 'overallScore'],
              },
              engineeringAssessment: { type: Type.STRING },
              predictedFailures: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              identifiedRisks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              maintenanceRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              aiConfidenceScore: { type: Type.INTEGER },
              historicalComparison: { type: Type.STRING },
              riskClassification: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Critical'] },
            },
            required: [
              'executiveSummary',
              'healthOverview',
              'engineeringAssessment',
              'predictedFailures',
              'identifiedRisks',
              'maintenanceRecommendations',
              'aiConfidenceScore',
              'historicalComparison',
              'riskClassification',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const now = new Date();
      const reportNumber = `AIR-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      res.json({
        success: true,
        report: {
          id: `rep-${Date.now()}`,
          reportNumber,
          satelliteId: satellite.id,
          satelliteName: satellite.name,
          generatedAt: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} UTC`,
          author: 'AEGIS AI Mission Intelligence Core v3.6',
          ...parsed,
        },
      });
    } catch (error: any) {
      console.error('Error in /api/generate-inspection-report:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AEGIS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AEGIS server:', err);
});