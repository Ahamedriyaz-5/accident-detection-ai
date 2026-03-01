import { GoogleGenerativeAI } from "@google/generative-ai";

// For demo purposes, we have a fallback simulation mode
// In a real app, you would use import.meta.env.VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface EmergencyPlan {
    severity: "low" | "medium" | "high" | "critical";
    analysis: string;
    impactG: number;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    hospital: {
        name: string;
        address: string;
        distance: string;
    };
    trackingLinkSent: boolean;
    suggestedResponders: {
        type: "volunteer" | "ambulance" | "police" | "family";
        name: string;
        eta: string;
        distance: string;
        status: string;
    }[];
    medicalInstructions: string[];
}

export const getAdvancedEmergencyPlan = async (sensorData: any): Promise<EmergencyPlan> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const prompt = `
        Analyze this emergency sensor data and generate a structured rescue plan.
        Sensor Data: ${JSON.stringify(sensorData)}
        
        Return a JSON object with:
        {
          "severity": "low" | "medium" | "high" | "critical",
          "analysis": "short impact summary",
          "impactG": number,
          "location": { "lat": number, "lng": number, "address": "string" },
          "hospital": { "name": "string", "address": "string", "distance": "string" },
          "trackingLinkSent": true,
          "suggestedResponders": [
            { "type": "volunteer" | "ambulance" | "police" | "family", "name": "string", "eta": "string", "distance": "string", "status": "string" }
          ],
          "medicalInstructions": ["string"]
        }
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Gemini AI error, falling back to simulated plan:", error);
        }
    }

    // Fallback / Simulation Mode (Advanced Logic)
    const isHighImpact = sensorData?.gForce > 8.0;

    const crashScenarios = [
        // Kerala
        {
            loc: { lat: 10.0261, lng: 76.3125, address: "Edappally Toll JN, Kochi, Kerala" },
            hosp: { name: "Aster Medcity", address: "Kuttisahib Road, Cheranalloor", distance: "4.5km" },
            eta: "6 min", ambDistance: "2.8km"
        },
        {
            loc: { lat: 9.9682, lng: 76.2942, address: "Vyttila Mobility Hub, Kochi, Kerala" },
            hosp: { name: "Medical Trust Hospital", address: "Pallimukku, Kochi", distance: "3.2km" },
            eta: "4 min", ambDistance: "1.5km"
        },
        // Tamil Nadu
        {
            loc: { lat: 13.0827, lng: 80.2707, address: "Chennai Central, Tamil Nadu" },
            hosp: { name: "Rajiv Gandhi Government General Hospital", address: "Park Town, Chennai", distance: "1.1km" },
            eta: "3 min", ambDistance: "0.9km"
        },
        {
            loc: { lat: 11.0168, lng: 76.9558, address: "Gandhipuram, Coimbatore, Tamil Nadu" },
            hosp: { name: "Ganga Hospital", address: "Ram Nagar, Coimbatore", distance: "2.3km" },
            eta: "5 min", ambDistance: "1.8km"
        },
        // Delhi / NCR
        {
            loc: { lat: 28.6139, lng: 77.2090, address: "Connaught Place, New Delhi" },
            hosp: { name: "Sir Ganga Ram Hospital", address: "Rajinder Nagar, New Delhi", distance: "5.4km" },
            eta: "9 min", ambDistance: "4.1km"
        },
        {
            loc: { lat: 28.5355, lng: 77.3910, address: "Sector 18, Noida, UP" },
            hosp: { name: "Kailash Hospital", address: "Sector 27, Noida", distance: "2.1km" },
            eta: "4 min", ambDistance: "1.2km"
        },
        // Karnataka
        {
            loc: { lat: 12.9716, lng: 77.5946, address: "MG Road, Bengaluru, Karnataka" },
            hosp: { name: "Manipal Hospital", address: "Old Airport Road, Bengaluru", distance: "6.2km" },
            eta: "14 min", ambDistance: "5.5km"
        },
        // Maharashtra
        {
            loc: { lat: 19.0760, lng: 72.8777, address: "Bandra Kurla Complex, Mumbai, MH" },
            hosp: { name: "Lilavati Hospital", address: "Bandra West, Mumbai", distance: "3.8km" },
            eta: "8 min", ambDistance: "2.9km"
        }
    ];

    // Pick a random scenario so each login gives a new map/route
    const scenario = crashScenarios[Math.floor(Math.random() * crashScenarios.length)];

    return {
        severity: isHighImpact ? "critical" : "medium",
        analysis: isHighImpact
            ? "Severe kinetic impact detected. Rapid deceleration profile suggests high-speed collision. Immediate neural-link triage initiated."
            : "Moderate impact detected. Localized sensor anomalies consistent with a minor fall or collision.",
        impactG: sensorData?.gForce || 14.2,
        location: scenario.loc,
        hospital: scenario.hosp,
        trackingLinkSent: true,
        suggestedResponders: [
            {
                type: "volunteer",
                name: "Dr. Sarah Chen (Nearby)",
                eta: "1.5 min",
                distance: "210m",
                status: "En Route"
            },
            {
                type: "ambulance",
                name: "ER Unit #742",
                eta: scenario.eta,
                distance: scenario.ambDistance,
                status: "Dispatched"
            },
            {
                type: "family",
                name: "Mark (Emergency Contact)",
                eta: "N/A",
                distance: "15km",
                status: "Alerted"
            }
        ],
        medicalInstructions: [
            "Keep the victim stationary",
            "Check for clear airway",
            "Monitor pulse via smartwatch sync",
            "Prepare AED if heart rate drops below 40bpm"
        ]
    };
};
