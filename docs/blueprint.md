# **App Name**: KarachiBus Navigator

## Core Features:

- GPS Location Detection: Auto-detect user's current location using GPS with permission and display on Google Maps.
- Voice Input: Enable voice recognition for 'From' and 'To' inputs in both English and Urdu.
- Route Finding: Use Google Maps API to find the best bus routes between 'From' and 'To' locations, integrating the bus route data from the database to augment the routes found by Google.
- Route Suggestion: If a direct route isn't found, the application will suggest a nearby connection. This tool allows the LLM to incorporate or omit information about possible routes depending on their relative travel time and practicality.
- Route Display: Display bus name, route number, start/destination stops, estimated travel time, and a collapsible list of stops on a semi-transparent card.
- Bus Route Data: JSON database for Karachi bus routes.
- Text-to-Speech: Provide text-to-speech output for route information and instructions in both English and Urdu.

## Style Guidelines:

- Primary color: Blue (#29ABE2) to evoke trust, dependability and transportation, contrasting with the background in both dark and light modes.
- Background color: Light gray (#F0F0F0) or Dark gray (#333333) for a clean, modern look, adapting for light and dark modes, respectively.
- Accent color: Teal (#008080) to highlight interactive elements like buttons and active states, providing a distinct visual cue for the user.
- Body and headline font: 'PT Sans' (sans-serif) combines a modern look and a little warmth.
- Use bus-themed icons for routes and stops, ensuring they are clear, simple, and easily recognizable. Consider using animated icons for interactive elements.
- Employ a clean, minimal, and mobile-responsive layout with rounded cards and smooth transitions to enhance the user experience. Ensure a professional appearance across all devices.
- Implement subtle animations for the 'Get Started' button, map transitions, and route display to create a visually engaging experience.