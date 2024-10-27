import React, { useState, useEffect } from 'react';
import { airtableService, SearchTemplate, Lead } from '../services/airtable';
import SearchTemplateCard from '../components/SearchTemplateCard';
import CommandPalette from '../components/CommandPalette';
import LeadsTable from '../components/LeadsTable';

const LeadsSearcher = () => {
  const [keywords, setKeywords] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<SearchTemplate[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [tags, setTags] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
          const [userTemplates, userLeads] = await Promise.all([
            airtableService.getSearchTemplates(user.id),
            airtableService.getLeads(user.id)
          ]);
          setTemplates(userTemplates);
          setLeads(userLeads);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        throw new Error('User not found');
      }

      const allKeywords = [
        ...tags.map(tag => tag.text),
        ...(keywords.trim() ? [keywords.trim()] : [])
      ].join(', ');

      const searchData = {
        keywords: allKeywords,
        subreddit,
        businessDescription
      };

      await airtableService.createSearchTemplate({
        userId: [user.id],
        criteria: searchData
      });

      await airtableService.triggerMakeWebhook(searchData);

      const userTemplates = await airtableService.getSearchTemplates(user.id);
      setTemplates(userTemplates);

      setTags([]);
      setKeywords('');
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: SearchTemplate) => {
    setActiveTemplate(template.id || null);
    if (template.keywords) {
      const keywordArray = template.keywords.split(', ').map(k => k.trim());
      if (keywordArray.length > 0) {
        const newTags = keywordArray.map(keyword => ({
          id: Date.now() + Math.random().toString(),
          text: keyword
        }));
        setTags(newTags);
        setKeywords('');
      }
    }
    setSubreddit(template.subreddit || '');
    setBusinessDescription(template.bizDescription || '');
  };

  const handleLeadAction = async (leadId: string, status: string) => {
    try {
      await airtableService.updateLeadStatus(leadId, status);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const updatedLeads = await airtableService.getLeads(user.id);
        setLeads(updatedLeads);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Leads Searcher</h1>

      {templates.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-3">Recent Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <SearchTemplateCard
                key={template.id}
                template={template}
                isActive={activeTemplate === template.id}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        </div>
      )}

      <CommandPalette
        keywords={keywords}
        setKeywords={setKeywords}
        tags={tags}
        setTags={setTags}
        subreddit={subreddit}
        setSubreddit={setSubreddit}
        businessDescription={businessDescription}
        setBusinessDescription={setBusinessDescription}
        onSubmit={handleSearch}
        loading={loading}
      />

      {leads.length > 0 && (
        <LeadsTable
          leads={leads}
          onLeadAction={handleLeadAction}
        />
      )}
    </div>
  );
};

export default LeadsSearcher;