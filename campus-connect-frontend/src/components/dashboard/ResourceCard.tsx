import React, { useState } from 'react';
import { Resource } from '../../services/resourceService';
import NotesReaderModal from './NotesReaderModal';
import { FileText, BookOpen, User, ExternalLink } from 'lucide-react';

interface Props {
  resource: Resource;
}

const ResourceCard: React.FC<Props> = ({ resource }) => {
  const [isReading, setIsReading] = useState(false);

  const unitsCount = resource.units ? resource.units.length : 1;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">{resource.title}</h3>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600">
                {resource.category || 'DOCUMENT'}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
          
          <div className="space-y-2 mb-6 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
             <div className="flex items-center">
               <BookOpen className="h-4 w-4 mr-2 text-emerald-600" /> 
               <span className="font-semibold text-gray-800">{resource.subject}</span>
               <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                 {unitsCount} {unitsCount === 1 ? 'Unit' : 'Units'}
               </span>
             </div>
             <div className="flex items-center">
               <User className="h-4 w-4 mr-2 text-emerald-600" /> 
               <span>{resource.uploaderName}</span>
             </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Primary Action: Read Notes in in-app reader */}
          <button 
            type="button"
            onClick={() => setIsReading(true)}
            className="w-full flex items-center justify-center py-2.5 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Open & Read Notes
          </button>

          {/* Optional external file link */}
          {resource.fileUrl && resource.fileUrl !== '#' && !resource.fileUrl.includes('example.com') && (
            <a 
              href={resource.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Direct File Link
            </a>
          )}
        </div>
      </div>

      {/* Reader Modal */}
      {isReading && (
        <NotesReaderModal 
          resource={resource} 
          onClose={() => setIsReading(false)} 
        />
      )}
    </>
  );
};

export default ResourceCard;
