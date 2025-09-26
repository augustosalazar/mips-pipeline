import MipsVisualizer from '@/components/mips-visualizer';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">MIPS Pipeline Visualizer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Enter your 32-bit MIPS instructions in hexadecimal format to see them flow through a 5-stage pipeline.
        </p>
      </header>
      <MipsVisualizer />
    </main>
  );
}
