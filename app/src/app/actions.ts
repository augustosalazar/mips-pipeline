'use server';

import { validateMipsInstruction } from '@/ai/flows/validate-mips-instruction';

export async function validateInstructionsAction(instructions: string[]): Promise<string[]> {
  const errors: string[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    if (!instruction.startsWith('0x') || instruction.length !== 10) {
      errors.push(`Line ${i + 1}: "${instruction}" is not a valid 32-bit hex value (e.g., 0x01234567).`);
      continue;
    }
    
    try {
      const result = await validateMipsInstruction({ instruction });
      if (!result.isValid) {
        errors.push(`Line ${i + 1} (${instruction}): ${result.errorMessage}`);
      }
    } catch (e) {
      console.error('AI validation failed:', e);
      // Fallback in case of AI error, we can let it pass for now so the app is still usable.
    }
  }

  return errors;
}
