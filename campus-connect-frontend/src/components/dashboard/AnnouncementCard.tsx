import React from 'react';
import { Announcement } from '../../services/announcementService';
import { Megaphone, Calendar } from 'lucide-react';

interface Props {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<Props> = ({ announcement }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Megaphone className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">{announcement.category || 'General'}</span>
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1"/> {new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{announcement.description}</p>
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
         <span className="text-gray-500">Posted by <span className="font-semibold text-gray-700">{announcement.authorName}</span></span>
         {announcement.attachmentUrl && (
             <a href={announcement.attachmentUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">View Attachment</a>
         )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
