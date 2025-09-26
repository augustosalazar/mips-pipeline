//Validate the MIPS instruction and returns error message if any
'use server';
/**
 * @fileOverview Validates MIPS instructions using an LLM.
 *
 * - validateMipsInstruction - A function that validates a MIPS instruction.
 * - ValidateMipsInstructionInput - The input type for the validateMipsInstruction function.
 * - ValidateMipsInstructionOutput - The return type for the validateMipsInstruction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateMipsInstructionInputSchema = z.object({
  instruction: z.string().describe('The MIPS instruction to validate.'),
});
export type ValidateMipsInstructionInput = z.infer<typeof ValidateMipsInstructionInputSchema>;

const ValidateMipsInstructionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the MIPS instruction is valid.'),
  errorMessage: z.string().describe('The error message if the instruction is invalid, otherwise an empty string.'),
});
export type ValidateMipsInstructionOutput = z.infer<typeof ValidateMipsInstructionOutputSchema>;

export async function validateMipsInstruction(input: ValidateMipsInstructionInput): Promise<ValidateMipsInstructionOutput> {
  return validateMipsInstructionFlow(input);
}

const validateMipsInstructionPrompt = ai.definePrompt({
  name: 'validateMipsInstructionPrompt',
  input: {schema: ValidateMipsInstructionInputSchema},
  output: {schema: ValidateMipsInstructionOutputSchema},
  prompt: `You are a MIPS assembly language expert. Your task is to validate the given MIPS instruction.

  Instruction: {{{instruction}}}

  Determine if the instruction is valid MIPS assembly. If it is not, provide a clear and concise error message explaining why.
  If the instruction is valid, set isValid to true and errorMessage to an empty string.

  Return the result in JSON format.
  `,
});

const validateMipsInstructionFlow = ai.defineFlow(
  {
    name: 'validateMipsInstructionFlow',
    inputSchema: ValidateMipsInstructionInputSchema,
    outputSchema: ValidateMipsInstructionOutputSchema,
  },
  async input => {
    const {output} = await validateMipsInstructionPrompt(input);
    return output!;
  }
);
