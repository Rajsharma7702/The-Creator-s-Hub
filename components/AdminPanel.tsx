import React from 'react';
import { Submission } from '../types';
import { FileText, Calendar, User, Tag } from 'lucide-react';

interface AdminPanelProps {
  submissions: Submission[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ submissions }) => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>
        
        {submissions.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">No submissions yet.</p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Creator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-brand-accent/20 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-brand-accent" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{sub.name}</div>
                            <div className="text-sm text-slate-400">{sub.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-200 border border-blue-700">
                          {sub.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300 max-w-xs truncate">{sub.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {sub.fileName ? (
                           <span className="flex items-center gap-1 text-brand-accent">
                             <FileText className="h-4 w-4" />
                             {sub.fileName}
                           </span>
                        ) : 'No file'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {sub.timestamp.toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
