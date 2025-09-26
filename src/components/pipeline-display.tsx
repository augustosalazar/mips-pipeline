import type { PipelineRegister as PipelineRegisterType } from '@/lib/mips-simulator';
import { PipelineStage } from './pipeline-stage';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface PipelineDisplayProps {
  pipeline: PipelineRegisterType[];
}

const STAGES = [
    { name: 'Instruction', description: 'Memory' },
    { name: 'Register', description: 'Unit' },
    { name: 'ALU', description: '' },
    { name: 'Memory', description: '' },
];

export function PipelineDisplay({ pipeline }: PipelineDisplayProps) {
  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex items-center justify-between gap-1 md:gap-2 p-1">
        {/* IF Stage */}
        <div className="flex flex-col items-center text-center w-20 shrink-0">
          <p className="font-bold">{STAGES[0].name}</p>
          <p className="text-xs text-muted-foreground">{STAGES[0].description}</p>
        </div>

        {/* Pipeline Registers */}
        {pipeline.map((register, index) => (
          <div key={register.name} className="flex grow items-center min-w-[5rem] md:min-w-0">
            <div className="flex-1">
              <PipelineStage
                stageName={register.name}
                instruction={register.instruction?.hex ?? '---'}
                fullInstruction={register.instruction?.assembly ?? 'empty'}
                isActive={register.instruction !== null}
              />
            </div>
            {index < pipeline.length - 1 && (
              <>
                <div className="flex flex-col items-center text-center w-20 shrink-0 mx-1 md:mx-2">
                    <p className="font-bold">{STAGES[index + 1]?.name}</p>
                    <p className="text-xs text-muted-foreground">{STAGES[index + 1]?.description}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
