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
  origin: z.string().describe('The user\u2019s origin location.'),
  destination: z.string().describe('The user\u2019s destination location.'),
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

  If no reasonable connections can be made based on the available routes, return an empty array for nearbyConnections.

  Format your response as a JSON object that conforms to the following schema:
  ${JSON.stringify(SuggestNearbyRouteConnectionsOutputSchema.shape, null, 2)}`,
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
