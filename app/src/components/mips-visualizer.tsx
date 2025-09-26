'use client';

import { useState } from 'react';
import { InstructionInput } from './instruction-input';
import { PipelineDisplay } from './pipeline-display';
import { PipelineHistory } from './pipeline-history';
import type { Instruction, SimulationState, SimulationMode } from '@/lib/mips-simulator';
import { initializeSimulation, parseInstructions, step } from '@/lib/mips-simulator';
import { validateInstructionsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const MipsVisualizer = () => {
  const { toast } = useToast();
  const [simulation, setSimulation] = useState<SimulationState>(initializeSimulation([]));
  const [sourceInstructions, setSourceInstructions] = useState<Instruction[]>([]);
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('no_hazards');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (code: string) => {
    setIsLoading(true);
    const lines = code.split('\n').map(l => l.trim()).filter(Boolean);
    const validationErrors = await validateInstructionsAction(lines);

    if (validationErrors.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Instructions',
        description: (
          <ul className="list-disc pl-5 max-h-40 overflow-y-auto">
            {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        ),
      });
      setIsLoading(false);
      return;
    }
    
    const instructions = parseInstructions(code);
    setSourceInstructions(instructions);
    setSimulation(initializeSimulation(instructions));
    setIsSimulating(true);
    setIsLoading(false);
  };

  const handleNextCycle = () => {
    if (!isSimulating) return;
    setSimulation(prev => step(prev, sourceInstructions));
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimulation(initializeSimulation([]));
    setSourceInstructions([]);
  };

  const finished = simulation.pipeline.every(stage => stage.instruction === null) && isSimulating && simulation.clockCycle > 0 && simulation.clockCycle > sourceInstructions.length + 4;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <InstructionInput
          onSimulate={handleSimulate}
          onNextCycle={handleNextCycle}
          onReset={handleReset}
          isSimulating={isSimulating}
          isLoading={isLoading}
          simulationMode={simulationMode}
          onModeChange={setSimulationMode}
        />
      </div>
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold font-headline">Pipeline Stages</h2>
              <div className="text-right">
                <div className="font-mono text-lg">Clock Cycle: {simulation.clockCycle}</div>
                {finished && <p className="text-primary font-semibold">Simulation Finished!</p>}
              </div>
            </div>
            <PipelineDisplay pipeline={simulation.pipeline} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold font-headline mb-4">Pipeline History</h2>
            <PipelineHistory history={simulation.history} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MipsVisualizer;
