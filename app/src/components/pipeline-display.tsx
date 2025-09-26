import type { PipelineStage as PipelineStageType } from '@/lib/mips-simulator';
import { PipelineStage } from './pipeline-stage';
import { ChevronRight } from 'lucide-react';

interface PipelineDisplayProps {
  pipeline: PipelineStageType[];
}

export function PipelineDisplay({ pipeline }: PipelineDisplayProps) {
  return (
    <div className="relative overflow-x-auto pb-2">
        <div className="flex items-stretch justify-between gap-1 md:gap-2 p-1">
        {pipeline.map((stage, index) => (
            <div key={stage.stage} className="flex grow items-center min-w-[5rem] md:min-w-0">
                <div className="flex-1">
                    <PipelineStage
                        stageName={stage.stage}
                        instruction={stage.instruction?.hex ?? '---'}
                        fullInstruction={stage.instruction?.assembly ?? 'empty'}
                        isActive={stage.instruction !== null}
                    />
                </div>
                {index < pipeline.length - 1 && (
                    <ChevronRight className="h-8 w-8 text-muted-foreground mx-1 md:mx-2 shrink-0" />
                )}
            </div>
        ))}
        </div>
    </div>
  );
}
