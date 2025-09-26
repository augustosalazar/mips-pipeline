# **App Name**: MIPS Pipeline Visualizer

## Core Features:

- Instruction Input: Accept a sequence of MIPS 32-bit instructions in hexadecimal format from the user.
- Pipeline Simulation: Simulate the execution of the MIPS instructions through a 5-stage pipeline (IF, ID, EX, MEM, WB).
- Static Pipeline Display: Visually represent the 5-stage pipeline with labels for each stage (Instruction Fetch, Instruction Decode, Execute, Memory Access, Write Back).
- Instruction Flow Animation: Animate the movement of instructions through the pipeline stages on each clock cycle. Use colors or visual cues to indicate the instruction in each stage.
- Datapath Visualization: Display a simplified static datapath diagram that highlights the components involved in each pipeline stage.
- Clock Control: Provide controls (e.g., a 'Next Clock Cycle' button) to advance the simulation step-by-step.
- Error Validation: Provide validation to show a message whenever the code entered by the user has any incorrect parameter/format, with LLM used as a tool
- Simulation Logic Control: Control the logic of the instruction flow from a single point in the code, allowing for simulations without hazards, with stalls, or with forwarding.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a focused, technical feel.
- Background color: Light gray (#EEEEEE) to provide a neutral backdrop that makes the datapath stand out
- Accent color: Orange (#FF9800) to highlight the current active stages
- Body and headline font: 'Inter', sans-serif for clear and modern readability.
- Use simple, geometric icons to represent the pipeline stages and datapath components.
- Arrange the pipeline stages horizontally with the datapath diagram placed below.
- Use smooth transitions to animate the movement of instructions between pipeline stages. Avoid overly flashy animations to maintain focus on the information.