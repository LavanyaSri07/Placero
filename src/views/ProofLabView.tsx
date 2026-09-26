import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProjectEvidence, BomItem } from '../types/index.ts';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Award,
  Sparkles,
  Trash2,
  DollarSign,
  AlertCircle,
  FileCode,
  CheckCircle2,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ProofLabView: React.FC = () => {
  const { proofs, addProof, deleteProof, user, triggerConfetti } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(proofs[0]?.id || null);

  // Form state
  const [title, setTitle] = useState('');
  const [skill, setSkill] = useState('Heat Transfer & Exchangers');
  const [problemStatement, setProblemStatement] = useState('');
  const [engineeringApproach, setEngineeringApproach] = useState('');
  const [toolsUsed, setToolsUsed] = useState('Aspen Plus, Python, AutoCAD');
  const [technicalExplanation, setTechnicalExplanation] = useState('');
  const [quantifiableImpact, setQuantifiableImpact] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [cadOrSimulationNotes, setCadOrSimulationNotes] = useState('');

  // BOM items
  const [bomItems, setBomItems] = useState<BomItem[]>([
    {
      id: '1',
      component: 'Primary Exchanger Tube Bundle',
      quantity: 1,
      unitCost: 120000,
      supplier: 'Godrej Process Equipment',
      reasonSelected: 'SS 316L resistance to pitting corrosion in sour crude',
    },
  ]);

  const addBomRow = () => {
    setBomItems([
      ...bomItems,
      {
        id: Date.now().toString(),
        component: '',
        quantity: 1,
        unitCost: 0,
        supplier: '',
        reasonSelected: '',
      },
    ]);
  };

  const removeBomRow = (id: string) => {
    setBomItems(bomItems.filter((b) => b.id !== id));
  };

  const totalBomCost = bomItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!title || !problemStatement || !quantifiableImpact) {
      setValidationError('Please fill out Project Title, Problem Statement, and Quantifiable Impact.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProof({
        title,
        skill,
        branch: user?.branch || 'Chemical Engineering',
        problemStatement,
        engineeringApproach,
        toolsUsed: toolsUsed.split(',').map((t) => t.trim()),
        technicalExplanation,
        quantifiableImpact,
        lessonsLearned,
        githubUrl: githubUrl || undefined,
        liveDemoUrl: liveDemoUrl || undefined,
        cadOrSimulationNotes: cadOrSimulationNotes || undefined,
        bomItems: bomItems.filter((b) => b.component.trim() !== ''),
      });

      // Reset
      setTitle('');
      setProblemStatement('');
      setEngineeringApproach('');
      setTechnicalExplanation('');
      setQuantifiableImpact('');
      setLessonsLearned('');
      setGithubUrl('');
      setLiveDemoUrl('');
      setCadOrSimulationNotes('');
      setValidationError(null);
      setIsCreating(false);
    } catch (err) {
      console.error('Error adding proof:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <span>Execution Evidence Engine</span>
              <span>•</span>
              <span>Recruiter Verification Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Proof Lab & BOM Cost Engine</span>
              <span className="text-emerald-400">🛡️</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Webpage Objective:</strong> Built on the philosophy <em>"BUILD PROOF, NOT JUST CLAIMS."</em> This workspace converts resume claims into rigorous engineering case studies. Document problem statements, governing equations, CAD/simulation repositories, interactive Bills of Materials (BOM) with unit costs, and quantifiable operational results saved directly to the database and evaluated by AI.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Close Creator' : 'Add New Proof Project'}</span>
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Core Differentiation Banner */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Every verified proof is scored by AI across 5 dimensions: Technical Depth, Practicality, Documentation, Quantifiable Impact, and Reproducibility.
          </span>
        </div>
      </div>

      {/* CREATE NEW PROOF MODAL / FORM */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-emerald-400" />
              <span>Document New Engineering Proof</span>
            </h2>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              AI Verification Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distillation Column Heat Integration via Pinch Analysis"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Core Skill Demonstrated <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. Heat Transfer & Exchangers"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Problem Statement (Real-World Constraint) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Describe the plant bottleneck, vibration issue, or energy inefficiency..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Engineering Approach & Methodology <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={engineeringApproach}
                onChange={(e) => setEngineeringApproach(e.target.value)}
                placeholder="Equations used, standards (ASME/IS/IEEE), boundary assumptions, simulations conducted..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tools & Software Used (Comma separated)
              </label>
              <input
                type="text"
                value={toolsUsed}
                onChange={(e) => setToolsUsed(e.target.value)}
                placeholder="Aspen Plus, ANSYS, SolidWorks, Python, ETAP"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                Quantifiable Impact & Verified Numbers <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={quantifiableImpact}
                onChange={(e) => setQuantifiableImpact(e.target.value)}
                placeholder="e.g. 14.2% reduction in fuel gas duty, 1,180 metric tons CO2 saved"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-emerald-500/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Technical Explanation & Failure Analysis
            </label>
            <textarea
              rows={3}
              value={technicalExplanation}
              onChange={(e) => setTechnicalExplanation(e.target.value)}
              placeholder="Why this configuration was chosen, sensitivity results, trade-offs analyzed..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub / Code Repo URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Live App / Hosted Simulation URL</label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">CAD/Simulation Notes</label>
              <input
                type="text"
                value={cadOrSimulationNotes}
                onChange={(e) => setCadOrSimulationNotes(e.target.value)}
                placeholder="SolidWorks assembly, Aspen flowsheet"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* BILL OF MATERIALS & COST ENGINE */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs text-white">Bill of Materials (BOM) & Prototype Cost Engine</h3>
              </div>
              <button
                type="button"
                onClick={addBomRow}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
            </div>

            <div className="space-y-2">
              {bomItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-900 p-2 rounded-lg text-xs">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Component Name"
                      value={item.component}
                      onChange={(e) => {
                        const copy = [...bomItems];
                        copy[idx].component = e.target.value;
                        setBomItems(copy);
                      }}
                      className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => {
                        const copy = [...bomItems];
                        copy[idx].quantity = parseInt(e.target.value, 10) || 1;
                        setBomItems(copy);
                      }}
                      className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Unit Cost (₹)"
                      value={item.unitCost}
                      onChange={(e) => {
                        const copy = [...bomItems];
                        copy[idx].unitCost = parseFloat(e.target.value) || 0;
                        setBomItems(copy);
                      }}
                      className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Supplier / Vendor"
                      value={item.supplier}
                      onChange={(e) => {
                        const copy = [...bomItems];
                        copy[idx].supplier = e.target.value;
                        setBomItems(copy);
                      }}
                      className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeBomRow(item.id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-800 text-slate-300">
              <span>Total Estimated BOM Value:</span>
              <span className="font-mono text-emerald-400 text-sm">₹{totalBomCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Evaluating with AI...' : 'Submit & Audit Proof (+150 XP)'}
            </button>
          </div>
        </form>
      )}

      {/* PROOF LISTING CARDS */}
      <div className="space-y-4">
        {proofs.map((p) => {
          const isExpanded = expandedId === p.id;
          const score = p.evidenceScore;

          return (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.skill}
                    </span>
                    <span className="text-xs text-slate-400">{p.branch}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-mono">Logged: {p.createdAt}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{p.title}</h2>
                </div>

                {/* Score Pill & Delete */}
                <div className="flex items-center gap-3">
                  {score && (
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <div className="text-right">
                        <div className="text-[10px] text-emerald-400 uppercase font-bold">Proof Score</div>
                        <div className="text-sm font-black text-emerald-300">{score.overall}/100</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => deleteProof(p.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                    title="Delete proof"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quantifiable Impact Highlight */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    Verified Quantifiable Impact:
                  </span>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{p.quantifiableImpact}</p>
                </div>
              </div>

              {/* Tools row */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.toolsUsed?.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {/* Expand / Collapse Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Code Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {p.liveDemoUrl && (
                    <a
                      href={p.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Simulation / App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="text-slate-400 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Hide Engineering Depth' : 'View Full Technical Defense'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Technical Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200 text-xs text-slate-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                      <strong className="text-white block mb-1">Problem Statement:</strong>
                      <p className="leading-relaxed text-slate-400">{p.problemStatement}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                      <strong className="text-white block mb-1">Engineering Approach:</strong>
                      <p className="leading-relaxed text-slate-400">{p.engineeringApproach}</p>
                    </div>
                  </div>

                  {p.technicalExplanation && (
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                      <strong className="text-white block mb-1">Technical Defense & Explanation:</strong>
                      <p className="leading-relaxed text-slate-300">{p.technicalExplanation}</p>
                    </div>
                  )}

                  {/* AI Evidence Score Radar */}
                  {score && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>AI Evidence Audit & Critique:</span>
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">Score: {score.overall}/100</span>
                      </div>
                      <p className="text-slate-300 italic mb-3">{score.aiCritique}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-bold">
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Tech Depth</div>
                          <div className="text-emerald-300 font-mono text-xs">{score.technicalDepth}%</div>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Practicality</div>
                          <div className="text-emerald-300 font-mono text-xs">{score.practicality}%</div>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Docs</div>
                          <div className="text-emerald-300 font-mono text-xs">{score.documentation}%</div>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Quantified</div>
                          <div className="text-emerald-300 font-mono text-xs">{score.quantifiableResults}%</div>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Reproducible</div>
                          <div className="text-emerald-300 font-mono text-xs">{score.reproducibility}%</div>
                        </div>
                      </div>

                      {score.suggestedEnhancement && (
                        <div className="mt-3 text-[11px] text-amber-300 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Recommendation: {score.suggestedEnhancement}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* BOM Table */}
                  {p.bomItems && p.bomItems.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                      <strong className="text-white block mb-2">Bill of Materials (BOM):</strong>
                      <div className="space-y-1.5">
                        {p.bomItems.map((b, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-800 last:border-0">
                            <div>
                              <span className="font-semibold text-slate-200">{b.component}</span>
                              <span className="text-[10px] text-slate-400 ml-2">Qty: {b.quantity} • {b.supplier}</span>
                            </div>
                            <span className="font-mono text-emerald-400">₹{(b.quantity * b.unitCost).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
