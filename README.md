# 🧠 Soft Computing Interactive Lab

A modern, highly interactive educational web application designed for engineering students to learn the fundamental concepts of Artificial Neural Networks (ANN). 

Built with **Next.js 16**, **React**, and **TypeScript**, this simulator visualizes the earliest AI models—the McCulloch-Pitts Neuron and the Perceptron—allowing you to watch neural networks "learn" in real-time.

---

## ✨ Features

### 1. 🤖 Perceptron Learning Simulator
Unlike ordinary calculators, this simulator automatically trains itself by adjusting its weights and bias until the predicted output matches the target logic gate (AND, OR, NAND, NOR).
- **Live Training Engine:** Watch the Perceptron update its weights epoch by epoch.
- **Dynamic Network Visualizer:** Glowing neon SVG visualizer that highlights active inputs and computes the weighted sum in real time.
- **Mathematical Transparency:** Step-by-step breakdown of the Error Calculation and Weight Update Rules.
- **Interactive Epoch Charts:** Visualize the error rate converging to zero across training epochs.

### 2. ⚡ McCulloch-Pitts (MCP) Virtual Lab
Before AI could learn its own weights, the MCP Neuron laid the foundation using manual threshold logic. This interactive lab makes it easy to understand the math.
- **Threshold Designer:** Automatically calculate the exact threshold using the theoretical formula `θ ≥ nw − p`.
- **Custom Gate Builder:** Add excitatory and inhibitory inputs, adjust their weights, and generate a live truth table.
- **"Explain Like a Teacher" Mode:** Click any row in the truth table to see a plain-English, step-by-step mathematical proof of why the neuron fired.
- **Library & Interactive Quiz:** Browse pre-built standard gates (AND, OR, NOT) and test your knowledge with auto-generated math problems.

### 3. 🎨 Anti-Gravity Design System
- **Floating Glassmorphism:** Sleek, modern UI with frosted glass cards and animated particle backgrounds.
- **Neon Color Palette:** Deep purples (`#6C63FF`), vibrant cyans (`#00D4FF`), and warning yellows (`#FFB800`).
- **Zero-Latency Animations:** State-driven React components ensure buttery-smooth UI transitions during complex training loops.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or newer)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/perceptron-simulator.git
   cd perceptron-simulator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables (`globals.css`)
- **Icons:** Lucide React
- **Math Rendering:** KaTeX
- **Charts:** Chart.js + react-chartjs-2

---

## 🎓 Built for Education
This tool was specifically built as a "Virtual Laboratory" to replace static blackboard lectures with an interactive sandbox. By bridging the gap between abstract mathematical formulas and visual feedback, it helps students truly understand the building blocks of Deep Learning.

*Created for Soft Computing & Artificial Intelligence engineering coursework.*
