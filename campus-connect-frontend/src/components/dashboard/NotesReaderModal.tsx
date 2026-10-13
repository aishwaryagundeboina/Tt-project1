import React, { useState } from 'react';
import { Resource, ResourceUnit, getFallbackUnits } from '../../services/resourceService';
import { X, BookOpen, Copy, Check, Printer, ChevronRight, ChevronLeft, GraduationCap } from 'lucide-react';

interface Props {
  resource: Resource | null;
  onClose: () => void;
}

const NotesReaderModal: React.FC<Props> = ({ resource, onClose }) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  // Resolve units: if resource.units is missing or has the single generic fallback, use getFallbackUnits
  const units: ResourceUnit[] = (resource.units && resource.units.length > 1)
    ? resource.units
    : getFallbackUnits(resource);

  const currentUnit = units[selectedUnitIndex] || units[0];

  const handleCopy = () => {
    const textToCopy = `${resource.title}\nSubject: ${resource.subject}\n\n${currentUnit.unitTitle}\n\n${currentUnit.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 via-white to-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {resource.subject}
                </span>
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                  Instructor: {resource.uploaderName}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">{resource.title}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 border border-gray-200"
              title="Copy current unit notes"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Notes'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 border border-gray-200"
              title="Print / Save as PDF"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              title="Close viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Units Navigation Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/70 p-3 overflow-y-auto">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-emerald-600" /> Syllabus Modules
              </span>
              <span className="text-xs text-gray-400 font-semibold">{units.length} Units</span>
            </div>
            
            <div className="space-y-1.5 mt-1">
              {units.map((unit, index) => {
                const isSelected = selectedUnitIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedUnitIndex(index)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-all flex flex-col border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-emerald-50/60 text-gray-800 border-gray-200/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold">{unit.unitTitle.split(':')[0]}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        Part {index + 1}
                      </span>
                    </div>
                    <span className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-gray-600 font-normal'}`}>
                      {unit.unitTitle.split(':').slice(1).join(':') || unit.unitTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading Area */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white flex flex-col justify-between">
            <div className="max-w-3xl mx-auto w-full space-y-6">
              {/* Unit Header Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50/40 p-6 rounded-2xl border border-emerald-100/80">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Unit {selectedUnitIndex + 1} of {units.length}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wide">
                    Comprehensive Lecture Material
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{currentUnit.unitTitle}</h3>
                
                {currentUnit.topics && currentUnit.topics.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-2">Key Topics Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentUnit.topics.map((topic, i) => (
                        <span key={i} className="bg-white text-emerald-900 border border-emerald-200/80 text-xs px-3 py-1 rounded-lg font-semibold shadow-2xs">
                          ✓ {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Formatted Notes Body */}
              <div className="bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100 font-sans text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
                {currentUnit.content}
              </div>

              {/* Bottom Pagination Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  disabled={selectedUnitIndex === 0}
                  onClick={() => setSelectedUnitIndex(prev => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Unit
                </button>

                <span className="text-xs font-medium text-gray-400">
                  Unit {selectedUnitIndex + 1} of {units.length}
                </span>

                <button
                  disabled={selectedUnitIndex >= units.length - 1}
                  onClick={() => setSelectedUnitIndex(prev => Math.min(units.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
                >
                  Next Unit <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Campus Connect Academic Library & Study Center</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesReaderModal;
