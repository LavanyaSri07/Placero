import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { EngineeringBranch } from '../types/index.ts';
import {
  Cpu,
  Calculator,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';

export const CoreEngineerModeView: React.FC = () => {
  const { user } = useApp();

  const [selectedBranch, setSelectedBranch] = useState<EngineeringBranch>(
    user?.branch || 'Chemical Engineering'
  );
  const [activeTool, setActiveTool] = useState<'npsh' | 'gdt' | 'distillation' | 'datasheet'>('npsh');

  // NPSH Calculator State
  const [suctionPressure, setSuctionPressure] = useState<number>(101.3); // kPa
  const [vaporPressure, setVaporPressure] = useState<number>(2.34); // kPa (water at 20C)
  const [density, setDensity] = useState<number>(1000); // kg/m3
  const [staticHead, setStaticHead] = useState<number>(3.5); // meters (positive if flooded suction)
  const [frictionLoss, setFrictionLoss] = useState<number>(0.8); // meters
  const [npshRequired, setNpshRequired] = useState<number>(2.8); // meters

  // Calculations for NPSH
  const g = 9.81;
  const pSuctionHead = (suctionPressure * 1000) / (density * g);
  const pVaporHead = (vaporPressure * 1000) / (density * g);
  const npshAvailable = pSuctionHead + staticHead - frictionLoss - pVaporHead;
  const isCavitationRisk = npshAvailable < npshRequired * 1.15; // 15% safety margin

  // GD&T Calculator State
  const [specifiedPositionTol, setSpecifiedPositionTol] = useState<number>(0.15); // mm
  const [mmcDiameter, setMmcDiameter] = useState<number>(10.0); // mm (smallest hole)
  const [actualDiameter, setActualDiameter] = useState<number>(10.12); // mm
  const bonusTolerance = Math.max(0, actualDiameter - mmcDiameter);
  const totalAllowableTolerance = specifiedPositionTol + bonusTolerance;

  // Distillation Fenske State
  const [relativeVolatility, setRelativeVolatility] = useState<number>(2.4);
  const [lightKeyDistillate, setLightKeyDistillate] = useState<number>(0.95);
  const [heavyKeyDistillate, setHeavyKeyDistillate] = useState<number>(0.05);
  const [lightKeyBottom, setLightKeyBottom] = useState<number>(0.04);
  const [heavyKeyBottom, setHeavyKeyBottom] = useState<number>(0.96);

  // Fenske equation: N_min = ln( (x_d / (1-x_d)) * ((1-x_b) / x_b) ) / ln(alpha)
  const sepD = lightKeyDistillate / heavyKeyDistillate;
  const sepB = heavyKeyBottom / lightKeyBottom;
  const minStages = Math.log(sepD * sepB) / Math.log(relativeVolatility);

  // Datasheet Decoder Mock State
  const [datasheetQuery, setDatasheetQuery] = useState('');
  const [datasheetAnswer, setDatasheetAnswer] = useState<string | null>(null);

  const handleDatasheetQuery = () => {
    if (!datasheetQuery) return;
    setDatasheetAnswer(
      `Datasheet Analysis for query "${datasheetQuery}":
• Maximum Operating Temperature: 125°C junction temperature.
• Absolute Maximum Ratings: Continuous drain current I_D = 45A at 25°C, thermal de-rating of 0.4W/°C above 50°C.
• Recommended Safety Interlock: Add a gate resistor of 10Ω to dampen ringing caused by stray PCB inductance.
• Verified Compliance: Meets AEC-Q101 automotive qualification standards.`
    );
  };

  const branches: EngineeringBranch[] = [
    'Chemical Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics & Communication Engineering',
    'Civil Engineering',
    'Computer Science Engineering',
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <span>Branch Specific Depth</span>
              <span>•</span>
              <span>Rigorous Engineering Simulators</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Core Engineer Mode</span>
              <span className="text-sky-400">⚙️</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real engineering calculations, code standards (ASME, ASTM, IS 456, API, IEEE), hydraulic NPSH solvers, and datasheet extraction. The cornerstone of technical campus interviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition border ${
                  selectedBranch === b
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
                }`}
              >
                {b.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'npsh', label: 'NPSH & Pump Cavitation Solver' },
          { id: 'gdt', label: 'GD&T True Position & Bonus Tolerance' },
          { id: 'distillation', label: 'Distillation Fenske Stages' },
          { id: 'datasheet', label: 'Datasheet Decoder (AI Query)' },
        ].map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              activeTool === tool.id
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* TOOL 1: NPSH & PUMP CAVITATION SOLVER */}
      {activeTool === 'npsh' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-400" />
                <span>Centrifugal Pump NPSH_a vs NPSH_r Solver</span>
              </h2>
              <p className="text-xs text-slate-400">
                Formula: NPSH_a = (P_suction - P_vapor)/(ρ*g) + h_static - h_friction
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              Standard: API 610 / ISO 13709
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Suction Pressure P_s (kPa)</label>
                  <input
                    type="number"
                    value={suctionPressure}
                    onChange={(e) => setSuctionPressure(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fluid Vapor Pressure P_v (kPa)</label>
                  <input
                    type="number"
                    value={vaporPressure}
                    onChange={(e) => setVaporPressure(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Static Head h_s (m)</label>
                  <input
                    type="number"
                    value={staticHead}
                    onChange={(e) => setStaticHead(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Suction Line Friction h_f (m)</label>
                  <input
                    type="number"
                    value={frictionLoss}
                    onChange={(e) => setFrictionLoss(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Manufacturer NPSH Required NPSH_r (m)
                </label>
                <input
                  type="number"
                  value={npshRequired}
                  onChange={(e) => setNpshRequired(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-amber-500/50 rounded-xl text-sm text-slate-200 font-mono"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Calculated Hydraulic Result</div>
                <div className="text-3xl font-black font-mono text-sky-400 mt-1">
                  NPSH_a = {npshAvailable.toFixed(2)} m
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  NPSH_r = {npshRequired.toFixed(2)} m (Margin: +{(npshAvailable - npshRequired).toFixed(2)} m)
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isCavitationRisk
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {isCavitationRisk ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block text-xs font-bold uppercase">
                    {isCavitationRisk ? 'High Cavitation & Vapor Pitting Risk!' : 'Safe Operating Envelope'}
                  </strong>
                  <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                    {isCavitationRisk
                      ? 'NPSH available is dangerously close to or below NPSH required. Recommendation: Elevate upstream vessel, reduce suction line friction (clean strainer), sub-cool the liquid, or throttle DISCHARGE valve to reduce flow.'
                      : 'NPSH margin exceeds 15% safety threshold. Fluid pressure at impeller eye remains safely above liquid vapor pressure.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: GD&T TRUE POSITION & BONUS TOLERANCE */}
      {activeTool === 'gdt' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                <span>GD&T True Position & Bonus Tolerance (MMC)</span>
              </h2>
              <p className="text-xs text-slate-400">Standard: ASME Y14.5-2018</p>
            </div>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded">
              Feature of Size (Hole / Pin)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specified Positional Tolerance ⌀ (mm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={specifiedPositionTol}
                  onChange={(e) => setSpecifiedPositionTol(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Maximum Material Condition (MMC) Hole Diameter (mm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={mmcDiameter}
                  onChange={(e) => setMmcDiameter(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Actual Produced Hole Diameter (mm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={actualDiameter}
                  onChange={(e) => setActualDiameter(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tolerance Stack Calculation</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Base Drawing Positional Tolerance:</span>
                  <span className="font-mono text-slate-200">{specifiedPositionTol.toFixed(3)} mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Bonus Tolerance Earned (Actual - MMC):</span>
                  <span className="font-mono text-emerald-400">+{bonusTolerance.toFixed(3)} mm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800 font-bold text-sm">
                  <span className="text-white">Total Allowable Positional Tolerance:</span>
                  <span className="font-mono text-purple-300">⌀ {totalAllowableTolerance.toFixed(3)} mm</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic leading-relaxed pt-2">
                "Bonus tolerance ensures functional assembly with mating fastener pins without scrapping oversized holes, reducing manufacturing rejections."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: DISTILLATION FENSKE */}
      {activeTool === 'distillation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <span>Distillation Minimum Stages (Fenske Equation)</span>
              </h2>
              <p className="text-xs text-slate-400">Fenske Equation for Total Reflux condition</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Average Relative Volatility (α)</label>
                <input
                  type="number"
                  step="0.1"
                  value={relativeVolatility}
                  onChange={(e) => setRelativeVolatility(parseFloat(e.target.value) || 1.1)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Distillate Light Key (x_d)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={lightKeyDistillate}
                    onChange={(e) => setLightKeyDistillate(parseFloat(e.target.value) || 0.9)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bottoms Light Key (x_b)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={lightKeyBottom}
                    onChange={(e) => setLightKeyBottom(parseFloat(e.target.value) || 0.05)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Minimum Theoretical Stages</div>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  N_min = {minStages.toFixed(1)} Stages
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  At 70% tray efficiency: ~{Math.ceil(minStages / 0.7)} actual trays
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic border-t border-slate-800 pt-3">
                Total reflux gives the absolute minimum number of trays for a separation. In commercial design, columns operate at 1.1 to 1.3 times the minimum reflux ratio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: DATASHEET DECODER */}
      {activeTool === 'datasheet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              <span>Industrial Datasheet Decoder</span>
            </h2>
            <p className="text-xs text-slate-400">
              Query ratings, operating boundaries, thermal limits, and pinout constraints without missing fine print.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={datasheetQuery}
              onChange={(e) => setDatasheetQuery(e.target.value)}
              placeholder="e.g. IRF540N MOSFET maximum junction temperature and gate resistance?"
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleDatasheetQuery}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              Analyze Datasheet
            </button>
          </div>

          {datasheetAnswer && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono whitespace-pre-line leading-relaxed">
              {datasheetAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
