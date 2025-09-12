'use client';

import { Cpu, MemoryStick, Square, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const DatapathComponent = ({ title, icon, className, children }: { title: string, icon: React.ReactNode, className?: string, children?: React.ReactNode }) => (
  <div className={cn('relative border-2 border-primary rounded-lg bg-card p-2 flex flex-col items-center justify-center text-center shadow-md', className)}>
    {icon}
    <span className="text-xs font-semibold mt-1 text-primary whitespace-nowrap">{title}</span>
    {children}
  </div>
);

const Arrow = ({ className }: { className?: string }) => (
    <div className={cn('absolute z-0 transform', className)}>
        <div className="w-2 h-2 bg-muted-foreground" style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}></div>
    </div>
);


const Line = ({ className }: { className?: string }) => (
  <div className={cn('absolute bg-muted-foreground z-0', className)} />
);

export function DatapathDiagram() {
  return (
    <div className="relative w-full h-[28rem] md:h-96 bg-background rounded-lg p-4 select-none">
      {/* Lines and Arrows */}
      <Line className="h-px w-[12%] top-[28%] left-[18%]" />
      <Arrow className="top-[27.5%] left-[29%]" />
      
      <Line className="h-[25%] w-px top-[28%] left-[45%]" />
      <Arrow className="top-[52%] left-[44.5%]" />

      <Line className="h-px w-[12%] top-[52.5%] left-[55%]" />
      <Arrow className="top-[52%]" style={{ left: 'calc(67% - 8px)'}} />
      
      <Line className="h-px w-[12%] top-[52.5%] left-[77%]" />
      <Arrow className="top-[52%]" style={{ left: 'calc(89% - 8px)'}} />
      
      <Line className="h-px w-[22%] top-[78%] left-[67%]" />
      <Line className="h-[26%] w-px top-[52.5%] left-[67%]" />
      
      <Line className="h-[43%] w-px top-[28%] left-[55%]" />
      <Line className="h-px w-[10%] bottom-[28.5%] left-[45%]" />
      <Arrow className="bottom-[28%] left-[44.5%]" />
      
      <Line className="h-[24%] w-px top-[52.5%] left-[26%]" />
      <Line className="h-px w-[19%] top-[52.5%] left-[26%]" />


      {/* Components */}
      <DatapathComponent title="PC" icon={<Square className="w-6 h-6" />} className="absolute w-1/6 h-1/4 top-[16%] left-0 z-10" />
      
      <DatapathComponent title="Instruction Memory" icon={<MemoryStick className="w-8 h-8" />} className="absolute w-1/6 h-1/3 top-[12%] left-[29%] z-10" />

      <DatapathComponent title="Registers" icon={<Database className="w-8 h-8" />} className="absolute w-1/6 h-1/3 top-[36%] left-[18%] z-10" />
      
      <DatapathComponent title="ALU" icon={<Cpu className="w-8 h-8" />} className="absolute w-1/6 h-1/4 top-[40%] left-[45%] z-10" />

      <DatapathComponent title="Data Memory" icon={<MemoryStick className="w-8 h-8" />} className="absolute w-1/6 h-1/3 top-[36%] left-[67%] z-10" />
      
      <div className="absolute top-[45%] left-[90%] w-1/6 text-center z-10">
        <DatapathComponent title="Write Back" icon={<div className="w-8 h-8"/>} className="border-dashed bg-card/50" />
      </div>
    </div>
  );
}
