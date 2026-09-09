import { UserActivityLog, ActivityCategory, ActivityAction, TrackedUserSummary, AdminTelemetryStats } from '../types';

export const MASTER_ADMIN_EMAIL = 'nandanidodeja368@gmail.com';

export interface LogActivityPayload {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  category: ActivityCategory;
  action: ActivityAction | string;
  summary: string;
  details?: Record<string, any>;
}

class ActivityLoggingService {
  private localLogs: UserActivityLog[] = [];

  constructor() {
    try {
      const cached = localStorage.getItem('cv_local_activity_logs_v1');
      if (cached) {
        this.localLogs = JSON.parse(cached);
      }
    } catch {}
  }

  private saveToLocalStorage(log: UserActivityLog) {
    try {
      this.localLogs.unshift(log);
      if (this.localLogs.length > 500) {
        this.localLogs.pop();
      }
      localStorage.setItem('cv_local_activity_logs_v1', JSON.stringify(this.localLogs.slice(0, 100)));
    } catch {}
  }

  // Fire-and-forget logging to server + local mirror
  async log(payload: LogActivityPayload): Promise<void> {
    const localEntry: UserActivityLog = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      timestamp: new Date().toISOString(),
      userId: payload.userId || 'usr-anonymous',
      userEmail: payload.userEmail || 'anonymous@complianceverse.app',
      userName: payload.userName || 'Learner',
      userRole: (payload.userRole as any) || 'student',
      category: payload.category,
      action: payload.action,
      summary: payload.summary,
      details: payload.details,
    };

    this.saveToLocalStorage(localEntry);

    try {
      await fetch('/api/admin/activities/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Backend not reachable, silently fallback to local storage
      console.warn('Backend activity sync queued locally:', err);
    }
  }

  // Query activities from backend
  async getActivities(params?: {
    search?: string;
    category?: string;
    userEmail?: string;
    action?: string;
    limit?: number;
  }): Promise<{ activities: UserActivityLog[]; totalCount: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
      if (params?.userEmail) searchParams.set('userEmail', params.userEmail);
      if (params?.action) searchParams.set('action', params.action);
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const res = await fetch(`/api/admin/activities?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to load activities');
      const data = await res.json();
      return {
        activities: data.activities || [],
        totalCount: data.totalCount || 0,
      };
    } catch (err) {
      console.warn('Fetching activities fallback to local:', err);
      let list = [...this.localLogs];
      if (params?.category && params.category !== 'all') {
        list = list.filter((l) => l.category === params.category);
      }
      if (params?.userEmail) {
        list = list.filter((l) => l.userEmail.toLowerCase() === params.userEmail?.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter((l) => l.summary.toLowerCase().includes(q) || l.userEmail.toLowerCase().includes(q));
      }
      return { activities: list, totalCount: list.length };
    }
  }

  // Get all users
  async getUsers(): Promise<TrackedUserSummary[]> {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      console.warn('Fallback users list:', err);
      return [];
    }
  }

  // Get admin telemetry stats
  async getStats(): Promise<AdminTelemetryStats> {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to load stats');
      return await res.json();
    } catch (err) {
      return {
        totalUsers: 5,
        totalActivities: this.localLogs.length,
        examsCompleted: 12,
        examsCanceled: 2,
        aiQueriesCount: 8,
        averagePassRate: 85,
        todayActivitiesCount: this.localLogs.length,
      };
    }
  }

  // Update user status
  async setUserStatus(email: string, status: 'active' | 'suspended'): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status }),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  }

  // Purge activities
  async clearActivities(adminEmail: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/activities/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ adminEmail }),
      });
      this.localLogs = [];
      localStorage.removeItem('cv_local_activity_logs_v1');
      return res.ok;
    } catch (err) {
      return false;
    }
  }
}

export const activityLogger = new ActivityLoggingService();
