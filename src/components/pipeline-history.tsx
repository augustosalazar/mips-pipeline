'use client';
import type { Instruction, PipelineRegisterName } from '@/lib/mips-simulator';
import { ScrollArea } from './ui/scroll-area';

interface PipelineHistoryProps {
  history: Record<PipelineRegisterName, (Instruction | null)[]>;
  wbHistory: (Instruction | null)[];
}

const stageDetails: Record<PipelineRegisterName | 'WB', { name: string }> = {
    'IF/ID': { name: 'IF/ID Register' },
    'ID/EX': { name: 'ID/EX Register' },
    'EX/MEM': { name: 'EX/MEM Register' },
    'MEM/WB': { name: 'MEM/WB Register' },
    'WB': { name: 'Write Back Stage' }
}

export function PipelineHistory({ history, wbHistory }: PipelineHistoryProps) {
  const registers = Object.keys(history) as PipelineRegisterName[];
  const allStages = [...registers, 'WB'] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {allStages.map((stage) => (
        <div key={stage}>
          <h3 className="font-semibold text-center mb-2">{stageDetails[stage].name}</h3>
          <ScrollArea className="h-64 rounded-md border bg-muted/20">
            <div className="p-2 space-y-1">
              {(stage === 'WB' ? wbHistory : history[stage]).map((instr, index) => (
                <div key={index}>
                    <div
                      className="font-mono text-xs p-1.5 rounded-sm text-center bg-background"
                    >
                      {instr ? (instr.hex === '0x00000000' ? 'nop' : instr.hex) : 'empty'}
                    </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
