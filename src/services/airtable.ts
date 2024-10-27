import Airtable from 'airtable';
import bcrypt from 'bcryptjs';

const base = new Airtable({ apiKey: 'pathhJJyGPOdWQgil.11d0546200e18784015656018b431b874134dded335d6832b6614fb1bc482999' }).base('appJtp7m4YIMMUw4q');

export interface SearchCriteria {
  keywords: string;
  subreddit: string;
  businessDescription: string;
}

export interface SearchTemplate {
  id?: string;
  userId: string[];
  keywords?: string;
  subreddit?: string;
  bizDescription?: string;
  nb_leads?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  subscription_plan?: string;
  is_actif?: string;
  company_name?: string;
  activity?: string;
  description?: string;
  b2b2c?: string;
}

export interface Lead {
  id: string;
  reddit_username: string;
  qualification_score: string;
  status: string;
  lead_temperature: string;
  account_created: string;
  decision_maker_signals: string;
  pain_points_mentioned: string;
}

const handleAirtableError = (error: any, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  if (error.error === 'AUTHENTICATION_REQUIRED') {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  throw error;
};

export const airtableService = {
  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const records = await base('Users')
        .select({
          filterByFormula: `{email} = '${email}'`,
          maxRecords: 1
        })
        .firstPage();

      if (records.length === 0) return null;

      const user = records[0];
      const storedHash = user.get('password_hash');

      if (!storedHash || typeof storedHash !== 'string') return null;

      const isValid = await bcrypt.compare(password, storedHash);
      if (!isValid) return null;

      return {
        id: user.id,
        username: user.get('username') as string,
        email: user.get('email') as string,
        subscription_plan: user.get('subscription_plan') as string,
        is_actif: user.get('is_actif') as string,
        company_name: user.get('company_name') as string,
        activity: user.get('activity') as string,
        description: user.get('description') as string,
        b2b2c: user.get('b2b2c') as string
      };
    } catch (error) {
      handleAirtableError(error, 'login');
      return null;
    }
  },

  async registerUser(userData: Partial<User>): Promise<User> {
    try {
      if (!userData.password) {
        throw new Error('Password is required');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const records = await base('Users').create([
        {
          fields: {
            username: userData.username,
            email: userData.email,
            password_hash: hashedPassword,
            subscription_plan: 'free',
            is_actif: 'true',
            company_name: userData.company_name || '',
            activity: userData.activity || '',
            description: userData.description || '',
            b2b2c: userData.b2b2c || ''
          }
        }
      ]);

      const user = records[0];
      return {
        id: user.id,
        username: user.get('username') as string,
        email: user.get('email') as string,
        subscription_plan: user.get('subscription_plan') as string,
        is_actif: user.get('is_actif') as string,
        company_name: user.get('company_name') as string,
        activity: user.get('activity') as string,
        description: user.get('description') as string,
        b2b2c: user.get('b2b2c') as string
      };
    } catch (error) {
      handleAirtableError(error, 'registration');
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const records = await base('Users').update([
        {
          id: userId,
          fields: {
            company_name: userData.company_name,
            activity: userData.activity,
            description: userData.description,
            b2b2c: userData.b2b2c
          }
        }
      ]);

      const user = records[0];
      return {
        id: user.id,
        username: user.get('username') as string,
        email: user.get('email') as string,
        subscription_plan: user.get('subscription_plan') as string,
        is_actif: user.get('is_actif') as string,
        company_name: user.get('company_name') as string,
        activity: user.get('activity') as string,
        description: user.get('description') as string,
        b2b2c: user.get('b2b2c') as string
      };
    } catch (error) {
      handleAirtableError(error, 'user update');
      throw error;
    }
  },

  async getSearchTemplates(userId: string): Promise<SearchTemplate[]> {
    try {
      const records = await base('SearchTemplate')
        .select({
          filterByFormula: `SEARCH("${userId}", {userID})`,
          sort: [{ field: 'Date de création', direction: 'desc' }],
          maxRecords: 3
        })
        .firstPage();

      return records.map(record => ({
        id: record.id,
        userId: record.get('userID') as string[],
        keywords: record.get('keywords') as string,
        subreddit: record.get('subreddit') as string,
        bizDescription: record.get('biz_descritpion') as string,
        nb_leads: record.get('nb_leads') as number
      }));
    } catch (error) {
      handleAirtableError(error, 'fetching search templates');
      return [];
    }
  },

  async createSearchTemplate(template: { userId: string[], criteria: SearchCriteria }): Promise<SearchTemplate> {
    try {
      const records = await base('SearchTemplate').create([
        {
          fields: {
            userID: template.userId,
            keywords: template.criteria.keywords,
            subreddit: template.criteria.subreddit,
            biz_descritpion: template.criteria.businessDescription,
            nb_leads: 0
          }
        }
      ]);

      const record = records[0];
      return {
        id: record.id,
        userId: record.get('userID') as string[],
        keywords: record.get('keywords') as string,
        subreddit: record.get('subreddit') as string,
        bizDescription: record.get('biz_descritpion') as string,
        nb_leads: record.get('nb_leads') as number
      };
    } catch (error) {
      handleAirtableError(error, 'creating search template');
      throw error;
    }
  },

  async getLeads(userId: string): Promise<Lead[]> {
    try {
      const records = await base('Leads')
        .select({
          filterByFormula: `SEARCH("${userId}", {user_id})`,
          sort: [{ field: 'Date de création', direction: 'desc' }],
          maxRecords: 5
        })
        .firstPage();

      return records.map(record => ({
        id: record.id,
        reddit_username: record.get('reddit_username') as string,
        qualification_score: record.get('qualification_score') as string,
        status: record.get('status') as string,
        lead_temperature: record.get('lead_temperature') as string,
        account_created: record.get('account_created') as string,
        decision_maker_signals: record.get('decision_maker_signals') as string,
        pain_points_mentioned: record.get('pain_points_mentioned') as string
      }));
    } catch (error) {
      handleAirtableError(error, 'fetching leads');
      return [];
    }
  },

  async getMoreLeads(userId: string, offset: number): Promise<Lead[]> {
    try {
      const records = await base('Leads')
        .select({
          filterByFormula: `SEARCH("${userId}", {user_id})`,
          sort: [{ field: 'Date de création', direction: 'desc' }],
          maxRecords: 5,
          offset: offset
        })
        .firstPage();

      return records.map(record => ({
        id: record.id,
        reddit_username: record.get('reddit_username') as string,
        qualification_score: record.get('qualification_score') as string,
        status: record.get('status') as string,
        lead_temperature: record.get('lead_temperature') as string,
        account_created: record.get('account_created') as string,
        decision_maker_signals: record.get('decision_maker_signals') as string,
        pain_points_mentioned: record.get('pain_points_mentioned') as string
      }));
    } catch (error) {
      handleAirtableError(error, 'fetching more leads');
      return [];
    }
  },

  async updateLeadStatus(leadId: string, status: string): Promise<void> {
    try {
      await base('Leads').update([
        {
          id: leadId,
          fields: { status }
        }
      ]);
    } catch (error) {
      handleAirtableError(error, 'updating lead status');
      throw error;
    }
  },

  async triggerMakeWebhook(searchData: any): Promise<void> {
    try {
      console.log('Triggering Make.com webhook with data:', searchData);
    } catch (error) {
      handleAirtableError(error, 'triggering webhook');
      throw error;
    }
  }
};