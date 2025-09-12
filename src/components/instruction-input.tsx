'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { SimulationMode } from '@/lib/mips-simulator';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface InstructionInputProps {
  onSimulate: (code: string) => void;
  onNextCycle: () => void;
  onReset: () => void;
  isSimulating: boolean;
  isLoading: boolean;
  simulationMode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
}

const defaultInstructions = `0x02108025
0x8e110000
0xae120004
0x00640820
0x10800001
0x00000000`;

export function InstructionInput({
  onSimulate,
  onNextCycle,
  onReset,
  isSimulating,
  isLoading,
  simulationMode,
  onModeChange,
}: InstructionInputProps) {
  const [code, setCode] = useState(defaultInstructions);

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Controls & Instructions</CardTitle>
        <CardDescription>Enter instructions and control the simulation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="mips-code">MIPS 32-bit Hex Instructions</Label>
          <Textarea
            id="mips-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder="e.g., 0x0123abcd"
            disabled={isSimulating || isLoading}
          />
        </div>
        <div className="space-y-3">
          <Label>Simulation Logic</Label>
          <RadioGroup
            value={simulationMode}
            onValueChange={(value) => onModeChange(value as SimulationMode)}
            disabled={isSimulating || isLoading}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no_hazards" id="no_hazards" />
              <Label htmlFor="no_hazards">No Hazards (Ideal)</Label>
            </div>
            <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
              <RadioGroupItem value="stalls" id="stalls" disabled />
              <Label htmlFor="stalls">Detect & Stall (Coming Soon)</Label>
            </div>
            <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
              <RadioGroupItem value="forwarding" id="forwarding" disabled />
              <Label htmlFor="forwarding">Detect & Forward (Coming Soon)</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          {!isSimulating ? (
            <Button onClick={() => onSimulate(code)} disabled={isLoading || !code.trim()} className="col-span-2">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Validating...' : 'Simulate'}
            </Button>
          ) : (
            <>
              <Button onClick={onNextCycle} variant="secondary">
                Next Clock Cycle
              </Button>
              <Button onClick={onReset} variant="outline">
                Reset
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
