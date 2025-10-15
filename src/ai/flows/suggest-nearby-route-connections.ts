'use server';

/**
 * @fileOverview Suggests nearby bus route connections when a direct route is not found.
 *
 * - suggestNearbyRouteConnections - A function that suggests nearby bus route connections.
 * - SuggestNearbyRouteConnectionsInput - The input type for the suggestNearbyRouteConnections function.
 * - SuggestNearbyRouteConnectionsOutput - The return type for the suggestNearbyRouteConnections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNearbyRouteConnectionsInputSchema = z.object({
  origin: z.string().describe('The user’s origin location.'),
  destination: z.string().describe('The user’s destination location.'),
  availableRoutes: z.array(z.string()).describe('A list of available bus routes.'),
});
export type SuggestNearbyRouteConnectionsInput = z.infer<typeof SuggestNearbyRouteConnectionsInputSchema>;

const SuggestNearbyRouteConnectionsOutputSchema = z.object({
  nearbyConnections: z.array(
    z.object({
      route: z.string().describe('The suggested bus route connection.'),
      details: z.string().describe('Details about the connection, including stops and estimated travel time.'),
    })
  ).describe('A list of suggested nearby bus route connections.'),
});
export type SuggestNearbyRouteConnectionsOutput = z.infer<typeof SuggestNearbyRouteConnectionsOutputSchema>;

export async function suggestNearbyRouteConnections(
  input: SuggestNearbyRouteConnectionsInput
): Promise<SuggestNearbyRouteConnectionsOutput> {
  return suggestNearbyRouteConnectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNearbyRouteConnectionsPrompt',
  input: {
    schema: SuggestNearbyRouteConnectionsInputSchema,
  },
  output: {
    schema: SuggestNearbyRouteConnectionsOutputSchema,
  },
  prompt: `You are a helpful assistant that suggests nearby bus route connections in Karachi when a direct route is not found.

  Given the user's origin: {{{origin}}}, destination: {{{destination}}}, and available routes: {{{availableRoutes}}},
  suggest possible bus route connections to reach the destination from the origin.

  When providing details, break them down into clear, numbered steps. For example:
  "Step 1: Take W-11 to Saddar.
  Step 2: Transfer to D-3.
  Step 3: Disembark at Malir or Drigh Road for the airport.
  Estimated travel time from Saddar is 30-45 minutes."

  If the destination is "Karachi Airport", use the following information:
  The D-3 bus route travels through Malir, Drigh Road, and along Shahrah-e-Faisal, all of which are in close proximity to Karachi Airport.
  - If the user is near the W-11 route: Suggest taking W-11 to Saddar, then transferring to D-3.
  - If the user is near the G-7 route: Suggest taking G-7 to Liaquatabad or Nazimabad, then transferring to W-11 (towards Saddar), and then transferring to D-3.
  - If the user is near the UC-4 route: Suggest taking UC-4 to Nagan Chowrangi, then transferring to W-11 (towards Saddar), and then transferring to D-3.
  - Once on D-3, instruct the user to disembark at stops like Malir, Drigh Road, or any suitable stop on Shahrah-e-Faisal for a short onward journey to the airport.
  - The estimated travel time from Saddar to the airport vicinity on D-3 is 30-45 minutes.

  If no reasonable connections can be made based on the available routes, return an empty array for nearbyConnections.
  `,
});

const suggestNearbyRouteConnectionsFlow = ai.defineFlow(
  {
    name: 'suggestNearbyRouteConnectionsFlow',
    inputSchema: SuggestNearbyRouteConnectionsInputSchema,
    outputSchema: SuggestNearbyRouteConnectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
