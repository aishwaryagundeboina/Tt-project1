import React, { useEffect, useState } from 'react';
import { getAllResources, Resource } from '../../services/resourceService';
import ResourceCard from '../../components/dashboard/ResourceCard';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();

    window.addEventListener('resourcesUpdated', fetchResources);
    return () => {
      window.removeEventListener('resourcesUpdated', fetchResources);
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading academic resources...</div>;
  }

  const displayedResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b pb-4 gap-4">
           <div>
             <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Academic Resources</h1>
             <p className="text-gray-500">Access study materials, lecture notes, and assignments shared by faculty.</p>
           </div>
           
           <div className="w-full md:w-72">
             <input
               type="text"
               placeholder="Search resources or courses..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
        </div>
        
        {displayedResources.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center text-gray-500 border border-gray-100 shadow-sm">
              {searchTerm ? 'No resources found matching your search.' : 'No academic resources available yet.'}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
