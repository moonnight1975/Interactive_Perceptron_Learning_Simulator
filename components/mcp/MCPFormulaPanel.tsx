'use client';

export default function MCPFormulaPanel() {
  return (
    <div className="glass-card p-5 space-y-5">
      <h3 className="font-bold text-sm gradient-text">Core Formulas</h3>

      {/* Weighted Sum */}
      <div className="formula-box">
        <div className="section-label mb-2">Weighted Sum</div>
        <div className="text-center font-mono text-lg font-bold" style={{ color: '#00D4FF' }}>
          Y<sub>in</sub> = Σ x<sub>i</sub>w<sub>i</sub>
        </div>
        <div className="text-xs text-[var(--text-muted)] text-center mt-2">
          Sum of all input values multiplied by their weights
        </div>
      </div>

      {/* Threshold Formula */}
      <div className="formula-box">
        <div className="section-label mb-2">Threshold Formula</div>
        <div className="text-center font-mono text-lg font-bold" style={{ color: '#FFB800' }}>
          θ ≥ nw − p
        </div>
        <div className="text-xs text-[var(--text-muted)] text-center mt-2">
          Minimum threshold for correct classification
        </div>
      </div>

      {/* Activation Function */}
      <div className="formula-box">
        <div className="section-label mb-2">Activation Function</div>
        <div className="font-mono text-sm text-center space-y-1">
          <div className="text-[var(--text-muted)]">Y =</div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-3xl text-[var(--text-muted)] font-light">{'{'}</div>
            <div className="text-left space-y-1">
              <div><span style={{ color: '#00FF94' }} className="font-bold">1</span><span className="text-[var(--text-muted)]">,&nbsp; Y<sub>in</sub> ≥ θ</span></div>
              <div><span style={{ color: '#FF4444' }} className="font-bold">0</span><span className="text-[var(--text-muted)]">,&nbsp; Y<sub>in</sub> &lt; θ</span></div>
            </div>
          </div>
        </div>
        <div className="text-xs text-[var(--text-muted)] text-center mt-2">
          Step function — fires if weighted sum meets threshold
        </div>
      </div>
    </div>
  );
}
