import { Company, EngineeringBranch, InterviewQuestion, DailyFeedCard, AlumniProfile, UserProfile } from '../../src/types/index.ts';

export const SEED_COMPANIES: Company[] = [
  {
    id: 'reliance-industries',
    name: 'Reliance Industries Limited',
    logo: '🏭',
    category: 'Core Engineering',
    industry: 'Petrochemicals, Refining & Energy Transition',
    majorBusinessAreas: ['Jamnagar Refining Complex', 'Polymers & Petrochemicals', 'New Energy & Green Hydrogen', 'Jio Infrastructure'],
    relevantRoles: ['Graduate Engineer Trainee (GET) - Process', 'Operations & Maintenance Engineer', 'Health, Safety & Environment (HSE) Engineer'],
    relevantBranches: ['Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Instrumentation Engineering'],
    frequentlyRequestedSkills: ['Material & Energy Balance', 'Distillation Column Hydraulics', 'Thermodynamics', 'HAZOP & Plant Safety', 'P&ID Interpretation', 'Pump & Compressor Sizing'],
    typicalAssessmentStages: ['Campus Online Aptitude & Technical Test', 'Group Discussion / Case Scenario', 'Technical Interview (Core Fundamentals + Projects)', 'HR Interview'],
    technicalAreas: ['Unit Operations (Heat & Mass Transfer)', 'Reaction Kinetics & Catalysis', 'Process Safety Management (PSM)', 'Instrumentation & Control Loops'],
    behavioralAreas: ['Shift Work Adaptability', 'Safety First Mindset', 'Crisis Handling in Plant Shutdowns'],
    examplePreparationTopics: ['Atmospheric & Vacuum Distillation', 'Centrifugal Pump Cavitation and NPSH calculations', 'Exothermic Runaway Reaction Prevention', 'Aspen Plus flowsheeting'],
    officialCareersUrl: 'https://careers.ril.com',
    officialEngineeringBlogUrl: 'https://www.ril.com/our-businesses/petrochemicals',
    lastVerifiedDate: '2026-08-15',
    sourceReference: 'Official RIL Campus Hiring Guidelines & Graduate Engineering Curriculum',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Analyze the Jamnagar crude refinery distillation preheat train. Identify heat integration bottlenecks and propose fouling mitigation or pinch analysis modifications.'
  },
  {
    id: 'larsen-toubro',
    name: 'Larsen & Toubro (L&T)',
    logo: '🏗️',
    category: 'Core Engineering',
    industry: 'Heavy Engineering, EPC & Infrastructure',
    majorBusinessAreas: ['Hydrocarbon EPC', 'Heavy Civil Infrastructure', 'Defence & Aerospace Systems', 'Power & Smart World'],
    relevantRoles: ['Graduate Engineer Trainee (GET)', 'Design Engineer', 'Site Execution Engineer', 'QA/QC Engineer'],
    relevantBranches: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering'],
    frequentlyRequestedSkills: ['Engineering Drawings (AutoCAD / Revit)', 'Structural Analysis (STAAD Pro / ETABS)', 'IS Code Provisions (IS 456, IS 800)', 'Project Estimation & Scheduling', 'Welding Standards & NDT'],
    typicalAssessmentStages: ['L&T Online Screening Assessment', 'Technical Round 1 (Engineering Fundamentals)', 'Technical Round 2 (Design & Drawing Viva)', 'HR Round'],
    technicalAreas: ['Pre-stressed Concrete & Foundation Design', 'Fabrication of Pressure Vessels (ASME Sec VIII)', 'Substation Layout & Protection (IEC/IS)', 'Risk Assessment & Site Safety'],
    behavioralAreas: ['Relocation Readiness across India', 'High-pressure Project Deadline Management', 'Vendor & Labor Coordination'],
    examplePreparationTopics: ['Design of Retaining Walls & Footings', 'ASME Boiler and Pressure Vessel Code (BPVC)', 'Erection sequencing for heavy precast beams', 'PERT/CPM critical path calculation'],
    officialCareersUrl: 'https://www.larsentoubro.com/careers/',
    officialEngineeringBlogUrl: 'https://www.larsentoubro.com/press-releases/',
    lastVerifiedDate: '2026-07-20',
    sourceReference: 'L&T Corporate HR Engineering Recruitment Portal',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Examine an urban flyover construction site with high traffic density. Audit the precast girder launching system for safety, crane positioning, and structural tolerances.'
  },
  {
    id: 'tata-motors',
    name: 'Tata Motors',
    logo: '🚗',
    category: 'Core Engineering',
    industry: 'Automotive, Commercial & Electric Vehicles',
    majorBusinessAreas: ['Passenger Vehicles & EVs (Nexon, Punch, Harrier)', 'Commercial Vehicles (Trucks & Buses)', 'Powertrain & Battery Systems'],
    relevantRoles: ['Graduate Engineer Trainee - R&D', 'Manufacturing & Quality Engineer', 'Battery Management Systems (BMS) Engineer'],
    relevantBranches: ['Mechanical Engineering', 'Electrical Engineering', 'Electronics & Communication Engineering'],
    frequentlyRequestedSkills: ['CAD (CATIA / SolidWorks)', 'FEA / Crash Simulation (ANSYS / HyperMesh)', 'GD&T (ASME Y14.5)', 'Battery Thermal Management (BTMS)', 'Automotive Electronics & CAN Bus'],
    typicalAssessmentStages: ['Online Technical & Cognitive Test', 'Design/Case Study Challenge', 'Technical Panel Interview', 'Managerial Interview'],
    technicalAreas: ['Internal Combustion vs EV Powertrains', 'Suspension Kinematics & NVH (Noise, Vibration, Harshness)', 'Sheet Metal Stamping & Welding', 'RCA via 8D & Fishbone'],
    behavioralAreas: ['Automotive Passion', 'Innovation in Clean Mobility', 'Cross-functional Collaboration'],
    examplePreparationTopics: ['EV battery pack thermal runaway mitigation', 'Calculation of gear ratios for gradeability and top speed', 'Interpreting true position tolerance in GD&T drawings', 'Regenerative braking control algorithms'],
    officialCareersUrl: 'https://www.tatamotors.com/careers/',
    officialEngineeringBlogUrl: 'https://www.tatamotors.com/news/',
    lastVerifiedDate: '2026-08-01',
    sourceReference: 'Tata Motors Campus Talent Acquisition Portal',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Audit the thermal runaway containment structure of a commercial EV battery pack operating in 45°C ambient Indian climates.'
  },
  {
    id: 'siemens',
    name: 'Siemens',
    logo: '⚡',
    category: 'Core Engineering',
    industry: 'Industrial Automation, Smart Grid & Energy Systems',
    majorBusinessAreas: ['Digital Industries & Automation', 'Smart Infrastructure & Microgrids', 'Mobility & Rail Automation'],
    relevantRoles: ['Associate System Engineer', 'PLC/SCADA Automation Trainee', 'Power Systems Protection Engineer'],
    relevantBranches: ['Electrical Engineering', 'Electronics & Communication Engineering', 'Instrumentation Engineering'],
    frequentlyRequestedSkills: ['PLC Programming (Ladder, FBD, SCL)', 'SCADA / WinCC', 'Power System Protection (Relays, Circuit Breakers)', 'ETAP / MATLAB Simulink', 'Industrial Ethernet (Profinet / Modbus)'],
    typicalAssessmentStages: ['Cognitive & Domain Aptitude Assessment', 'Hands-on Coding or Simulation Task', 'Technical Interview', 'Behavioral Interview'],
    technicalAreas: ['Switchgear & Transformer Protection', 'Variable Frequency Drives (VFD) & Motor Controls', 'Substation Automation (IEC 61850)', 'Industrial IoT & Edge Computing'],
    behavioralAreas: ['Sustainability Consciousness', 'Customer Solution Mindset', 'Self-directed Learning'],
    examplePreparationTopics: ['Differential protection of 33kV/11kV transformers', 'Designing a failsafe conveyor stop logic in TIA Portal', 'Calculating fault currents in radial distribution networks', 'Harmonic mitigation in inverter-fed drives'],
    officialCareersUrl: 'https://jobs.siemens.com',
    officialEngineeringBlogUrl: 'https://www.siemens.com/global/en/company/stories.html',
    lastVerifiedDate: '2026-06-30',
    sourceReference: 'Siemens India University Relations',
    hiringDifficulty: 'Elite',
    reverseAuditPrompt: 'Audit a manufacturing plant motor control center (MCC). Propose an energy-efficient VFD upgrade with harmonic filtering and automated peak-shaving control.'
  },
  {
    id: 'texas-instruments',
    name: 'Texas Instruments',
    logo: '📟',
    category: 'Core Engineering',
    industry: 'Semiconductors & Embedded Processing',
    majorBusinessAreas: ['Analog Power Management', 'Embedded Processing & DSPs', 'Automotive ICs & Radar'],
    relevantRoles: ['Analog Design Trainee', 'Digital Design / Verification Engineer', 'Applications Engineer'],
    relevantBranches: ['Electronics & Communication Engineering', 'Electrical Engineering', 'Computer Science Engineering'],
    frequentlyRequestedSkills: ['Op-Amp Circuit Design & Stability', 'Verilog / SystemVerilog', 'CMOS Inverter Characteristics', 'Signal Integrity & Bode Plots', 'Microcontroller Architecture (ARM Cortex, TI MSP430)'],
    typicalAssessmentStages: ['TI Core Electronics Screening Test', 'Technical Round 1 (Circuit Analysis on Whiteboard)', 'Technical Round 2 (Design Problem Solving)', 'Culture Fit Round'],
    technicalAreas: ['DC-DC Buck/Boost Converters', 'Phase Margin & Gain Margin Calculations', 'Timing Analysis (Setup and Hold Times)', 'ADC/DAC Sampling & Aliasing (Nyquist)'],
    behavioralAreas: ['Rigorous First-Principles Thinking', 'Debugging Tenacity', 'Customer Empathy'],
    examplePreparationTopics: ['Small signal model of MOSFET in saturation', 'Designing a low-dropout (LDO) regulator with high PSRR', 'Clock tree synthesis and race conditions in Verilog', 'Thermal dissipation in high-current IC packages'],
    officialCareersUrl: 'https://careers.ti.com',
    officialEngineeringBlogUrl: 'https://e2e.ti.com/blogs_/',
    lastVerifiedDate: '2026-08-20',
    sourceReference: 'Texas Instruments University Program Guidelines',
    hiringDifficulty: 'Elite',
    reverseAuditPrompt: 'Audit a solar micro-inverter MPPT circuit. Propose an analog closed-loop controller that maximizes conversion efficiency under fast cloud transients.'
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🌐',
    category: 'Software / Technology',
    industry: 'Cloud Computing, Search, AI & Consumer Systems',
    majorBusinessAreas: ['Google Cloud Platform', 'Search & Information Retrieval', 'Android & Hardware', 'YouTube & Ads Infrastructure'],
    relevantRoles: ['Software Engineer (SWE) - University Graduate', 'Site Reliability Engineer (SRE)', 'Associate Product Manager (APM)'],
    relevantBranches: ['Computer Science Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    frequentlyRequestedSkills: ['Data Structures & Algorithms (Trees, Graphs, DP)', 'System Design & Scalability', 'Concurrency & Threading', 'Clean Code in Java/C++/Go/Python', 'Time & Space Complexity Proofs'],
    typicalAssessmentStages: ['Google Online Challenge (GOC)', 'Technical Phone Screen (45 mins)', 'Virtual Onsite (3-4 rounds: 2 Data Structures, 1 Problem Solving, 1 Googleyness & Leadership)'],
    technicalAreas: ['Distributed Systems Fundamentals (CAP Theorem, Sharding, Caching)', 'Graph Traversals (BFS, DFS, Dijkstra, A*)', 'Dynamic Programming and Bit Manipulation', 'Network Protocols (HTTP/3, gRPC, TCP)'],
    behavioralAreas: ['Googleyness: Intellectual Humility, Bias to Action, Doing the Right Thing', 'Navigating Ambiguity', 'Peer Collaboration'],
    examplePreparationTopics: ['Design a distributed URL shortener or rate limiter', 'Shortest path in dynamic graphs with obstacles', 'Optimizing tail latencies in microservice architectures', 'Testing edge cases and write unit test strategies'],
    officialCareersUrl: 'https://careers.google.com',
    officialEngineeringBlogUrl: 'https://blog.google/technology/',
    lastVerifiedDate: '2026-09-01',
    sourceReference: 'Google University Programs & Engineering Hiring Playbook',
    hiringDifficulty: 'Elite',
    reverseAuditPrompt: 'Reverse-engineer the caching and cache-invalidation architecture of Google Docs live multi-user collaboration engine under spotty network connections.'
  },
  {
    id: 'dow-chemicals',
    name: 'Dow Chemical Company',
    logo: '⚗️',
    category: 'Core Engineering',
    industry: 'Specialty Chemicals, Materials Science & Polymers',
    majorBusinessAreas: ['Packaging & Specialty Plastics', 'Industrial Intermediates & Infrastructure', 'Performance Materials & Coatings'],
    relevantRoles: ['Manufacturing & Engineering (M&E) Trainee', 'Process Automation Engineer', 'Research & Development Engineer'],
    relevantBranches: ['Chemical Engineering', 'Mechanical Engineering', 'Biotechnology'],
    frequentlyRequestedSkills: ['Polymerization Reaction Engineering', 'Distillation & Separation Processes', 'HAZOP & Process Hazard Analysis (PHA)', 'Aspen Plus / HYSYS', 'Plant Commissioning Protocols'],
    typicalAssessmentStages: ['Behavioral & Technical Online Assessment', 'Technical Assessment Center', 'Panel Technical & Safety Interview'],
    technicalAreas: ['Thermodynamics of Polymer Blends', 'Mass Transfer in Packed vs Tray Columns', 'Corrosion Management and Metallurgy (NACE)', 'Energy Reduction in Chemical Plants'],
    behavioralAreas: ['Zero Harm Safety Commitment', 'Sustainability & Circular Economy', 'Continuous Improvement (Six Sigma)'],
    examplePreparationTopics: ['Designing a relief valve (PSV) using API 520/521', 'Fluidization regimes in catalytic reactors', 'Estimating minimum reflux ratio using McCabe-Thiele', 'Pinch technology for heat exchanger networks'],
    officialCareersUrl: 'https://corporate.dow.com/en-us/careers.html',
    officialEngineeringBlogUrl: 'https://corporate.dow.com/en-us/news.html',
    lastVerifiedDate: '2026-07-10',
    sourceReference: 'Dow Chemical Global Talent Acquisition',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Audit a continuous ethylene polymerization tubular reactor for localized hot spots. Propose a cooling jacket re-circulation loop and safety shutdown interlock.'
  },
  {
    id: 'caterpillar',
    name: 'Caterpillar Inc.',
    logo: '🚜',
    category: 'Core Engineering',
    industry: 'Heavy Machinery, Construction & Mining Equipment',
    majorBusinessAreas: ['Earthmoving Machinery', 'Resource Industries', 'Energy & Transportation (Diesel/Gas Engines)'],
    relevantRoles: ['Associate Design Engineer', 'Structural Analysis Trainee', 'Hydraulics & Controls Engineer'],
    relevantBranches: ['Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'],
    frequentlyRequestedSkills: ['Hydraulic Circuit Design & Sizing', 'FEA (Stress & Fatigue Life Prediction)', 'Machine Design & Gear Drives', 'Welded Joint Fatigue (Weld Quality Codes)', 'CAN J1939 Protocol'],
    typicalAssessmentStages: ['Aptitude & Mechanical Core Test', 'CAD/Design Case Submission', 'Technical Interview Panel', 'HR Discussion'],
    technicalAreas: ['Fluid Power (Pumps, Valves, Cylinders)', 'Material Failure Analysis & Heat Treatment', 'Vibration Analysis & Damping', 'Engine Cooling & Heat Exchangers'],
    behavioralAreas: ['Reliability Focus under extreme conditions', 'Safety in heavy testing bays', 'Team problem solving'],
    examplePreparationTopics: ['Sizing hydraulic cylinder bore and stroke for 20-ton excavator bucket', 'S-N curve fatigue calculation for cyclic loading', 'Gear tooth bending stress using AGMA standards', 'Troubleshooting hydraulic aeration and cavitation'],
    officialCareersUrl: 'https://www.caterpillar.com/en/careers.html',
    officialEngineeringBlogUrl: 'https://www.caterpillar.com/en/news.html',
    lastVerifiedDate: '2026-08-10',
    sourceReference: 'Caterpillar Engineering Campus Recruitment Program',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Audit the hydraulic boom circuit of a 30-ton excavator. Analyze regenerative valve efficiency and design an accumulator-based energy recovery system.'
  },
  {
    id: 'schneider-electric',
    name: 'Schneider Electric',
    logo: '🔋',
    category: 'Core Engineering',
    industry: 'Energy Management & Next-Gen Automation',
    majorBusinessAreas: ['Low & Medium Voltage Power Distribution', 'Critical Power & Data Centers (UPS)', 'Industrial Automation & EcoStruxure'],
    relevantRoles: ['Graduate Engineer Trainee - Power Systems', 'Firmware Engineer - IoT', 'R&D Applications Engineer'],
    relevantBranches: ['Electrical Engineering', 'Electronics & Communication Engineering', 'Instrumentation Engineering'],
    frequentlyRequestedSkills: ['Short Circuit & Arc Flash Studies', 'Digital Relays & Substation Automation', 'Microgrid Controller Logic', 'Thermal Simulation of Electrical Panels', 'Modbus / BACnet Protocols'],
    typicalAssessmentStages: ['Online Cognitive & Technical Evaluation', 'Technical Assessment / Case Challenge', 'Technical Interview', 'HR Fitment'],
    technicalAreas: ['Breaker Coordination & Discrimination Curves', 'Power Factor Correction & Active Harmonic Filters', 'Battery Energy Storage Systems (BESS)', 'Embedded C for Smart Meters'],
    behavioralAreas: ['Green Energy Transition', 'Customer Centricity', 'Agile Mindset'],
    examplePreparationTopics: ['Setting time-current curves (TCC) for downstream MCCB and upstream ACB', 'Designing an uninterruptible power supply (UPS) bypass circuit', 'Sizing neutral conductor for non-linear triplen harmonics', 'Cybersecurity in OT (Operational Technology) networks'],
    officialCareersUrl: 'https://www.se.com/ww/en/about-us/careers/',
    officialEngineeringBlogUrl: 'https://blog.se.com/',
    lastVerifiedDate: '2026-07-15',
    sourceReference: 'Schneider Electric University Relations',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Audit a 5MW hyperscale data center power distribution system. Propose an eco-friendly UPS with peak shaving battery storage and N+1 redundancy.'
  },
  {
    id: 'asian-paints',
    name: 'Asian Paints',
    logo: '🎨',
    category: 'Core Engineering',
    industry: 'Paints, Coatings & Supply Chain Manufacturing',
    majorBusinessAreas: ['Automated Mega Plants', 'Polymers & Emulsion Synthesis', 'Color Science & Smart Automation'],
    relevantRoles: ['Supply Chain Trainee (SCT)', 'Production Executive', 'Plant Reliability Engineer'],
    relevantBranches: ['Chemical Engineering', 'Mechanical Engineering', 'Instrumentation Engineering', 'Biotechnology'],
    frequentlyRequestedSkills: ['Batch Reactor Scheduling & Cycle Time Reduction', 'Non-Newtonian Fluid Rheology', 'Mixing & Agitation Impeller Selection', 'Total Productive Maintenance (TPM)', 'SCADA Automated Batching'],
    typicalAssessmentStages: ['Online Cognitive & Engineering Test', 'Virtual Simulation Game / Case Study', 'Technical Interview', 'Senior Leadership Interview'],
    technicalAreas: ['Mixing power number and Reynolds number in high-viscosity resins', 'Piping head loss for pseudoplastic fluids', 'Automated CIP (Clean-in-Place) validation', 'OEE (Overall Equipment Effectiveness) improvement'],
    behavioralAreas: ['Floor Leadership & Working with Unionized Staff', 'Root Cause Thinking on Production Lines', 'Supply Chain Agility'],
    examplePreparationTopics: ['Selection of Rushton turbine vs anchor impeller for paint slurry', 'Determining pressure drop for Bingham plastic paint flow', 'Statistical process control (SPC) for batch consistency', 'Safety protocols in solvent-based paint manufacturing'],
    officialCareersUrl: 'https://www.asianpaints.com/careers.html',
    officialEngineeringBlogUrl: 'https://www.asianpaints.com/about-us/manufacturing.html',
    lastVerifiedDate: '2026-08-05',
    sourceReference: 'Asian Paints Supply Chain Talent Program',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Audit an automated paint tinting batch reactor. Analyze mixing dead zones and propose dual-impeller geometry with automated viscosity monitoring.'
  },
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    logo: '📶',
    category: 'Software / Technology',
    industry: 'Wireless Technologies, 5G/6G & Mobile Platforms',
    majorBusinessAreas: ['Snapdragon Processors', '5G/6G Modem & RF Front-End', 'Automotive Cockpit & ADAS Systems', 'On-Device AI Accelerators'],
    relevantRoles: ['Hardware Design Engineer', 'Modem Firmware Engineer', 'SoC Verification Engineer', 'Software Engineer - Android/Linux Kernel'],
    relevantBranches: ['Electronics & Communication Engineering', 'Computer Science Engineering', 'Electrical Engineering'],
    frequentlyRequestedSkills: ['Verilog / SystemVerilog & UVM', 'C / C++ & Embedded Systems', 'Computer Architecture (Pipelining, Cache Coherency)', 'Digital Signal Processing (FFT, Modulation, MIMO)', 'Linux Device Drivers'],
    typicalAssessmentStages: ['Qualcomm Technical Screening Test (Deep Electronics & Coding)', 'Technical Round 1 (Digital Design / Verilog)', 'Technical Round 2 (C / OS / Architecture)', 'Technical Round 3 (Protocols / Hardware-Software Co-design)', 'HR Round'],
    technicalAreas: ['Static Timing Analysis (STA) & Clock Domain Crossing (CDC)', 'Wireless Standards (OFDMA, Beamforming, QAM)', 'Cache memory protocols (MESI) and DMA engines', 'Assembly language & Memory Management Units (MMU)'],
    behavioralAreas: ['Technical Thoroughness', 'Systemic Debugging under tight silicon tape-out deadlines', 'Passion for Cutting-Edge Standards'],
    examplePreparationTopics: ['Design a FIFO with asynchronous read and write clocks', 'Implement a circular buffer in C with lock-free atomic pointers', 'Derive SNR penalty for multipath Rayleigh fading', 'Resolve setup time violation without decreasing clock frequency'],
    officialCareersUrl: 'https://www.qualcomm.com/company/careers',
    officialEngineeringBlogUrl: 'https://www.qualcomm.com/news/onq',
    lastVerifiedDate: '2026-08-25',
    sourceReference: 'Qualcomm University Relations India',
    hiringDifficulty: 'Elite',
    reverseAuditPrompt: 'Audit the thermal throttling and power domain switching logic of an on-device neural processing unit (NPU) running continuous generative vision models.'
  },
  {
    id: 'ongc',
    name: 'Oil and Natural Gas Corporation (ONGC)',
    logo: '🛢️',
    category: 'Core Engineering',
    industry: 'Upstream Oil & Gas Exploration and Production',
    majorBusinessAreas: ['Offshore Drilling Platforms (Mumbai High)', 'Onshore Production Assets', 'Gas Processing Plants', 'Subsea Pipelines'],
    relevantRoles: ['Graduate Trainee - Production', 'Drilling Engineer', 'Mechanical Asset Integrity Engineer', 'Reservoir Engineer'],
    relevantBranches: ['Chemical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'],
    frequentlyRequestedSkills: ['Fluid Mechanics & Multiphase Flow', 'Thermodynamics of Hydrocarbons', 'Wellhead Control & Blowout Preventer (BOP)', 'Corrosion Protection & Cathodic Systems', 'API Standards for Piping & Valves'],
    typicalAssessmentStages: ['GATE Score Merit Ranking or PSU Written Examination', 'Document Verification & Physical Standards', 'Interview Board (Domain Depth + Safety Awareness)'],
    technicalAreas: ['Gas-Oil-Water Three-Phase Separator Sizing', 'Centrifugal vs Reciprocating Compressors for high-pressure gas injection', 'Wedge gate vs ball valves in high sour (H2S) environments', 'Safety Instrumented Systems (SIS) and SIL levels'],
    behavioralAreas: ['Rigorous Safety Discipline', 'Willingness to serve on 14-day offshore rotation shifts', 'Public Sector Nation-Building Vision'],
    examplePreparationTopics: ['Calculating hydrate formation curves in subsea pipelines', 'Design of cathodic protection using sacrificial anodes', 'Troubleshooting liquid carryover in knockout drums', 'Emergency shutdown valves (ESDV) design criteria'],
    officialCareersUrl: 'https://ongcindia.com/web/eng/career',
    officialEngineeringBlogUrl: 'https://ongcindia.com/web/eng/about-ongc',
    lastVerifiedDate: '2026-06-25',
    sourceReference: 'ONGC Graduate Trainee Notification & Guidelines',
    hiringDifficulty: 'Challenging',
    reverseAuditPrompt: 'Audit an offshore three-phase production separator experiencing foaming and liquid carryover during cold weather operations.'
  }
];

export const SEED_SKILLS = [
  // Chemical
  { name: 'Material & Energy Balance', branch: 'Chemical Engineering', benchmark: 85, category: 'Core Fundamentals', proofIdea: 'Complete unsteady-state material balance notebook with recycle stream' },
  { name: 'Thermodynamics & VLE', branch: 'Chemical Engineering', benchmark: 80, category: 'Core Fundamentals', proofIdea: 'Non-ideal VLE calculation using Wilson/NRTL equations in Python/MATLAB' },
  { name: 'Fluid Mechanics & Pumps', branch: 'Chemical Engineering', benchmark: 75, category: 'Unit Operations', proofIdea: 'Piping network pressure drop & NPSH available vs required calculator' },
  { name: 'Heat Transfer & Exchangers', branch: 'Chemical Engineering', benchmark: 80, category: 'Unit Operations', proofIdea: 'Kern method shell-and-tube heat exchanger rating sheet' },
  { name: 'Mass Transfer & Distillation', branch: 'Chemical Engineering', benchmark: 82, category: 'Unit Operations', proofIdea: 'McCabe-Thiele binary distillation column design report' },
  { name: 'Chemical Reaction Engineering', branch: 'Chemical Engineering', benchmark: 78, category: 'Core Fundamentals', proofIdea: 'PFR vs CSTR conversion comparison for reversible exothermic reaction' },
  { name: 'Process Safety & HAZOP', branch: 'Chemical Engineering', benchmark: 85, category: 'Industrial Safety', proofIdea: 'Full HAZOP worksheet study for chlorine vaporizer unit' },
  { name: 'Aspen Plus / Simulation', branch: 'Chemical Engineering', benchmark: 70, category: 'Software & Tools', proofIdea: 'Distillation train simulation with sensitivity analysis & optimization' },
  { name: 'P&ID & PFD Interpretation', branch: 'Chemical Engineering', benchmark: 80, category: 'Engineering Practice', proofIdea: 'Redline review of pump suction line and relief valve arrangement' },

  // Mechanical
  { name: 'Engineering Thermodynamics', branch: 'Mechanical Engineering', benchmark: 80, category: 'Core Fundamentals', proofIdea: 'Rankine cycle reheat-regeneration thermodynamic model' },
  { name: 'Machine Design & Failure Theories', branch: 'Mechanical Engineering', benchmark: 82, category: 'Mechanical Design', proofIdea: 'Shaft design under combined fatigue bending and torsion (Soderberg/Goodman)' },
  { name: 'CAD & Parametric Modeling (SolidWorks/CATIA)', branch: 'Mechanical Engineering', benchmark: 85, category: 'Design Software', proofIdea: 'Multi-part mechanical assembly with 2D drawings & BOM' },
  { name: 'Finite Element Analysis (FEA / ANSYS)', branch: 'Mechanical Engineering', benchmark: 75, category: 'Simulation Tools', proofIdea: 'Mesh convergence study on automotive suspension bracket' },
  { name: 'GD&T (ASME Y14.5)', branch: 'Mechanical Engineering', benchmark: 75, category: 'Manufacturing & Quality', proofIdea: 'Detailed production drawing with true position and MMC tolerances' },
  { name: 'Fluid Mechanics & Hydraulics', branch: 'Mechanical Engineering', benchmark: 78, category: 'Core Fundamentals', proofIdea: 'Hydraulic cylinder circuit schematic with counterbalance valve' },
  { name: 'Manufacturing Processes & Metallurgy', branch: 'Mechanical Engineering', benchmark: 75, category: 'Manufacturing', proofIdea: 'Welding procedure specification (WPS) and casting defect analysis' },
  { name: 'RCA & FMEA (Root Cause Analysis)', branch: 'Mechanical Engineering', benchmark: 80, category: 'Quality & Reliability', proofIdea: 'FMEA table for centrifugal pump mechanical seal failure' },

  // Electrical
  { name: 'Power Systems & Load Flow', branch: 'Electrical Engineering', benchmark: 80, category: 'Power Engineering', proofIdea: 'Newton-Raphson load flow simulation using ETAP or Python' },
  { name: 'Electrical Machines & Transformers', branch: 'Electrical Engineering', benchmark: 82, category: 'Core Fundamentals', proofIdea: 'Equivalent circuit parameter calculation from OC and SC test data' },
  { name: 'Power Electronics & Inverters', branch: 'Electrical Engineering', benchmark: 78, category: 'Power Electronics', proofIdea: 'SPWM three-phase inverter simulation with THD analysis' },
  { name: 'Control Systems & Stability', branch: 'Electrical Engineering', benchmark: 80, category: 'Control Systems', proofIdea: 'Bode & Root Locus controller tuning for DC motor position tracking' },
  { name: 'PLC Programming & SCADA', branch: 'Electrical Engineering', benchmark: 75, category: 'Industrial Automation', proofIdea: 'Automated batch mixing ladder logic with interlocks and alarms' },
  { name: 'Switchgear & Relay Protection', branch: 'Electrical Engineering', benchmark: 75, category: 'Protection', proofIdea: 'Overcurrent and earth fault relay coordination curve' },

  // ECE
  { name: 'Digital Logic & Verilog HDL', branch: 'Electronics & Communication Engineering', benchmark: 85, category: 'VLSI & Digital', proofIdea: 'Parameterized synchronous FIFO testbench in Verilog' },
  { name: 'Analog Circuit Design & Op-Amps', branch: 'Electronics & Communication Engineering', benchmark: 80, category: 'Analog Circuits', proofIdea: 'Active bandpass filter design with frequency response verification' },
  { name: 'Embedded C & Microcontrollers', branch: 'Electronics & Communication Engineering', benchmark: 82, category: 'Embedded Systems', proofIdea: 'Bare-metal UART driver on ARM Cortex-M with DMA transmission' },
  { name: 'PCB Design (KiCad / Altium)', branch: 'Electronics & Communication Engineering', benchmark: 75, category: 'Hardware Prototyping', proofIdea: 'Two-layer sensor node PCB with ground plane and decoupling analysis' },
  { name: 'Wireless Communication & Signals', branch: 'Electronics & Communication Engineering', benchmark: 75, category: 'Communications', proofIdea: 'QPSK modulation and Bit Error Rate (BER) simulation in AWGN' },

  // CSE & IT
  { name: 'Data Structures & Algorithms', branch: 'Computer Science Engineering', benchmark: 88, category: 'Software Foundations', proofIdea: 'LeetCode 150+ categorized solutions repository with complexity analysis' },
  { name: 'System Design & Scalability', branch: 'Computer Science Engineering', benchmark: 78, category: 'Architecture', proofIdea: 'Architecture document for high-throughput distributed URL rate limiter' },
  { name: 'Operating Systems & Concurrency', branch: 'Computer Science Engineering', benchmark: 80, category: 'Core CS', proofIdea: 'Multi-threaded producer-consumer system in C/Go with mutex synchronization' },
  { name: 'Database Management & SQL', branch: 'Computer Science Engineering', benchmark: 82, category: 'Data', proofIdea: 'Normalized database schema with indexed queries & EXPLAIN query plans' },

  // Civil
  { name: 'Structural Analysis & RCC Design', branch: 'Civil Engineering', benchmark: 82, category: 'Structures', proofIdea: 'G+3 residential building frame analysis in STAAD.Pro conforming to IS 456' },
  { name: 'Geotechnical & Foundation Engineering', branch: 'Civil Engineering', benchmark: 78, category: 'Geotechnical', proofIdea: 'Safe bearing capacity and settlement calculation for shallow footing' },
  { name: 'Quantity Estimation & Bar Bending (BBS)', branch: 'Civil Engineering', benchmark: 80, category: 'Construction Management', proofIdea: 'Detailed bill of quantities (BOQ) and Bar Bending Schedule for a retaining wall' }
];

export const SEED_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'chem-01',
    companyId: 'reliance-industries',
    companyName: 'Reliance Industries Limited',
    branch: 'Chemical Engineering',
    skill: 'Fluid Mechanics & Pumps',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    question: 'A centrifugal pump in a refinery is vibrating severely and making a crackling noise resembling gravel being pumped. What is happening, and how would you verify and troubleshoot this on-site?',
    contextOrScenario: 'You are on shift as a GET in the crude distillation unit preheat section. The booster pump feeding the atmospheric column has an increase in discharge pressure fluctuations and casing vibration.',
    idealAnswerPoints: [
      'Identify cavitation as the primary root cause due to pressure at the impeller eye dropping below liquid vapor pressure.',
      'Check Net Positive Suction Head (NPSH) available vs NPSH required.',
      'Investigate suction line restrictions: clogged suction strainer, partially closed suction valve, low liquid level in upstream vessel.',
      'Check fluid temperature: if fluid is hotter than design, vapor pressure rises and reduces NPSH available.',
      'Immediate action: Throttling discharge valve slightly to reduce flow rate (moves operation back to lower NPSH_r on pump curve), never throttle suction valve.'
    ],
    commonMistakes: [
      'Suggesting to throttle the suction valve (which worsens cavitation).',
      'Confusing cavitation with mechanical unbalance without mentioning vapor pressure and NPSH.',
      'Not explaining how to confirm it using pressure gauges on suction/discharge.'
    ],
    starGuide: {
      situation: 'In our chemical operations lab, a solvent transfer pump began rattling heavily during a high-temperature run.',
      task: 'I had to identify whether it was cavitation or bearing failure before mechanical damage occurred.',
      action: 'I monitored suction pressure and vapor pressure at operating temperature, calculated NPSH_a, found the suction strainer 60% clogged, and throttled the discharge valve.',
      result: 'The pump noise stopped immediately, and after cleaning the strainer, flow was restored to design 45 m3/hr without vibration.',
      learning: 'Always protect pump suction: NPSH margins must be maintained especially when process temperatures fluctuate.'
    }
  },
  {
    id: 'chem-02',
    companyId: 'reliance-industries',
    companyName: 'Reliance Industries Limited',
    branch: 'Chemical Engineering',
    skill: 'Mass Transfer & Distillation',
    category: 'Technical',
    difficulty: 'Advanced',
    question: 'Explain what happens to a distillation column when you increase the reflux ratio while keeping feed and reboiler duty constant. What are the operational limits?',
    idealAnswerPoints: [
      'Purity of top and bottom products initially increases due to better vapor-liquid contact.',
      'Liquid traffic down the column increases, which increases tray liquid holdup and pressure drop across trays.',
      'Operational limit 1: Flooding/weeping - high liquid load causes liquid to back up in downcomers leading to downcomer flooding.',
      'Operational limit 2: Reboiler duty limitation - without increasing boilup, internal vapor rate remains flat while liquid rate increases, potentially pinching stages.',
      'Extreme limit: Total reflux (infinite reflux ratio) represents minimum number of theoretical stages, but zero product take-off.'
    ],
    commonMistakes: [
      'Saying higher reflux always yields higher production rate (it reduces distillate withdrawal rate for fixed feed).',
      'Failing to mention hydraulic constraints like downcomer backup and weeping.'
    ]
  },
  {
    id: 'mech-01',
    companyId: 'tata-motors',
    companyName: 'Tata Motors',
    branch: 'Mechanical Engineering',
    skill: 'Machine Design & Failure Theories',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    question: 'Why do we use the Maximum Distortion Energy Theory (von Mises) for ductile automotive components instead of Maximum Principal Stress Theory (Rankine)?',
    idealAnswerPoints: [
      'Ductile materials yield by shear slip along crystal planes, not by cleavage tensile separation.',
      'Hydrostatic (triaxial uniform) stress causes volume change without plastic distortion; distortion energy isolates the deviatoric stress responsible for yielding.',
      'Rankine theory fails under pure shear (predicts yield strength equal to tensile yield, whereas actual shear yield is ~0.577 of tensile yield).',
      'Von Mises closely matches experimental yield envelopes for ductile steels and aluminums.'
    ],
    commonMistakes: [
      'Saying Rankine is for brittle materials without explaining the physical yielding mechanism of ductile materials under shear.',
      'Unable to state the 0.577 yield ratio in pure torsion.'
    ]
  },
  {
    id: 'mech-02',
    companyId: 'caterpillar',
    companyName: 'Caterpillar Inc.',
    branch: 'Mechanical Engineering',
    skill: 'GD&T (ASME Y14.5)',
    category: 'Technical',
    difficulty: 'Intermediate',
    question: 'What is the advantage of specifying Maximum Material Condition (MMC) with a True Position tolerance on a bolt hole circle?',
    idealAnswerPoints: [
      'MMC allows "bonus tolerance": as the hole is manufactured larger than its minimum size limit, the allowable positional tolerance increases.',
      'Ensures guaranteed assembly fit with the mating fastener pin while avoiding scrapping usable parts.',
      'Enables the use of fast, cost-effective hard "go" functional pin gauges instead of expensive CMM measuring for 100% inspection.',
      'Lowers manufacturing and inspection costs without compromising functional clearance.'
    ],
    commonMistakes: [
      'Thinking MMC makes tolerances tighter or harder to manufacture.',
      'Not explaining what bonus tolerance is or how it is calculated.'
    ]
  },
  {
    id: 'elec-01',
    companyId: 'siemens',
    companyName: 'Siemens',
    branch: 'Electrical Engineering',
    skill: 'Switchgear & Relay Protection',
    category: 'Core Engineering',
    difficulty: 'Advanced',
    question: 'Explain why percentage biased differential protection is required for power transformers instead of simple overcurrent protection.',
    idealAnswerPoints: [
      'Differential protection (Kirchhoff’s Current Law) provides instantaneous, selective tripping strictly for internal transformer faults.',
      'CT saturation during heavy through-faults (external faults) causes fictitious mismatch currents that would falsely trip simple differential relays.',
      'Restraining (bias) coils introduce a threshold that scales with through-fault current, preventing false tripping.',
      'Transformer magnetizing inrush current contains high 2nd harmonics; modern numerical relays use 2nd harmonic blocking to prevent tripping during energization.',
      'Accounts for CT ratio mismatches and on-load tap changer (OLTC) voltage variations.'
    ],
    commonMistakes: [
      'Not mentioning transformer inrush currents and harmonic restraint.',
      'Omitting the effect of CT saturation during external through-faults.'
    ]
  },
  {
    id: 'ece-01',
    companyId: 'texas-instruments',
    companyName: 'Texas Instruments',
    branch: 'Electronics & Communication Engineering',
    skill: 'Analog Circuit Design & Op-Amps',
    category: 'Technical',
    difficulty: 'Advanced',
    question: 'What is Phase Margin in an operational amplifier circuit? Why is a 45° or 60° phase margin desired, and how do you compensate an unstable op-amp driving a capacitive load?',
    idealAnswerPoints: [
      'Phase Margin (PM) is 180° minus the phase lag at unity gain frequency (where open loop gain = 0 dB).',
      'A PM of <45° causes underdamped ringing and overshoot in transient step response; 60° gives critically damped/optimal Butterworth response with fast settling.',
      'Capacitive loads introduce an extra pole with op-amp output resistance, degrading phase margin towards 0° (oscillation).',
      'Compensation techniques: Series isolation resistor (R_iso) outside the loop with feedback capacitor (in-loop compensation), or dominant pole compensation.'
    ],
    commonMistakes: [
      'Confusing Phase Margin with Gain Margin.',
      'Failing to explain how capacitive loads create a secondary pole.'
    ]
  },
  {
    id: 'cse-01',
    companyId: 'google',
    companyName: 'Google',
    branch: 'Computer Science Engineering',
    skill: 'System Design & Scalability',
    category: 'Technical',
    difficulty: 'Advanced',
    question: 'How would you design a distributed rate limiter for an API receiving 500,000 requests per second across 5 worldwide data centers?',
    idealAnswerPoints: [
      'Algorithms: Token Bucket or Sliding Window Log/Counter (sliding window prevents burst at window boundaries).',
      'Storage: In-memory distributed cache (e.g. Redis cluster) with atomic Lua scripts or Redis cell.',
      'Cross-datacenter latency: Local rate limiting with asynchronous batch syncing, or hash-partitioning user IDs to regional leader nodes.',
      'Fault tolerance: If cache fails, rate limiter should "fail open" to avoid blocking valid user traffic, with fallback to local memory counters.',
      'Security: Rate limit by combination of User ID, IP address, and API key with headers (X-RateLimit-Remaining, Retry-After).'
    ],
    commonMistakes: [
      'Suggesting a single centralized database or synchronous cross-region calls (causes 200ms latency on every API request).',
      'Ignoring race conditions between concurrent requests.'
    ]
  },
  {
    id: 'gen-behavioral-01',
    category: 'Behavioral',
    skill: 'Communication',
    difficulty: 'Intermediate',
    question: 'Tell me about a time in an engineering project when your initial approach completely failed. How did you diagnose the failure and what did you learn?',
    idealAnswerPoints: [
      'Situation: Specific project, goal, and initial technical choice.',
      'Task: What failed (physical burn out, simulation divergence, algorithm timing out).',
      'Action: Structured root cause diagnosis (not trial-and-error), consultation with data/literature, and redesign.',
      'Result: Successful resolution, quantifiable test results or efficiency achieved.',
      'Learning: Engineering takeaway applied to subsequent work.'
    ],
    commonMistakes: [
      'Choosing an insignificant mistake (e.g. "I forgot to save the file").',
      'Blaming teammates or equipment without taking personal engineering ownership.',
      'Skipping the quantifiable outcome or the systematic diagnosis.'
    ]
  }
];

export const SEED_DAILY_FEED: DailyFeedCard[] = [
  {
    id: 'feed-1',
    type: 'concept',
    title: 'NPSH in 90 Seconds',
    tag: 'Fluid Mechanics',
    readTime: '2 min',
    content: 'NPSH_a = P_suction + V^2/2g - P_vapor - h_friction. If NPSH_a < NPSH_r, vapor bubbles implode against impeller blades at 10,000 atm localized pressure, pitting metal in hours. In plant design, elevate upstream vessels or sub-cool the liquid to protect pumps.'
  },
  {
    id: 'feed-2',
    type: 'interview_question',
    title: 'Reliance Interview Trap: Total Reflux',
    tag: 'Distillation',
    readTime: '2 min',
    content: 'Interviewer: "If total reflux gives the purest separation with minimum stages, why don\'t commercial plants run at total reflux?" Answer: Distillate withdrawal is zero! You get perfect separation of nothing. Commercial columns run at 1.1x to 1.3x minimum reflux to balance capital cost (number of trays) and operating cost (reboiler steam).'
  },
  {
    id: 'feed-3',
    type: 'project_challenge',
    title: 'Proof Challenge: The Heat Exchanger Audit',
    tag: 'Proof Lab',
    readTime: '3 min',
    content: 'Turn your textbook heat exchanger into an industry-grade proof: Download TEMA (Tubular Exchanger Manufacturers Association) standards summary. Calculate fouling factor impact on heat duty over a 6-month cycle. Add a graph to your portfolio.'
  },
  {
    id: 'feed-4',
    type: 'mistake_warning',
    title: 'Top Failure Pattern: Skipping Boundary Conditions',
    tag: 'Mistake Vault',
    readTime: '2 min',
    content: '82% of campus technical rejections occur when students jump directly into formulas without stating assumptions: steady state vs transient? Laminar vs turbulent? Ideal gas vs real gas? Always state your assumptions first!'
  }
];

export const SEED_ALUMNI: AlumniProfile[] = [
  {
    id: 'alumni-1',
    name: 'Priyanka Verma',
    company: 'Reliance Industries Limited',
    role: 'Operations & Process Lead',
    branch: 'Chemical Engineering',
    batchYear: 2024,
    topAdvice: 'Know your unit operations cold. They do not expect you to remember exact plant piping numbers, but they will test whether you know what happens to pressure and temperature when a valve closes.',
    keySkillFirst6Months: 'Reading P&IDs and understanding safety relief interlocks during plant startups.',
    whatSurprisedInInterview: 'They gave me a real incident report from a pump failure and asked me to walk through the 5-Whys on the spot.',
    linkedInUrl: 'https://linkedin.com'
  },
  {
    id: 'alumni-2',
    name: 'Rohit Kulkarni',
    company: 'Tata Motors',
    role: 'EV Powertrain Development Engineer',
    branch: 'Mechanical Engineering',
    batchYear: 2023,
    topAdvice: 'Do not just put SolidWorks or ANSYS on your resume without showing the boundary conditions and mesh convergence study. A CAD model is not proof; engineering design rationale is proof.',
    keySkillFirst6Months: 'GD&T tolerance stack-up analysis and thermal simulation validation on physical test rigs.',
    whatSurprisedInInterview: 'They held up an actual failed aluminum casting bracket and asked me to identify where it fractured and why.',
    linkedInUrl: 'https://linkedin.com'
  },
  {
    id: 'alumni-3',
    name: 'Ananya Sen',
    company: 'Siemens',
    role: 'Smart Grid Automation Engineer',
    branch: 'Electrical Engineering',
    batchYear: 2024,
    topAdvice: 'Be very comfortable reading single-line diagrams (SLD) and understanding how transformer vector groups (Dyn11) affect fault currents.',
    keySkillFirst6Months: 'Configuring protection relays and industrial Ethernet protocols (Profinet/Modbus).',
    whatSurprisedInInterview: 'They asked me to write ladder logic on paper for a failsafe three-motor sequencing conveyor with thermal overload trips.',
    linkedInUrl: 'https://linkedin.com'
  }
];

export const DEMO_USER_PROFILE: UserProfile = {
  id: 'alex-demo-student',
  name: 'Alex Student',
  email: 'alex.student@placero.edu',
  role: 'student',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  branch: 'Chemical Engineering',
  year: 4,
  semester: 7,
  cgpa: 8.42,
  targetGraduationYear: 2027,
  preferredRole: 'Graduate Engineer Trainee (Process / Operations)',
  targetIndustries: ['Petrochemicals & Refining', 'Specialty Chemicals', 'Energy Transition'],
  targetCompanies: ['Reliance Industries Limited', 'Larsen & Toubro (L&T)', 'Dow Chemical Company'],
  currentSkills: [
    { name: 'Material & Energy Balance', level: 82, category: 'Core Fundamentals' },
    { name: 'Thermodynamics & VLE', level: 85, category: 'Core Fundamentals' },
    { name: 'Fluid Mechanics & Pumps', level: 74, category: 'Unit Operations' },
    { name: 'Heat Transfer & Exchangers', level: 78, category: 'Unit Operations' },
    { name: 'Mass Transfer & Distillation', level: 70, category: 'Unit Operations' },
    { name: 'Process Safety & HAZOP', level: 48, category: 'Industrial Safety' },
    { name: 'Aspen Plus / Simulation', level: 62, category: 'Software & Tools' },
    { name: 'P&ID & PFD Interpretation', level: 68, category: 'Engineering Practice' }
  ],
  programmingLanguages: ['Python (NumPy, SciPy)', 'MATLAB'],
  softwareTools: ['Aspen Plus V12', 'AutoCAD P&ID', 'MS Excel Solver'],
  communicationConfidence: 6,
  interviewConfidence: 6,
  dailyStudyTimeMinutes: 45,
  placementTimelineDays: 38,
  streakDays: 7,
  xp: 1450,
  level: 4,
  badges: [
    { id: 'b1', name: '7-Day Streak', description: 'Prepared consistently for 7 consecutive days', icon: '🔥', unlockedAt: '2026-09-24', category: 'streak' },
    { id: 'b2', name: 'Proof Builder', description: 'Documented first verified engineering proof project', icon: '🛠️', unlockedAt: '2026-09-21', category: 'proof' },
    { id: 'b3', name: 'Core Engineer', description: 'Scored >80% on core engineering calculations assessment', icon: '🏭', unlockedAt: '2026-09-23', category: 'core' }
  ],
  isDemoUser: true
};
