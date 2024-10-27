import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Search, Filter, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Lead } from '../services/airtable';

interface LeadsTableProps {
  leads: Lead[];
  onLeadAction: (leadId: string, status: string) => Promise<void>;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onLeadAction }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<number>(0);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [visibleLeadsCount, setVisibleLeadsCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleLeadsCount(prev => prev + 5);
  };

  const handleRowExpand = (leadId: string) => {
    setExpandedRow(expandedRow === leadId ? null : leadId);
  };

  const calculateScoreClass = (score: string) => {
    const numScore = parseInt(score, 10);
    if (numScore >= 80) return 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent';
    if (numScore >= 60) return 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent';
    return 'border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-transparent';
  };

  const getScoreBadgeColor = (score: string) => {
    const numScore = parseInt(score, 10);
    if (numScore >= 80) return 'bg-green-100 text-green-800';
    if (numScore >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refus':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'lead':
        return 'Approuvé';
      case 'pending':
        return 'Nouveau Lead';
      case 'refus':
        return 'Non approuvé';
      default:
        return status;
    }
  };

  const filterByScore = (lead: Lead) => {
    const score = parseInt(lead.qualification_score, 10);
    return score >= scoreFilter;
  };

  const filterByStatus = (lead: Lead) => {
    return selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);
  };

  const filteredLeads = leads
    .filter(lead => 
      lead.reddit_username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      filterByScore(lead) &&
      filterByStatus(lead)
    )
    .slice(0, visibleLeadsCount);

  const hasMoreLeads = leads.length > visibleLeadsCount;

  const handleLeadAction = async (leadId: string, status: string) => {
    try {
      setLoading(true);
      await onLeadAction(leadId, status);
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (status: string) => {
    if (selectedLeads.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(selectedLeads.map(leadId => onLeadAction(leadId, status)));
      setSelectedLeads([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleAllLeads = () => {
    setSelectedLeads(prev => 
      prev.length === filteredLeads.length 
        ? [] 
        : filteredLeads.map(lead => lead.id)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Found Leads</h3>
            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {filteredLeads.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads..."
                className="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors
                ${showFilters 
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Score
                  </label>
                  <div className="relative pt-6 pb-2">
                    <div className="relative h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(parseInt(e.target.value))}
                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                        style={{ top: '-2px' }}
                      />
                      <div 
                        className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-50"
                        style={{ width: `${scoreFilter}%` }}
                      />
                      <div
                        className="absolute w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 border-2 border-indigo-500 hover:scale-110 transition-transform"
                        style={{ left: `${scoreFilter}%`, top: '50%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                            {scoreFilter}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['lead', 'refus', 'pending'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatuses(prev => 
                          prev.includes(status) 
                            ? prev.filter(s => s !== status)
                            : [...prev, status]
                        )}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                          ${selectedStatuses.includes(status)
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {getStatusLabel(status)}
                        <span className="ml-1 text-xs">
                          ({leads.filter(l => l.status === status).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedLeads.length} leads selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('lead')}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve Selected
                </button>
                <button
                  onClick={() => handleBulkAction('refus')}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Reject Selected
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length}
                  onChange={toggleAllLeads}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Decision Maker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredLeads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.1 }
                    }}
                    className={`group cursor-pointer relative ${calculateScoreClass(lead.qualification_score)}
                      ${expandedRow === lead.id ? 'shadow-md rounded-t-lg' : 'hover:shadow-sm'}
                      transition-all duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleRowExpand(lead.id)}>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {lead.reddit_username}
                        </div>
                        <motion.div
                          animate={{ rotate: expandedRow === lead.id ? 180 : 0 }}
                          className="ml-2"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </motion.div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(lead.qualification_score)}`}
                      >
                        {lead.qualification_score}%
                        {parseInt(lead.qualification_score, 10) >= 80 && (
                          <span className="ml-1">✨</span>
                        )}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{lead.decision_maker_signals}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeadAction(lead.id, 'lead');
                          }}
                          disabled={loading}
                          className="text-green-600 hover:text-green-900"
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeadAction(lead.id, 'refus');
                          }}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                  {expandedRow === lead.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-b from-gray-50 to-white shadow-md rounded-b-lg"
                    >
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Lead Details</h4>
                            <dl className="mt-2 text-sm text-gray-500">
                              <div className="mt-1">
                                <dt className="inline font-medium">Account Created:</dt>
                                <dd className="inline ml-1">{lead.account_created}</dd>
                              </div>
                              <div className="mt-1">
                                <dt className="inline font-medium">Pain Points:</dt>
                                <dd className="inline ml-1">{lead.pain_points_mentioned}</dd>
                              </div>
                            </dl>
                          </div>
                          {parseInt(lead.qualification_score, 10) >= 80 && (
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                <h4 className="text-sm font-medium text-green-800">High Potential Lead</h4>
                              </div>
                              <p className="mt-2 text-sm text-green-600">
                                This lead shows strong signals of interest and decision-making authority.
                                Quick follow-up recommended.
                              </p>
                            </div>
                          )}
                          {parseInt(lead.qualification_score, 10) < 60 && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                                <h4 className="text-sm font-medium text-yellow-800">Additional Investigation Needed</h4>
                              </div>
                              <p className="mt-2 text-sm text-yellow-600">
                                Consider reviewing more context before proceeding.
                                Check for additional engagement signals.
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {hasMoreLeads && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLoadMore}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View More
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;