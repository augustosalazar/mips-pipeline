'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface PipelineStageProps {
  stageName: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';
  instruction: string;
  fullInstruction: string;
  isActive: boolean;
}

const stageDetails = {
    IF: { name: 'Instruction Fetch' },
    ID: { name: 'Instruction Decode' },
    EX: { name: 'Execute' },
    MEM: { name: 'Memory Access' },
    WB: { name: 'Write Back' }
}

export function PipelineStage({ stageName, instruction, fullInstruction, isActive }: PipelineStageProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn(
            'text-center transition-all duration-300 w-full h-full',
            isActive ? 'border-accent shadow-lg shadow-accent/20' : 'border-border',
          )}>
            <CardHeader className="p-2 md:p-4">
              <CardTitle className={cn(
                  'text-sm md:text-base font-bold',
                  isActive ? 'text-accent' : 'text-muted-foreground'
                )}>
                  {stageName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4 pt-0">
              <p className="font-mono text-xs md:text-sm truncate bg-muted/50 rounded-md p-2 h-9 flex items-center justify-center">
                {instruction === '0x00000000' ? 'nop' : instruction}
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
            <p className="font-semibold">{stageDetails[stageName].name}</p>
            <p className="font-mono text-sm">{fullInstruction === '0x00000000' ? 'nop' : fullInstruction}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
