'use client';
import type { Instruction } from '@/lib/mips-simulator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface PipelineHistoryProps {
  history: Record<'IF' | 'ID' | 'EX' | 'MEM' | 'WB', (Instruction | null)[]>;
}

const stageDetails = {
    IF: { name: 'Instruction Fetch' },
    ID: { name: 'Instruction Decode' },
    EX: { name: 'Execute' },
    MEM: { name: 'Memory Access' },
    WB: { name: 'Write Back' }
}

export function PipelineHistory({ history }: PipelineHistoryProps) {
  const stages = Object.keys(history) as ('IF' | 'ID' | 'EX' | 'MEM' | 'WB')[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stages.map((stage) => (
        <div key={stage}>
          <h3 className="font-semibold text-center mb-2">{stageDetails[stage].name} ({stage})</h3>
          <ScrollArea className="h-64 rounded-md border bg-muted/20">
            <div className="p-2 space-y-1">
              {history[stage].map((instr, index) => (
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
