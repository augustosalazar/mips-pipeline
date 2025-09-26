'use client';

import { cn } from '@/lib/utils';
import type { PipelineRegisterName } from '@/lib/mips-simulator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface PipelineStageProps {
  stageName: PipelineRegisterName;
  instruction: string;
  fullInstruction: string;
  isActive: boolean;
}

const registerDetails: Record<PipelineRegisterName, { name: string }> = {
    'IF/ID': { name: 'Instruction Fetch / Decode' },
    'ID/EX': { name: 'Instruction Decode / Execute' },
    'EX/MEM': { name: 'Execute / Memory Access' },
    'MEM/WB': { name: 'Memory Access / Write Back' }
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
            <p className="font-semibold">{registerDetails[stageName].name} Register</p>
            <p className="font-mono text-sm">{fullInstruction === '0x00000000' ? 'nop' : fullInstruction}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
