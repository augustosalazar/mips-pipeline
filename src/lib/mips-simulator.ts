export type SimulationMode = "no_hazards" | "stalls" | "forwarding";

export interface Instruction {
  id: number;
  hex: string;
  assembly: string;
}

export interface PipelineStage {
  stage: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';
  instruction: Instruction | null;
}

export interface SimulationState {
  clockCycle: number;
  pipeline: PipelineStage[];
  history: Record<'IF' | 'ID' | 'EX' | 'MEM' | 'WB', (Instruction | null)[]>;
}

const STAGE_NAMES: ('IF' | 'ID' | 'EX' | 'MEM' | 'WB')[] = ['IF', 'ID', 'EX', 'MEM', 'WB'];

// A very simplified instruction decoder for visualization purposes
function decodeHex(hex: string): string {
    if (hex === '0x00000000') return 'nop';

    const inst = parseInt(hex, 16);
    const opcode = (inst >> 26) & 0x3F;
    const funct = inst & 0x3F;

    // R-type instructions
    if (opcode === 0x00) {
        switch (funct) {
            case 0x20: return 'add';
            case 0x21: return 'addu';
            case 0x24: return 'and';
            case 0x08: return 'jr';
            case 0x27: return 'nor';
            case 0x25: return 'or';
            case 0x2a: return 'slt';
            case 0x2b: return 'sltu';
            case 0x00: return 'sll';
            case 0x02: return 'srl';
            case 0x22: return 'sub';
            case 0x23: return 'subu';
            default: return 'R-type';
        }
    }

    // J-type instructions
    if (opcode === 0x02 || opcode === 0x03) {
        return opcode === 0x02 ? 'j' : 'jal';
    }

    // I-type instructions
    switch (opcode) {
        case 0x08: return 'addi';
        case 0x09: return 'addiu';
        case 0x0c: return 'andi';
        case 0x04: return 'beq';
        case 0x05: return 'bne';
        case 0x24: return 'lbu';
        case 0x25: return 'lhu';
        case 0x23: return 'lw';
        case 0x0f: return 'lui';
        case 0x0d: return 'ori';
        case 0x0a: return 'slti';
        case 0x2b: return 'sw';
        case 0x28: return 'sb';
        case 0x29: return 'sh';
        default: return 'Unknown';
    }
}


export function parseInstructions(hexCode: string): Instruction[] {
  return hexCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('0x') && line.length === 10)
    .map((hex, index) => ({
      id: index,
      hex,
      assembly: decodeHex(hex),
    }));
}

export function initializeSimulation(instructions: Instruction[]): SimulationState {
  return {
    clockCycle: 0,
    pipeline: STAGE_NAMES.map(stage => ({
      stage,
      instruction: null,
    })),
    history: {
      IF: [],
      ID: [],
      EX: [],
      MEM: [],
      WB: [],
    }
  };
}

export function step(currentState: SimulationState, instructions: Instruction[]): SimulationState {
  const newPipeline: PipelineStage[] = JSON.parse(JSON.stringify(currentState.pipeline));
  const newHistory = JSON.parse(JSON.stringify(currentState.history));
  const nextClockCycle = currentState.clockCycle + 1;

  // Log current state to history before advancing
  newHistory.IF.push(newPipeline[0].instruction);
  newHistory.ID.push(newPipeline[1].instruction);
  newHistory.EX.push(newPipeline[2].instruction);
  newHistory.MEM.push(newPipeline[3].instruction);
  newHistory.WB.push(newPipeline[4].instruction);


  // WB stage gets instruction from MEM stage
  newPipeline[4].instruction = newPipeline[3].instruction;

  // MEM stage gets instruction from EX stage
  newPipeline[3].instruction = newPipeline[2].instruction;
  
  // EX stage gets instruction from ID stage
  newPipeline[2].instruction = newPipeline[1].instruction;

  // ID stage gets instruction from IF stage
  newPipeline[1].instruction = newPipeline[0].instruction;
  
  // IF stage fetches new instruction
  const instructionIndex = currentState.clockCycle;
  if (instructionIndex < instructions.length) {
    newPipeline[0].instruction = { ...instructions[instructionIndex] };
  } else {
    newPipeline[0].instruction = null;
  }

  return {
    ...currentState,
    clockCycle: nextClockCycle,
    pipeline: newPipeline,
    history: newHistory,
  };
}
