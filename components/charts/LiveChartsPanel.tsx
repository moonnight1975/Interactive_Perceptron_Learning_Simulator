'use client';
import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrainingStep } from '@/lib/perceptron';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CHART_OPTIONS = (title: string, color: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 200 },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: title,
      color: 'rgba(255,255,255,0.6)',
      font: { size: 11, family: 'Inter', weight: '500' as const },
      padding: { bottom: 6 },
    },
    tooltip: {
      backgroundColor: 'rgba(5,5,16,0.95)',
      borderColor: 'rgba(108,99,255,0.3)',
      borderWidth: 1,
      titleColor: 'rgba(255,255,255,0.8)',
      bodyColor: color,
      bodyFont: { family: 'JetBrains Mono' },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9, family: 'JetBrains Mono' }, maxTicksLimit: 8 },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9, family: 'JetBrains Mono' } },
    },
  },
});

function makeDataset(data: number[], label: string, color: string) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color + '15',
    borderWidth: 2,
    pointRadius: data.length > 30 ? 0 : 3,
    pointBackgroundColor: color,
    fill: true,
    tension: 0.3,
  };
}

interface LiveChartsPanelProps {
  steps: TrainingStep[];
  currentStepIndex: number;
}

export default function LiveChartsPanel({ steps, currentStepIndex }: LiveChartsPanelProps) {
  const visibleSteps = steps.slice(0, Math.max(0, currentStepIndex + 1));

  if (visibleSteps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)] text-sm">
        Charts will appear during training...
      </div>
    );
  }

  const labels = visibleSteps.map((s, i) => `${i + 1}`);
  const w1Data = visibleSteps.map(s => s.weights[0]);
  const w2Data = visibleSteps.map(s => s.weights[1]);
  const biasData = visibleSteps.map(s => s.bias);
  const errorData = visibleSteps.map(s => Math.abs(s.error));

  const chartConfigs = [
    { title: 'W₁ vs Step', color: '#6C63FF', data: w1Data },
    { title: 'W₂ vs Step', color: '#00D4FF', data: w2Data },
    { title: 'Bias vs Step', color: '#FFB800', data: biasData },
    { title: '|Error| vs Step', color: '#FF4444', data: errorData },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {chartConfigs.map(({ title, color, data }) => (
        <div key={title} className="glass-card p-3" style={{ height: 180 }}>
          <Line
            data={{
              labels,
              datasets: [makeDataset(data, title, color)],
            }}
            options={CHART_OPTIONS(title, color) as any}
          />
        </div>
      ))}
    </div>
  );
}
