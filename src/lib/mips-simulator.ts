
export type SimulationMode = "no_hazards" | "stalls" | "forwarding";

export interface Instruction {
  id: number;
  hex: string;
  assembly: string;
}

export type PipelineRegisterName = 'IF/ID' | 'ID/EX' | 'EX/MEM' | 'MEM/WB';

export interface PipelineRegister {
  name: PipelineRegisterName;
  instruction: Instruction | null;
}

export interface SimulationState {
  clockCycle: number;
  pipeline: PipelineRegister[];
  history: Record<PipelineRegisterName, (Instruction | null)[]>;
  wbHistory: (Instruction | null)[];
}

const REGISTER_NAMES_MAP: Record<PipelineRegisterName, string> = {
  'IF/ID': 'Instruction Fetch / Instruction Decode',
  'ID/EX': 'Instruction Decode / Execute',
  'EX/MEM': 'Execute / Memory Access',
  'MEM/WB': 'Memory Access / Write Back',
};
const PIPELINE_REGISTER_NAMES: PipelineRegisterName[] = ['IF/ID', 'ID/EX', 'EX/MEM', 'MEM/WB'];

const REGISTER_NAMES = [
  'zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3',
  't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
  's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7',
  't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'
];

// MIPS v6 compliant decoder
function decodeHex(hex: string): string {
    if (hex === '0x00000000') return 'nop';

    const inst = parseInt(hex, 16);
    const opcode = (inst >> 26) & 0x3F;

    // R-type instructions
    if (opcode === 0x00) {
        const rs = (inst >> 21) & 0x1F;
        const rt = (inst >> 16) & 0x1F;
        const rd = (inst >> 11) & 0x1F;
        const shamt = (inst >> 6) & 0x1F;
        const funct = inst & 0x3F;

        switch (funct) {
            case 0x20: return `add $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x21: return `addu $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x24: return `and $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x08: return `jr $${REGISTER_NAMES[rs]}`;
            case 0x27: return `nor $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x25: return `or $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x2a: return `slt $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x2b: return `sltu $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x00: return `sll $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rt]}, ${shamt}`;
            case 0x02: return `srl $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rt]}, ${shamt}`;
            case 0x22: return `sub $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            case 0x23: return `subu $${REGISTER_NAMES[rd]}, $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}`;
            default: return `R-type (funct: ${funct})`;
        }
    }

    const rs = (inst >> 21) & 0x1F;
    const rt = (inst >> 16) & 0x1F;
    const immediate = inst & 0xFFFF;
    // Sign-extend for branch instructions
    const signedImmediate = (immediate << 16) >> 16; 

    // J-type instructions
    if (opcode === 0x02 || opcode === 0x03) {
        const address = inst & 0x03FFFFFF;
        return `${opcode === 0x02 ? 'j' : 'jal'} 0x${address.toString(16)}`;
    }

    // I-type instructions
    switch (opcode) {
        case 0x08: return `addi $${REGISTER_NAMES[rt]}, $${REGISTER_NAMES[rs]}, ${signedImmediate}`;
        case 0x09: return `addiu $${REGISTER_NAMES[rt]}, $${REGISTER_NAMES[rs]}, ${signedImmediate}`;
        case 0x0c: return `andi $${REGISTER_NAMES[rt]}, $${REGISTER_NAMES[rs]}, 0x${immediate.toString(16)}`;
        case 0x04: return `beq $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}, ${signedImmediate}`;
        case 0x05: return `bne $${REGISTER_NAMES[rs]}, $${REGISTER_NAMES[rt]}, ${signedImmediate}`;
        case 0x23: return `lw $${REGISTER_NAMES[rt]}, ${signedImmediate}($${REGISTER_NAMES[rs]})`;
        case 0x0f: return `lui $${REGISTER_NAMES[rt]}, 0x${immediate.toString(16)}`;
        case 0x0d: return `ori $${REGISTER_NAMES[rt]}, $${REGISTER_NAMES[rs]}, 0x${immediate.toString(16)}`;
        case 0x0a: return `slti $${REGISTER_NAMES[rt]}, $${REGISTER_NAMES[rs]}, ${signedImmediate}`;
        case 0x2b: return `sw $${REGISTER_NAMES[rt]}, ${signedImmediate}($${REGISTER_NAMES[rs]})`;
        case 0x24: return `lbu $${REGISTER_NAMES[rt]}, ${signedImmediate}($${REGISTER_NAMES[rs]})`;
        case 0x25: return `lhu $${REGISTER_NAMES[rt]}, ${signedImmediate}($${REGISTER_NAMES[rs]})`;
        case 0x28: return `sb $${REGISTER_NAMES[rt]}, ${signedImmediate}($${REGISTER_NAMES[rs]})`;
        case 0x29: return `sh $${REGISTER_NAMES[rt]}, ${signedImmediate}($${REGISTER_NAMES[rs]})`;
        default: return `Unknown (op: ${opcode})`;
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
    pipeline: PIPELINE_REGISTER_NAMES.map(name => ({
      name,
      instruction: null,
    })),
    history: {
      'IF/ID': [],
      'ID/EX': [],
      'EX/MEM': [],
      'MEM/WB': [],
    },
    wbHistory: [],
  };
}

export function step(currentState: SimulationState, instructions: Instruction[]): SimulationState {
  const newPipeline: PipelineRegister[] = JSON.parse(JSON.stringify(currentState.pipeline));
  const newHistory = JSON.parse(JSON.stringify(currentState.history));
  const newWbHistory = [...currentState.wbHistory];
  const nextClockCycle = currentState.clockCycle + 1;

  // Log current state to history before advancing
  newHistory['IF/ID'].push(newPipeline[0].instruction);
  newHistory['ID/EX'].push(newPipeline[1].instruction);
  newHistory['EX/MEM'].push(newPipeline[2].instruction);
  newHistory['MEM/WB'].push(newPipeline[3].instruction);
  newWbHistory.push(newPipeline[3].instruction); // Instruction in MEM/WB is what's being written back

  // Advance pipeline
  newPipeline[3].instruction = newPipeline[2].instruction;
  newPipeline[2].instruction = newPipeline[1].instruction;
  newPipeline[1].instruction = newPipeline[0].instruction;
  
  // IF stage fetches new instruction and places it in IF/ID register
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
    wbHistory: newWbHistory,
  };
}
