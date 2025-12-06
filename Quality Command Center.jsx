import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, Legend, ReferenceLine
} from 'recharts';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Activity, Map, 
  MessageSquare, Send, ChevronRight, Database, Zap, CheckCircle,
  XCircle, Lock, DollarSign, Package, Thermometer, Wrench, 
  AlertCircle, BarChart3, Brain, User, Bot, ArrowRight,
  MapPin, Clock, RefreshCw, ChevronDown, Beaker, Factory,
  X, Sparkles, ChevronLeft
} from 'lucide-react';

// =====================================================
// LOVELYTICS DESIGN SYSTEM COLORS (Light Theme)
// =====================================================
const colors = {
  primary: {
    teal: '#1CB192',
    tealDark: '#138268',
    orange: '#FF8300',
    orangeDark: '#D96F00',
    blue: '#0075FF',
    navy: '#11377C',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    card: '#FFFFFF',
    hover: '#F9FAFB',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },
  border: '#E5E7EB',
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
};

// =====================================================
// MOCK DATA FROM PROJECT OUROBOROS
// =====================================================
const copqData = {
  currentRisk: 142000,
  complaints: 847,
  projectedRecall: 85000,
  brandErosion: 0.15,
};

const sentimentTrendData = [
  { date: 'Nov 1', sentiment: 94, complaints: 12, batch: null },
  { date: 'Nov 5', sentiment: 93, complaints: 15, batch: null },
  { date: 'Nov 10', sentiment: 91, complaints: 22, batch: null },
  { date: 'Nov 15', sentiment: 88, complaints: 35, batch: '#990' },
  { date: 'Nov 18', sentiment: 72, complaints: 89, batch: '#992' },
  { date: 'Nov 22', sentiment: 65, complaints: 142, batch: '#992' },
  { date: 'Nov 25', sentiment: 58, complaints: 198, batch: '#992' },
  { date: 'Nov 28', sentiment: 61, complaints: 167, batch: '#992' },
  { date: 'Dec 1', sentiment: 63, complaints: 145, batch: '#992' },
];

const geoRiskZones = [
  { city: 'Phoenix, AZ', risk: 'Critical', complaints: 234, type: 'Thermal Abuse', zipPrefix: '850xx' },
  { city: 'Las Vegas, NV', risk: 'High', complaints: 156, type: 'Cold Chain', zipPrefix: '891xx' },
  { city: 'Tucson, AZ', risk: 'Medium', complaints: 89, type: 'Thermal', zipPrefix: '857xx' },
  { city: 'Denver, CO', risk: 'Low', complaints: 23, type: 'Normal', zipPrefix: '802xx' },
  { city: 'Seattle, WA', risk: 'Low', complaints: 12, type: 'Control', zipPrefix: '981xx' },
];

const activeAlerts = [
  { id: 1, type: 'critical', title: 'Isovaleric Spike in Batch #992', description: '400% increase in "Cheesy" complaints for West Coast IPA', time: '2h ago', batch: '#992', rootCause: 'Hop Lot #8821' },
  { id: 2, type: 'high', title: 'Thermal Excursion Route 66', description: 'Phoenix distribution - cargo temp reached 38°C', time: '4h ago', batch: '#985', rootCause: 'Carrier A' },
  { id: 3, type: 'medium', title: 'Pressure Drift Line 4', description: 'Filler bowl pressure dropped to 12 PSI', time: '6h ago', batch: '#994', rootCause: 'Seamer Head #3' },
];

const hopStorageData = [
  { lot: '#8815', hsi: 0.28, alpha: 12.4, status: 'Good', supplier: 'Yakima Farms' },
  { lot: '#8818', hsi: 0.31, alpha: 11.9, status: 'Good', supplier: 'Yakima Farms' },
  { lot: '#8821', hsi: 0.67, alpha: 8.2, status: 'Degraded', supplier: 'Pacific Hops Co.' },
  { lot: '#8824', hsi: 0.29, alpha: 13.1, status: 'Good', supplier: 'Cascade Valley' },
  { lot: '#9901', hsi: 0.25, alpha: 14.2, status: 'Good', supplier: 'Oregon Hop Growers' },
];

const linePressureData = [
  { time: '08:00', badBatch: 16.2, goldenBatch: 16.5 },
  { time: '08:15', badBatch: 16.0, goldenBatch: 16.4 },
  { time: '08:30', badBatch: 15.8, goldenBatch: 16.5 },
  { time: '08:45', badBatch: 14.9, goldenBatch: 16.3 },
  { time: '09:00', badBatch: 13.2, goldenBatch: 16.5 },
  { time: '09:15', badBatch: 12.1, goldenBatch: 16.4 },
  { time: '09:30', badBatch: 11.8, goldenBatch: 16.5 },
  { time: '09:45', badBatch: 13.4, goldenBatch: 16.3 },
  { time: '10:00', badBatch: 14.8, goldenBatch: 16.5 },
  { time: '10:15', badBatch: 15.2, goldenBatch: 16.4 },
];

// =====================================================
// CUSTOM COMPONENTS
// =====================================================

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-600';
  const Icon = type === 'success' ? CheckCircle : type === 'warning' ? AlertTriangle : Zap;

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-70 text-xl leading-none">×</button>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ label, value, change, trend, icon: Icon, color = 'teal', danger = false }) => {
  const isPositive = trend === 'up';
  const borderColor = danger ? 'border-red-200' : 'border-gray-200';
  const bgColor = danger ? 'bg-red-50' : 'bg-white';
  
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        {Icon && <Icon className={danger ? 'text-red-500' : 'text-teal-600'} size={20} />}
      </div>
      <div className={`text-2xl font-bold mb-2 ${danger ? 'text-red-600' : 'text-gray-900'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
        {value}
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};

// Alert Item Component
const AlertItem = ({ alert, onClick }) => {
  const severityColors = {
    critical: 'border-l-red-500 bg-red-50',
    high: 'border-l-orange-500 bg-orange-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-blue-500 bg-blue-50',
  };

  const iconColors = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-600',
    low: 'text-blue-500',
  };

  return (
    <div 
      onClick={onClick}
      className={`border-l-4 ${severityColors[alert.type]} rounded-r-lg p-4 cursor-pointer hover:shadow-md transition-all group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={iconColors[alert.type]} size={16} />
            <span className="font-semibold text-gray-900 text-sm">{alert.title}</span>
          </div>
          <p className="text-gray-600 text-xs mb-2">{alert.description}</p>
          <span className="text-gray-400 text-xs">{alert.time}</span>
        </div>
        <ChevronRight className="text-gray-400 group-hover:text-teal-600 transition-colors" size={20} />
      </div>
    </div>
  );
};

// Risk Zone Card Component  
const RiskZoneCard = ({ zone }) => {
  const riskColors = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-emerald-500',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
      <div className="flex items-center gap-3">
        <MapPin className="text-gray-400" size={18} />
        <div>
          <span className="text-gray-900 font-medium text-sm">{zone.city}</span>
          <p className="text-gray-500 text-xs">{zone.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-sm">{zone.complaints} complaints</span>
        <span className={`${riskColors[zone.risk]} px-2 py-0.5 rounded text-xs font-medium text-white`}>
          {zone.risk}
        </span>
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isUser, isTyping }) => {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} mb-4`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-teal-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
        {isUser ? <User size={16} className="text-white" /> : <Sparkles size={16} className="text-white" />}
      </div>
      <div className={`max-w-[85%] ${isUser ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-3 ${isUser ? 'rounded-tr-md' : 'rounded-tl-md'}`}>
        {isTyping ? (
          <div className="flex gap-1 py-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
};

// Suggestion Chip Component
const SuggestionChip = ({ text, onClick, icon: Icon }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-gray-200 hover:border-teal-400 text-gray-700 hover:text-teal-700 px-4 py-2 rounded-full text-sm transition-all shadow-sm"
  >
    {Icon && <Icon size={14} className="text-teal-600" />}
    {text}
  </button>
);

// SQL Result Component
const SQLResult = ({ query, results }) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 my-4">
    <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
      <Database size={14} className="text-teal-400" />
      <span className="text-gray-400 text-xs font-mono">SQL Query Executed</span>
    </div>
    <pre className="p-4 text-xs text-teal-300 font-mono overflow-x-auto">
      {query}
    </pre>
    {results && (
      <div className="border-t border-gray-700">
        <div className="bg-gray-800/50 px-4 py-2">
          <span className="text-gray-400 text-xs">Results ({results.length} rows)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-800">
              <tr>
                {Object.keys(results[0]).map(key => (
                  <th key={key} className="px-4 py-2 text-left text-gray-400 font-medium">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i} className="border-t border-gray-700/50 hover:bg-gray-800/30">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className={`px-4 py-2 ${typeof val === 'number' && val > 0.5 ? 'text-red-400' : 'text-gray-300'}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

// =====================================================
// AI PANEL COMPONENT
// =====================================================
const AIPanel = ({ isOpen, onClose, selectedAlert, onNavigateToEngineer }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatState, setChatState] = useState('initial');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = () => {
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages([{
        id: 1,
        isUser: false,
        message: "I've detected a 400% spike in 'Cheesy' complaints for West Coast IPA Batch #992. This flavor profile (Isovaleric Acid) typically indicates hop degradation from improper storage conditions. I've already cross-referenced the batch genealogy and identified potential root causes. How would you like to proceed with the investigation?"
      }]);
      setChatState('initial');
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === 'genealogy') {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        isUser: true,
        message: "Check raw material genealogy"
      }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          isUser: false,
          message: "Executing genealogy trace for Batch #992...",
          showSQL: true,
          sqlQuery: `SELECT 
  m.vendor_lot_number,
  s.supplier_name,
  COUNT(c.complaint_id) AS complaints,
  AVG(l.lab_result_hsi) AS hop_storage_index
FROM gold_complaints c
JOIN fact_production_batch p 
  ON c.batch_code = p.batch_id
JOIN fact_material_consumption m 
  ON p.batch_id = m.finished_good_batch_id
WHERE c.flavor_tag = 'Isovaleric' 
  AND p.batch_id = 992
GROUP BY m.vendor_lot_number, s.supplier_name;`,
          sqlResults: [
            { vendor_lot: '#8821', supplier: 'Pacific Hops Co.', complaints: 342, hsi: 0.67 },
            { vendor_lot: '#9901', supplier: 'Oregon Hop Growers', complaints: 8, hsi: 0.25 },
          ]
        }]);
        setIsTyping(false);
        
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              id: prev.length + 1,
              isUser: false,
              message: "FINDING: Hop Lot #8821 from Pacific Hops Co. is the common denominator. The Hop Storage Index (HSI) of 0.67 is significantly above the acceptable threshold of 0.35, indicating severe oxidation. This lot was also used in Pale Ale Batch #400, which shows similar complaint patterns."
            }]);
            setChatState('genealogy_complete');
            setIsTyping(false);
          }, 1500);
        }, 500);
      }, 1200);
      
    } else if (suggestion === 'compare') {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        isUser: true,
        message: "Compare with control batches"
      }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          isUser: false,
          message: "Comparing affected batch performance against control batches from the same production period:",
          showChart: true,
          chartType: 'comparison'
        }]);
        setIsTyping(false);
        
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              id: prev.length + 1,
              isUser: false,
              message: "ANALYSIS: Control batches #988 and #990 (using Lot #9901) show baseline complaint rates of 2-3%. Batch #992 (using Lot #8821) shows a 12.4% complaint rate - a 400% deviation. The correlation coefficient between HSI values and complaint rates is 0.94."
            }]);
            setChatState('comparison_complete');
            setIsTyping(false);
          }, 1500);
        }, 500);
      }, 1200);
      
    } else if (suggestion === 'root_cause') {
      onClose();
      onNavigateToEngineer();
    }
  };

  const resetChat = () => {
    setChatMessages([]);
    setChatState('initial');
    setTimeout(initializeChat, 100);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-white font-bold" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Genie AI
                </h2>
                <p className="text-white/70 text-xs">Quality Investigation Agent</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={resetChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Reset conversation"
              >
                <RefreshCw size={18} className="text-white/70" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-5 h-[calc(100%-180px)]">
          {chatMessages.map((msg) => (
            <div key={msg.id}>
              <ChatMessage message={msg.message} isUser={msg.isUser} />
              {msg.showSQL && (
                <div className="ml-11">
                  <SQLResult query={msg.sqlQuery} results={msg.sqlResults} />
                </div>
              )}
              {msg.showChart && (
                <div className="ml-11 bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                  <h4 className="text-gray-900 text-sm font-medium mb-3">Batch Comparison: Complaint Rate by Hop Lot</h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={[
                      { batch: '#988', rate: 2.1 },
                      { batch: '#990', rate: 2.8 },
                      { batch: '#992', rate: 12.4 },
                      { batch: '#400', rate: 9.8 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="batch" stroke="#6B7280" fontSize={10} />
                      <YAxis stroke="#6B7280" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                      <Bar dataKey="rate" radius={[4, 4, 0, 0]} fill="#1CB192">
                        {[2.1, 2.8, 12.4, 9.8].map((rate, index) => (
                          <rect key={index} fill={rate > 5 ? '#EF4444' : '#1CB192'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && <ChatMessage isTyping={true} />}
        </div>

        {/* Suggestion Chips */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-5 py-4">
          <p className="text-gray-500 text-xs mb-3">Suggested follow-ups:</p>
          <div className="flex flex-wrap gap-2">
            {chatState === 'initial' && (
              <>
                <SuggestionChip 
                  text="Check raw material genealogy" 
                  onClick={() => handleSuggestionClick('genealogy')}
                  icon={Database}
                />
                <SuggestionChip 
                  text="Compare with control batches" 
                  onClick={() => handleSuggestionClick('compare')}
                  icon={BarChart3}
                />
              </>
            )}
            {(chatState === 'genealogy_complete' || chatState === 'comparison_complete') && (
              <>
                <SuggestionChip 
                  text="View HSI chart" 
                  onClick={() => handleSuggestionClick('hsi_chart')}
                  icon={Activity}
                />
                <SuggestionChip 
                  text="Proceed to Root Cause" 
                  onClick={() => handleSuggestionClick('root_cause')}
                  icon={Wrench}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// =====================================================
// MAIN APPLICATION COMPONENT
// =====================================================
export default function QualityCommandCenter() {
  const [activeView, setActiveView] = useState('executive');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [rootCauseConfirmed, setRootCauseConfirmed] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setIsAIPanelOpen(true);
  };

  const handleAction = (action) => {
    if (action === 'chargeback') {
      setToast({ message: 'Supplier claim generated for Pacific Hops Co. - Lot #8821 ($47,250)', type: 'success' });
    } else if (action === 'quarantine') {
      setToast({ message: 'Batch #992 quarantined in WMS - 847 pallets locked', type: 'warning' });
    } else if (action === 'maintenance') {
      setToast({ message: 'Work order #WO-4421 created for Line 4 Seamer Head #3', type: 'info' });
    }
  };

  const renderSidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Area */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Beaker className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-lg" style={{ fontFamily: 'Jost, sans-serif' }}>Quality</h1>
            <p className="text-teal-600 text-xs font-medium">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveView('executive')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeView === 'executive' 
              ? 'bg-teal-50 text-teal-700 border border-teal-200' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Activity size={18} />
          <span className="font-medium">Executive Pulse</span>
        </button>
        
        <button
          onClick={() => setActiveView('engineer')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeView === 'engineer' 
              ? 'bg-teal-50 text-teal-700 border border-teal-200' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Wrench size={18} />
          <span className="font-medium">Engineer RCA</span>
        </button>
      </nav>

      {/* AI Assistant Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsAIPanelOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Sparkles size={18} />
          <span className="font-medium">Ask Genie AI</span>
        </button>
      </div>

      {/* Status Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-gray-500 text-xs">System Status</span>
          </div>
          <div className="text-gray-900 text-xs font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-gray-400 text-xs mt-1">All sensors online</div>
        </div>
      </div>
    </div>
  );

  // =====================================================
  // EXECUTIVE PULSE VIEW
  // =====================================================
  const renderExecutiveView = () => (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>
              Morning Brief
            </h2>
            <p className="text-gray-500 mt-1">Real-time quality intelligence • {currentTime.toLocaleDateString()}</p>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-all shadow-sm">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-2">AI Summary</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Overall sentiment is trending down (92% → 63%). A critical cluster of <span className="text-orange-600 font-medium">'Cheesy'</span> complaints 
                has emerged linked to <span className="text-teal-700 font-medium">Batch #992</span> (West Coast IPA). 
                Geospatial analysis shows <span className="text-red-600 font-medium">'Skunky'</span> complaints clustering in the Southwest region, 
                potentially indicating cold chain issues with Distributor Route 66.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">COPQ Risk</span>
              <DollarSign className="text-red-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-red-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              ${(copqData.currentRisk / 1000).toFixed(0)}k
            </div>
            <div className="flex items-center gap-1 text-sm text-red-500 mt-2">
              <TrendingUp size={14} />
              <span>+23% vs. last week</span>
            </div>
          </div>
          
          <KPICard 
            label="Active Complaints" 
            value={copqData.complaints.toLocaleString()}
            change="+342 (7d)"
            trend="down"
            icon={MessageSquare}
          />
          
          <KPICard 
            label="Sentiment Score" 
            value="63%"
            change="-29 pts"
            trend="down"
            icon={Activity}
          />
          
          <KPICard 
            label="First Pass Yield" 
            value="94.2%"
            change="+0.3%"
            trend="up"
            icon={CheckCircle}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sentiment Trend Chart */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-semibold">Sentiment Trend vs. Complaints</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded"></div>
                  <span className="text-gray-500">Sentiment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-500">Complaints</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                <YAxis yAxisId="left" stroke="#6B7280" fontSize={11} domain={[50, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  labelStyle={{ color: '#111827' }}
                />
                <ReferenceLine yAxisId="left" y={70} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Alert Threshold', fill: '#EF4444', fontSize: 10 }} />
                <Area yAxisId="left" type="monotone" dataKey="sentiment" stroke="#1CB192" fill="#1CB192" fillOpacity={0.15} strokeWidth={2} />
                <Bar yAxisId="right" dataKey="complaints" fill="#FF8300" opacity={0.8} radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle size={12} className="text-orange-500" />
              <span>Batch #992 introduced Nov 18 - correlates with sentiment drop</span>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-semibold">Active Alerts</h3>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">
                {activeAlerts.length} Active
              </span>
            </div>
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <AlertItem 
                  key={alert.id} 
                  alert={alert} 
                  onClick={() => handleAlertClick(alert)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Geospatial Risk Map */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-semibold">Geospatial Risk Map - "Hot Zones"</h3>
              <span className="text-gray-400 text-xs">Last 30 days</span>
            </div>
            {/* Stylized Map */}
            <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                {/* Simplified US Map outline */}
                <path 
                  d="M100,100 L700,100 L720,150 L700,200 L100,200 L80,150 Z" 
                  fill="#F9FAFB" 
                  stroke="#E5E7EB" 
                  strokeWidth="2"
                />
                {/* State divisions */}
                <path d="M300,100 L300,200" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M450,100 L450,200" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M580,100 L580,200" stroke="#E5E7EB" strokeWidth="1" />
                
                {/* Phoenix Hot Zone */}
                <circle cx="320" cy="170" r="35" fill="#EF4444" fillOpacity="0.2">
                  <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="320" cy="170" r="20" fill="#EF4444" fillOpacity="0.4"/>
                <circle cx="320" cy="170" r="8" fill="#EF4444"/>
                <text x="320" y="210" fill="#DC2626" fontSize="10" textAnchor="middle" fontWeight="600">Phoenix, AZ</text>
                
                {/* Las Vegas Hot Zone */}
                <circle cx="280" cy="130" r="25" fill="#F59E0B" fillOpacity="0.2">
                  <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="280" cy="130" r="12" fill="#F59E0B" fillOpacity="0.4"/>
                <circle cx="280" cy="130" r="5" fill="#F59E0B"/>
                <text x="280" y="110" fill="#D97706" fontSize="10" textAnchor="middle" fontWeight="600">Las Vegas, NV</text>
                
                {/* Tucson */}
                <circle cx="340" cy="185" r="15" fill="#FCD34D" fillOpacity="0.4"/>
                <circle cx="340" cy="185" r="5" fill="#F59E0B"/>
                
                {/* Seattle Control */}
                <circle cx="150" cy="110" r="10" fill="#10B981" fillOpacity="0.3"/>
                <circle cx="150" cy="110" r="4" fill="#10B981"/>
                <text x="150" y="95" fill="#059669" fontSize="10" textAnchor="middle" fontWeight="500">Seattle (Control)</text>
                
                {/* Denver */}
                <circle cx="380" cy="130" r="12" fill="#3B82F6" fillOpacity="0.3"/>
                <circle cx="380" cy="130" r="4" fill="#3B82F6"/>
                <text x="380" y="115" fill="#2563EB" fontSize="10" textAnchor="middle" fontWeight="500">Denver, CO</text>
                
                {/* Route 66 indicator */}
                <path d="M280,130 Q310,150 320,170" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" fill="none"/>
                <text x="350" y="145" fill="#EF4444" fontSize="9" fontStyle="italic">Route 66</text>
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg p-3 text-xs shadow-md border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Critical</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Zone List */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-semibold mb-4">Risk Zone Rankings</h3>
            <div className="space-y-2">
              {geoRiskZones.map((zone, i) => (
                <RiskZoneCard key={i} zone={zone} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =====================================================
  // ENGINEER ROOT CAUSE VIEW
  // =====================================================
  const renderEngineerView = () => (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Jost, sans-serif' }}>
              Root Cause Analysis
            </h2>
            <p className="text-gray-500 mt-1">Human-in-the-Loop validation and operational triggers</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            <AlertTriangle className="text-amber-600" size={18} />
            <span className="text-amber-700 text-sm font-medium">Pending Validation</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Digital Twin Overlay - Main Chart */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 font-semibold">Digital Twin Overlay: Line 4 Filler Bowl Pressure</h3>
                <p className="text-gray-500 text-xs mt-1">Bad Batch #992 vs. Golden Batch #975</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-500">Batch #992 (Bad)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded"></div>
                  <span className="text-gray-500">Batch #975 (Golden)</span>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={linePressureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={11} 
                  domain={[10, 18]}
                  label={{ value: 'PSI', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <ReferenceLine y={14} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Min Safe: 14 PSI', fill: '#EF4444', fontSize: 10 }} />
                <ReferenceLine y={18} stroke="#F59E0B" strokeDasharray="5 5" label={{ value: 'Target: 15-18 PSI', fill: '#F59E0B', fontSize: 10, position: 'top' }} />
                <Line type="monotone" dataKey="goldenBatch" stroke="#1CB192" strokeWidth={2} dot={false} name="Golden Batch" />
                <Line type="monotone" dataKey="badBatch" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 3 }} name="Bad Batch" />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Anomaly Highlight */}
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-red-700 font-semibold text-sm">Anomaly Detected: 09:15 - 09:45</h4>
                  <p className="text-gray-700 text-xs mt-1">
                    Filler bowl pressure dropped to <span className="text-red-600 font-medium">11.8 PSI</span> (minimum safe: 14 PSI). 
                    This 26% deviation from target caused CO₂ breakout, resulting in under-carbonated product. 
                    Duration: 30 minutes. Estimated affected cans: 4,200.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Model Feedback Panel */}
          <div className="space-y-4">
            {/* AI Prediction Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">AI Prediction</h3>
                  <p className="text-purple-600 text-xs font-medium">Confidence: 89%</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <p className="text-gray-900 text-sm">
                  <span className="text-purple-600 font-semibold">Root Cause:</span> Seamer Micro-Leak on Seaming Head #3
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  The pressure variance pattern correlates with known seamer chuck wear signatures. 
                  Seaming Head #3 last calibrated 47 days ago (SOP: 30 days).
                </p>
              </div>
              
              <p className="text-gray-600 text-xs mb-3">Is this prediction correct?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setRootCauseConfirmed(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    rootCauseConfirmed === true 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <CheckCircle size={16} />
                  Confirm
                </button>
                <button 
                  onClick={() => setRootCauseConfirmed(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    rootCauseConfirmed === false 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-200 hover:border-red-300'
                  }`}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
              
              {rootCauseConfirmed === true && (
                <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-emerald-700 text-xs">
                    ✓ Feedback recorded. Model accuracy improved by 0.3%.
                  </p>
                </div>
              )}
            </div>

            {/* Batch Genealogy Mini */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-3">Batch Genealogy</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={14} className="text-teal-600" />
                  <span className="font-medium">Batch #992 • West Coast IPA</span>
                </div>
                <div className="ml-4 pl-2 border-l-2 border-gray-200 space-y-1">
                  <div className="text-gray-700">Hop Lot: #8821 (Pacific Hops)</div>
                  <div className="text-gray-700">Malt Lot: #M-4420 (Briess)</div>
                  <div className="text-gray-700">Yeast: WLP001 (Gen 7)</div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <Factory size={14} className="text-orange-500" />
                  <span>Canning Line #4 • Nov 18</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Triggers */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-amber-500" size={18} />
            Operational Triggers
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Supplier Chargeback */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-orange-600" size={20} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-medium text-sm">Supplier Chargeback</h4>
                  <p className="text-gray-500 text-xs">Pacific Hops Co. • Lot #8821</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-3">
                Generate claim with evidence package: Genealogy + LIMS data + Consumer sentiment
              </p>
              <div className="text-gray-900 text-lg font-bold mb-3">$47,250</div>
              <button 
                onClick={() => handleAction('chargeback')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <DollarSign size={16} />
                Initiate Supplier Chargeback
              </button>
            </div>

            {/* WMS Lock */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="text-red-600" size={20} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-medium text-sm">Inventory Quarantine</h4>
                  <p className="text-gray-500 text-xs">Batch #992 • All Locations</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-3">
                Place quality hold on all remaining pallets in WMS to prevent further shipments
              </p>
              <div className="text-gray-900 text-lg font-bold mb-3">847 Pallets</div>
              <button 
                onClick={() => handleAction('quarantine')}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Lock size={16} />
                Lock Inventory in WMS
              </button>
            </div>

            {/* Maintenance Ticket */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="text-gray-900 font-medium text-sm">Dispatch Maintenance</h4>
                  <p className="text-gray-500 text-xs">Line 4 • Seamer Head #3</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-3">
                Create high-priority work order with sensor graphs attached
              </p>
              <div className="text-gray-900 text-lg font-bold mb-3">Priority: Critical</div>
              <button 
                onClick={() => handleAction('maintenance')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Wrench size={16} />
                Generate Work Order
              </button>
            </div>
          </div>
        </div>

        {/* LIMS Data Table */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">Hop Storage Index (HSI) - LIMS Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-500 font-medium py-3 px-4">Lot Number</th>
                  <th className="text-left text-gray-500 font-medium py-3 px-4">Supplier</th>
                  <th className="text-left text-gray-500 font-medium py-3 px-4">HSI Value</th>
                  <th className="text-left text-gray-500 font-medium py-3 px-4">Alpha Acid %</th>
                  <th className="text-left text-gray-500 font-medium py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {hopStorageData.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${row.lot === '#8821' ? 'bg-red-50' : ''}`}>
                    <td className={`py-3 px-4 font-mono ${row.lot === '#8821' ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      {row.lot}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{row.supplier}</td>
                    <td className={`py-3 px-4 font-mono ${row.hsi > 0.35 ? 'text-red-600 font-medium' : 'text-emerald-600'}`}>
                      {row.hsi.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{row.alpha}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.status === 'Degraded' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            * HSI threshold: 0.35 maximum. Values above indicate significant oxidation and hop degradation.
          </p>
        </div>
      </div>
    </div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <div className="flex h-screen bg-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Import Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
      
      {renderSidebar()}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'executive' && renderExecutiveView()}
        {activeView === 'engineer' && renderEngineerView()}
      </main>
      
      {/* AI Panel */}
      <AIPanel 
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        selectedAlert={selectedAlert}
        onNavigateToEngineer={() => setActiveView('engineer')}
      />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
