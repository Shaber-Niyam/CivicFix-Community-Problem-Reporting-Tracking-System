/**
 * CivicFix — Application Logic & State Management (js/app.js)
 */
(function () {

      'use strict';

      // =========================================================================
      // 1. DOMAIN CONSTANTS & SEMANTIC METADATA
      // =========================================================================
      var CATEGORIES = {
        ROAD_DAMAGE: 'Road Damage',
        GARBAGE_ACCUMULATION: 'Garbage Accumulation',
        DRAINAGE_PROBLEMS: 'Drainage Problems',
        WATERLOGGING: 'Waterlogging',
        BROKEN_STREETLIGHTS: 'Broken Streetlights',
        WATER_SUPPLY: 'Water Supply',
        OTHER: 'Other'
      };

      var CATEGORY_DESCRIPTIONS = {
        ROAD_DAMAGE: 'Potholes, cracked asphalt, broken sidewalks, and damaged dividers.',
        GARBAGE_ACCUMULATION: 'Uncollected waste, overflowing bins, and illegal roadside dumping.',
        DRAINAGE_PROBLEMS: 'Blocked storm drains, overflowing culverts, and open manholes.',
        WATERLOGGING: 'Standing floodwater on streets, intersections, and public walkways.',
        BROKEN_STREETLIGHTS: 'Dark corridors, flickering lamps, and damaged utility poles.',
        WATER_SUPPLY: 'Leaking mains, low water pressure, and contaminated supply lines.',
        OTHER: 'Public park hazards, fallen signage, and general municipal maintenance.'
      };

      var STATUS_META = {
        SUBMITTED: {
          label: 'Submitted',
          color: '#8A7B6A',
          bg: 'rgba(138, 123, 106, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
        },
        UNDER_REVIEW: {
          label: 'Under Review',
          color: '#D99A1E',
          bg: 'rgba(217, 154, 30, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
        },
        IN_PROGRESS: {
          label: 'In Progress',
          color: '#1F8A7D',
          bg: 'rgba(31, 138, 125, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
        },
        RESOLVED: {
          label: 'Resolved',
          color: '#2E9E5B',
          bg: 'rgba(46, 158, 91, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        },
        REJECTED: {
          label: 'Rejected',
          color: '#6C151E',
          bg: 'rgba(108, 21, 30, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        }
      };

      var PRIORITY_META = {
        LOW: {
          label: 'Low',
          rank: 1,
          color: '#64748B',
          bg: 'rgba(100, 116, 139, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>'
        },
        MEDIUM: {
          label: 'Medium',
          rank: 2,
          color: '#D99A1E',
          bg: 'rgba(217, 154, 30, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>'
        },
        HIGH: {
          label: 'High',
          rank: 3,
          color: '#D9682A',
          bg: 'rgba(217, 104, 42, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
        },
        CRITICAL: {
          label: 'Critical',
          rank: 4,
          color: '#B3261E',
          bg: 'rgba(179, 38, 30, 0.16)',
          icon: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
        }
      };

      var VALID_TRANSITIONS = {
        SUBMITTED: ['SUBMITTED', 'UNDER_REVIEW', 'REJECTED'],
        UNDER_REVIEW: ['UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'SUBMITTED'],
        IN_PROGRESS: ['IN_PROGRESS', 'RESOLVED', 'UNDER_REVIEW', 'REJECTED'],
        RESOLVED: ['RESOLVED', 'UNDER_REVIEW'],
        REJECTED: ['REJECTED', 'UNDER_REVIEW']
      };

      var CHART_PALETTE = ['#6C151E', '#0F3D3A', '#C9A27A', '#1F8A7D', '#D99A1E', '#B86B73'];

      var CIVICFIX_LOGO_SVG = '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="2.5"/></svg>';

      // =========================================================================
      // 2. PERSISTENT STATE & RELATIONAL STORE
      // =========================================================================
      function safeGetStorage(key, fallback) {
        try {
          var raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
          return fallback;
        }
      }

      function safeSetStorage(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
      }

      function createCivicEvidenceSvg(categoryColor, label) {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="380" viewBox="0 0 640 380">' +
          '<rect width="640" height="380" fill="#0F3D3A"/>' +
          '<rect x="24" y="24" width="592" height="332" rx="20" fill="#0A2B28" stroke="#F5DABF" stroke-opacity="0.25" stroke-width="2"/>' +
          '<circle cx="110" cy="126" r="42" fill="' + categoryColor + '"/>' +
          '<rect x="176" y="96" width="370" height="22" rx="8" fill="#F5DABF" fill-opacity="0.9"/>' +
          '<rect x="176" y="132" width="240" height="14" rx="6" fill="#F5DABF" fill-opacity="0.45"/>' +
          '<path d="M60 296 L210 220 L370 278 L570 185" stroke="#F5DABF" stroke-opacity="0.3" stroke-width="10" fill="none" stroke-linecap="round"/>' +
          '<text x="64" y="334" fill="#F5DABF" font-family="Inter, sans-serif" font-size="17" font-weight="700">' + label + '</text>' +
          '</svg>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      }

      var defaultDb = {
        seq: 4,
        profiles: [
          {
            id: 'usr-citizen-1',
            full_name: 'Md. Niyamul Shaber',
            email: 'shaber@citizen.civicfix.org',
            phone: '+880 1700-000000',
            password_hash: 'Citizen2026',
            role: 'CITIZEN',
            show_first_name_publicly: true,
            created_at: '2026-11-01T09:00:00Z',
            updated_at: '2026-11-01T09:00:00Z'
          },
          {
            id: 'usr-admin-1',
            full_name: 'Municipal Administrator',
            email: 'admin@municipality.gov',
            phone: '+880 1800-111111',
            password_hash: 'Admin2026',
            role: 'ADMIN',
            show_first_name_publicly: false,
            created_at: '2026-11-01T08:00:00Z',
            updated_at: '2026-11-01T08:00:00Z'
          }
        ],
        reports: [
          {
            id: 'rep-seed-1',
            complaint_number: 'CF-2026-000001',
            user_id: 'usr-citizen-1',
            title: 'Deep pothole near Central Hospital main intersection',
            description: 'A large pothole has formed near the eastbound lane outside Central Hospital, causing sudden braking and water splash hazards for pedestrians and ambulances.',
            category: 'ROAD_DAMAGE',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            latitude: 25.7439,
            longitude: 89.2752,
            address: 'Hospital Road, Ward 04, Rangpur',
            is_public: true,
            idempotency_key: 'seed-idem-1',
            created_at: '2026-11-12T08:30:00Z',
            updated_at: '2026-11-16T14:20:00Z',
            resolved_at: null
          },
          {
            id: 'rep-seed-2',
            complaint_number: 'CF-2026-000002',
            user_id: 'usr-citizen-1',
            title: 'Blocked storm drain causing street waterlogging',
            description: 'Heavy silt and plastic debris have completely blocked the main stormwater culvert along Station Road, leading to ankle-deep standing water after light rain.',
            category: 'DRAINAGE_PROBLEMS',
            status: 'UNDER_REVIEW',
            priority: 'CRITICAL',
            latitude: 25.7485,
            longitude: 89.2684,
            address: 'Station Road, Opposite Public Library',
            is_public: true,
            idempotency_key: 'seed-idem-2',
            created_at: '2026-11-15T10:15:00Z',
            updated_at: '2026-11-17T09:10:00Z',
            resolved_at: null
          },
          {
            id: 'rep-seed-3',
            complaint_number: 'CF-2026-000003',
            user_id: 'usr-citizen-1',
            title: 'Three consecutive streetlights out along College Avenue',
            description: 'Poles #14, #15, and #16 have been unlit for five nights, leaving the pedestrian walkway completely dark after 6 PM.',
            category: 'BROKEN_STREETLIGHTS',
            status: 'RESOLVED',
            priority: 'MEDIUM',
            latitude: 25.7402,
            longitude: 89.2815,
            address: 'College Avenue, Sector 2',
            is_public: true,
            idempotency_key: 'seed-idem-3',
            created_at: '2026-11-05T18:45:00Z',
            updated_at: '2026-11-14T16:00:00Z',
            resolved_at: '2026-11-14T16:00:00Z'
          },
          {
            id: 'rep-seed-4',
            complaint_number: 'CF-2026-000004',
            user_id: 'usr-citizen-1',
            title: 'Overflowing community waste container at Market Square',
            description: 'The municipal waste skip near the north vegetable stalls has not been cleared in three days and is spilling onto the footpath.',
            category: 'GARBAGE_ACCUMULATION',
            status: 'SUBMITTED',
            priority: 'HIGH',
            latitude: 25.7510,
            longitude: 89.2721,
            address: 'North Market Square, Lane 3',
            is_public: false,
            idempotency_key: 'seed-idem-4',
            created_at: '2026-11-19T07:20:00Z',
            updated_at: '2026-11-19T07:20:00Z',
            resolved_at: null
          }
        ],
        report_images: [
          {
            id: 'img-seed-1',
            report_id: 'rep-seed-1',
            image_url: createCivicEvidenceSvg('#D9682A', 'Road Damage — Hospital Road'),
            storage_path: 'usr-citizen-1/rep-seed-1/road.jpg',
            created_at: '2026-11-12T08:30:00Z'
          },
          {
            id: 'img-seed-2',
            report_id: 'rep-seed-2',
            image_url: createCivicEvidenceSvg('#B3261E', 'Drainage Blockage — Station Road'),
            storage_path: 'usr-citizen-1/rep-seed-2/drain.jpg',
            created_at: '2026-11-15T10:15:00Z'
          },
          {
            id: 'img-seed-3',
            report_id: 'rep-seed-3',
            image_url: createCivicEvidenceSvg('#2E9E5B', 'Streetlight Repaired — College Ave'),
            storage_path: 'usr-citizen-1/rep-seed-3/light.jpg',
            created_at: '2026-11-05T18:45:00Z'
          }
        ],
        report_updates: [
          {
            id: 'upd-seed-1a',
            report_id: 'rep-seed-1',
            admin_id: 'usr-admin-1',
            previous_status: 'UNDER_REVIEW',
            new_status: 'IN_PROGRESS',
            comment: 'Road maintenance crew dispatched with cold-mix asphalt unit.',
            created_at: '2026-11-16T14:20:00Z'
          },
          {
            id: 'upd-seed-2a',
            report_id: 'rep-seed-2',
            admin_id: 'usr-admin-1',
            previous_status: 'SUBMITTED',
            new_status: 'UNDER_REVIEW',
            comment: 'Verified by ward inspector; drainage vacuum truck scheduled.',
            created_at: '2026-11-17T09:10:00Z'
          },
          {
            id: 'upd-seed-3a',
            report_id: 'rep-seed-3',
            admin_id: 'usr-admin-1',
            previous_status: 'IN_PROGRESS',
            new_status: 'RESOLVED',
            comment: 'Replaced faulty LED drivers and restored power on all three poles.',
            created_at: '2026-11-14T16:00:00Z'
          },
          {
            id: 'upd-seed-4a',
            report_id: 'rep-seed-4',
            admin_id: null,
            previous_status: null,
            new_status: 'SUBMITTED',
            comment: 'Report submitted by citizen and queued for municipal review.',
            created_at: '2026-11-19T07:20:00Z'
          }
        ],
        notifications: [
          {
            id: 'notif-seed-1',
            user_id: 'usr-citizen-1',
            report_id: 'rep-seed-1',
            title: 'Work In Progress (CF-2026-000001)',
            message: 'Road maintenance crew dispatched with cold-mix asphalt unit.',
            is_read: false,
            created_at: '2026-11-16T14:20:00Z'
          },
          {
            id: 'notif-seed-2',
            user_id: 'usr-citizen-1',
            report_id: 'rep-seed-3',
            title: 'Report Resolved (CF-2026-000003)',
            message: 'Replaced faulty LED drivers and restored power on all three poles.',
            is_read: true,
            created_at: '2026-11-14T16:00:00Z'
          }
        ]
      };

      var db = safeGetStorage('civicfix_db_v1', defaultDb);

      var state = {
        theme: safeGetStorage('civicfix-theme-mode', 'light'),
        currentUserId: safeGetStorage('civicfix_session_uid', 'usr-citizen-1'),
        route: 'dashboard',
        selectedReportId: null,
        mobileDrawerOpen: false,
        notifDropdownOpen: false,
        exploreFilter: { q: '', category: '', status: '', area: '', sort: 'newest', view: 'grid', page: 1 },
        citizenFilter: { q: '', category: '', status: '', sort: 'newest', page: 1 },
        adminFilter: { q: '', category: '', status: '', priority: '', sort: 'newest', page: 1 },
        analyticsDays: 180,
        wizard: {
          step: 1,
          idempotencyKey: 'cf-idem-' + Date.now(),
          title: '',
          category: 'ROAD_DAMAGE',
          description: '',
          prioritySuggestion: 'MEDIUM',
          photos: [],
          latitude: 25.7439,
          longitude: 89.2752,
          address: 'Station Road, Rangpur',
          searchQuery: ''
        },
        supabaseConfig: safeGetStorage('civicfix_sb_cfg', { url: '', anonKey: '' })
      };

      function persistDb() {
        safeSetStorage('civicfix_db_v1', db);
      }

      function applyTheme() {
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        safeSetStorage('civicfix-theme-mode', state.theme);
      }

      applyTheme();

      // =========================================================================
      // 3. UTILITIES & VALIDATORS
      // =========================================================================
      function escapeHtml(str) {
        return String(str == null ? '' : str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function formatDate(iso) {
        if (!iso) return '—';
        try {
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }).format(new Date(iso));
        } catch (e) {
          return iso;
        }
      }

      function showToast(message, type) {
        var container = document.getElementById('toast-container');
        if (!container) return;
        var el = document.createElement('div');
        var isErr = type === 'error';
        el.className = 'neu-raised pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-xs font-bold shadow-lg ' +
          (isErr ? 'border-l-4 border-[#6C151E] text-[#6C151E] dark:text-[#F5DABF]' : 'border-l-4 border-[#2E9E5B] text-surface');
        el.innerHTML = '<span>' + escapeHtml(message) + '</span>' +
          '<span class="text-xs font-extrabold">' + (isErr ? '!' : '✓') + '</span>';
        container.appendChild(el);
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 4200);
      }

      function getCurrentUser() {
        if (!state.currentUserId) return null;
        for (var i = 0; i < db.profiles.length; i++) {
          if (db.profiles[i].id === state.currentUserId) return db.profiles[i];
        }
        return null;
      }

      function computeProfileCompletion(profile) {
        if (!profile) return 0;
        var filled = 0;
        if (profile.full_name && profile.full_name.trim().length >= 2) filled++;
        if (profile.email && profile.email.indexOf('@') !== -1) filled++;
        if (profile.phone && profile.phone.trim().length >= 6) filled++;
        if (typeof profile.show_first_name_publicly === 'boolean') filled++;
        return Math.round((filled / 4) * 100);
      }

      function renderStatusBadge(status) {
        var meta = STATUS_META[status] || STATUS_META.SUBMITTED;
        return '<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border" style="background-color:' + meta.bg + '; color:' + meta.color + '; border-color:' + meta.color + '44;">' +
          meta.icon +
          '<span>' + escapeHtml(meta.label) + '</span>' +
          '</span>';
      }

      function renderPriorityBadge(priority) {
        var meta = PRIORITY_META[priority] || PRIORITY_META.MEDIUM;
        return '<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border" style="background-color:' + meta.bg + '; color:' + meta.color + '; border-color:' + meta.color + '44;">' +
          meta.icon +
          '<span>' + escapeHtml(meta.label) + '</span>' +
          '</span>';
      }

      function verifyMagicBytes(uint8, mimeType) {
        if (!uint8 || uint8.length < 12) return false;
        if (mimeType === 'image/jpeg') {
          return uint8[0] === 0xFF && uint8[1] === 0xD8 && uint8[2] === 0xFF;
        }
        if (mimeType === 'image/png') {
          return uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4E && uint8[3] === 0x47;
        }
        if (mimeType === 'image/webp') {
          return uint8[0] === 0x52 && uint8[1] === 0x49 && uint8[2] === 0x46 && uint8[3] === 0x46 &&
                 uint8[8] === 0x57 && uint8[9] === 0x45 && uint8[10] === 0x42 && uint8[11] === 0x50;
        }
        return false;
      }

      function getPublicReportsView() {
        var list = [];
        for (var i = 0; i < db.reports.length; i++) {
          var r = db.reports[i];
          if (!r.is_public) continue;
          var author = null;
          for (var j = 0; j < db.profiles.length; j++) {
            if (db.profiles[j].id === r.user_id) {
              author = db.profiles[j];
              break;
            }
          }
          var displayName = 'Community member';
          if (author && author.show_first_name_publicly && author.full_name) {
            displayName = author.full_name.trim().split(' ')[0];
          }
          var imgs = db.report_images.filter(function (im) { return im.report_id === r.id; });
          list.push({
            id: r.id,
            complaint_number: r.complaint_number,
            title: r.title,
            description: r.description,
            category: r.category,
            status: r.status,
            priority: r.priority,
            latitude: r.latitude,
            longitude: r.longitude,
            address: r.address,
            created_at: r.created_at,
            updated_at: r.updated_at,
            resolved_at: r.resolved_at,
            reporter_display_name: displayName,
            images: imgs
          });
        }
        return list;
      }

      // =========================================================================
      // 4. TRANSACTIONAL HANDLERS
      // =========================================================================
      function txSubmitReport(user, payload) {
        if (!user) throw new Error('Please sign in to submit a report.');
        for (var i = 0; i < db.reports.length; i++) {
          if (db.reports[i].idempotency_key === payload.idempotencyKey) {
            return db.reports[i];
          }
        }
        db.seq = (db.seq || 0) + 1;
        var year = new Date().getUTCFullYear();
        var padded = String(db.seq).padStart(6, '0');
        var complaintNumber = 'CF-' + year + '-' + padded;
        var nowIso = new Date().toISOString();
        var reportId = 'rep-' + Date.now() + '-' + db.seq;

        var newReport = {
          id: reportId,
          complaint_number: complaintNumber,
          user_id: user.id,
          title: payload.title.trim(),
          description: payload.description.trim(),
          category: payload.category,
          status: 'SUBMITTED',
          priority: payload.prioritySuggestion || 'MEDIUM',
          latitude: Number(payload.latitude),
          longitude: Number(payload.longitude),
          address: payload.address.trim(),
          is_public: false,
          idempotency_key: payload.idempotencyKey,
          created_at: nowIso,
          updated_at: nowIso,
          resolved_at: null
        };

        db.reports.unshift(newReport);

        for (var k = 0; k < payload.photos.length; k++) {
          db.report_images.push({
            id: 'img-' + Date.now() + '-' + k,
            report_id: reportId,
            image_url: payload.photos[k].dataUrl,
            storage_path: user.id + '/' + reportId + '/photo-' + (k + 1) + '.jpg',
            created_at: nowIso
          });
        }

        db.report_updates.unshift({
          id: 'upd-' + Date.now(),
          report_id: reportId,
          admin_id: null,
          previous_status: null,
          new_status: 'SUBMITTED',
          comment: 'Report submitted by citizen and queued for municipal review.',
          created_at: nowIso
        });

        db.notifications.unshift({
          id: 'notif-' + Date.now(),
          user_id: user.id,
          report_id: reportId,
          title: 'Report Submitted (' + complaintNumber + ')',
          message: 'Your report "' + newReport.title + '" has been received and assigned ' + complaintNumber + '.',
          is_read: false,
          created_at: nowIso
        });

        persistDb();
        return newReport;
      }

      function txAdminUpdateWorkflow(adminUser, reportId, newStatus, newPriority, isPublic, comment) {
        if (!adminUser || adminUser.role !== 'ADMIN') {
          throw new Error('Forbidden: Administrator privileges required.');
        }
        var target = null;
        for (var i = 0; i < db.reports.length; i++) {
          if (db.reports[i].id === reportId) {
            target = db.reports[i];
            break;
          }
        }
        if (!target) throw new Error('Report not found.');

        var allowed = VALID_TRANSITIONS[target.status] || [];
        if (allowed.indexOf(newStatus) === -1) {
          throw new Error('Invalid status transition from ' + target.status + ' to ' + newStatus + '.');
        }

        var cleanComment = (comment || '').trim();
        if (newStatus === 'REJECTED' && cleanComment.length < 5) {
          throw new Error('A rejection reason (at least 5 characters) is required when rejecting a report.');
        }

        var prevStatus = target.status;
        var prevPriority = target.priority;
        var nowIso = new Date().toISOString();

        target.status = newStatus;
        target.priority = newPriority;
        target.is_public = Boolean(isPublic);
        target.updated_at = nowIso;
        if (newStatus === 'RESOLVED' && prevStatus !== 'RESOLVED') {
          target.resolved_at = nowIso;
        } else if (newStatus !== 'RESOLVED') {
          target.resolved_at = null;
        }

        var historyComment = cleanComment;
        if (!historyComment) {
          if (prevPriority !== newPriority) {
            historyComment = 'Priority updated from ' + prevPriority + ' to ' + newPriority + '.';
          } else {
            historyComment = 'Status updated to ' + STATUS_META[newStatus].label + '.';
          }
        }

        db.report_updates.unshift({
          id: 'upd-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          report_id: target.id,
          admin_id: adminUser.id,
          previous_status: prevStatus,
          new_status: newStatus,
          comment: historyComment,
          created_at: nowIso
        });

        db.notifications.unshift({
          id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          user_id: target.user_id,
          report_id: target.id,
          title: 'Update on ' + target.complaint_number + ' (' + STATUS_META[newStatus].label + ')',
          message: historyComment,
          is_read: false,
          created_at: nowIso
        });

        persistDb();
        return target;
      }

      // =========================================================================
      // 5. MAP & CHART LIFECYCLE
      // =========================================================================
      var activeLeafletMap = null;
      var activeChartInstances = [];

      function cleanupVisualInstances() {
        if (activeLeafletMap) {
          try { activeLeafletMap.remove(); } catch (e) {}
          activeLeafletMap = null;
        }
        while (activeChartInstances.length > 0) {
          var c = activeChartInstances.pop();
          try { c.destroy(); } catch (e) {}
        }
      }

      function initLeafletMap(containerId, lat, lng, interactive, onPinMove) {
        var el = document.getElementById(containerId);
        if (!el || typeof L === 'undefined') return;
        if (activeLeafletMap) {
          try { activeLeafletMap.remove(); } catch (e) {}
          activeLeafletMap = null;
        }

        var map = L.map(el).setView([lat, lng], 15);
        activeLeafletMap = map;

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        var pinIcon = L.divIcon({
          className: 'civicfix-map-pin',
          html: '<div style="width:28px;height:28px;border-radius:9999px;background:#6C151E;border:3px solid #F5DABF;box-shadow:0 4px 12px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:9999px;background:#F5DABF;"></div></div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        var marker = L.marker([lat, lng], {
          icon: pinIcon,
          draggable: Boolean(interactive)
        }).addTo(map);

        if (interactive && onPinMove) {
          marker.on('dragend', function (ev) {
            var pos = ev.target.getLatLng();
            onPinMove(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
          });
          map.on('click', function (ev) {
            marker.setLatLng(ev.latlng);
            onPinMove(Number(ev.latlng.lat.toFixed(6)), Number(ev.latlng.lng.toFixed(6)));
          });
        }

        setTimeout(function () {
          try { map.invalidateSize(); } catch (e) {}
        }, 120);
      }

      // =========================================================================
      // 6. SHARED COMPONENTS (Tactile Neumorphic)
      // =========================================================================
      function renderTopPortalBar(user) {
        var isCitizen = user && user.role === 'CITIZEN';
        var isAdmin = user && user.role === 'ADMIN';
        return '<div class="bg-[#0A2B28] text-cream border-b border-[#1E4743] px-4 py-2 text-xs">' +
          '<div class="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">' +
            '<div class="flex items-center gap-2.5">' +
              '<span class="inline-flex items-center gap-1.5 font-bold text-cream">' +
                CIVICFIX_LOGO_SVG +
                '<span>CivicFix Portal</span>' +
              '</span>' +
            '</div>' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<button type="button" data-action="nav" data-route="landing" class="rounded-full px-3 py-1 font-semibold transition-colors ' + (state.route === 'landing' ? 'bg-[#6C151E] text-cream' : 'bg-[#0F3D3A] text-cream/80 hover:text-cream') + '">Home</button>' +
              '<button type="button" data-action="nav" data-route="explore" class="rounded-full px-3 py-1 font-semibold transition-colors ' + (state.route.indexOf('explore') === 0 ? 'bg-[#6C151E] text-cream' : 'bg-[#0F3D3A] text-cream/80 hover:text-cream') + '">Public Explorer</button>' +
              '<button type="button" data-action="switch-role" data-role="CITIZEN" class="rounded-full px-3 py-1 font-semibold transition-colors ' + (isCitizen && state.route.indexOf('admin') === -1 && state.route !== 'landing' && state.route.indexOf('explore') !== 0 ? 'bg-[#6C151E] text-cream' : 'bg-[#0F3D3A] text-cream/80 hover:text-cream') + '">Citizen View</button>' +
              '<button type="button" data-action="switch-role" data-role="ADMIN" class="rounded-full px-3 py-1 font-semibold transition-colors ' + (isAdmin && state.route.indexOf('admin') === 0 ? 'bg-[#6C151E] text-cream' : 'bg-[#0F3D3A] text-cream/80 hover:text-cream') + '">Admin View</button>' +
              '<button type="button" data-action="open-supabase-modal" class="rounded-full border border-cream/30 px-3 py-1 font-semibold text-cream hover:bg-[#0F3D3A]">Supabase</button>' +
              '<button type="button" data-action="install-pwa-app" class="rounded-full bg-[#2E9E5B] px-3 py-1 font-bold text-white hover:opacity-90">Install App</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }

      function renderThemePillSwitch() {
        var isDark = state.theme === 'dark';
        return '<div role="group" aria-label="Theme color mode toggle" class="inline-flex items-center rounded-full bg-[#0A2B28] p-1 border border-[#1E4743]">' +
          '<button type="button" data-action="set-theme" data-theme="light" aria-pressed="' + (!isDark) + '" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ' + (!isDark ? 'bg-[#6C151E] text-cream shadow-xs' : 'text-cream/70 hover:text-cream') + '">' +
            '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' +
            '<span>Light</span>' +
          '</button>' +
          '<button type="button" data-action="set-theme" data-theme="dark" aria-pressed="' + isDark + '" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ' + (isDark ? 'bg-[#6C151E] text-cream shadow-xs' : 'text-cream/70 hover:text-cream') + '">' +
            '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
            '<span>Dark</span>' +
          '</button>' +
        '</div>';
      }

      function renderWelcomeBanner(firstName, subtitle, ringPct, ringSubtext, primaryBtn, secondaryBtn) {
        var clamped = Math.max(0, Math.min(100, ringPct));
        var radius = 34;
        var circ = 2 * Math.PI * radius;
        var offset = circ - (clamped / 100) * circ;
        var initials = (firstName || 'CF').slice(0, 2).toUpperCase();

        return '<section aria-label="Welcome banner" class="rounded-[24px] bg-cream text-[#0F3D3A] p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">' +
          '<div class="space-y-2.5 max-w-xl">' +
            '<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F3D3A]">Welcome back, ' + escapeHtml(firstName) + '!</h2>' +
            '<p class="text-sm text-[#0F3D3A]/85 leading-relaxed">' + escapeHtml(subtitle) + '</p>' +
            '<div class="flex flex-wrap items-center gap-3 pt-1">' +
              '<button type="button" data-action="nav" data-route="' + primaryBtn.route + '" class="btn-primary rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold">' + escapeHtml(primaryBtn.label) + '</button>' +
              (secondaryBtn ? '<button type="button" data-action="nav" data-route="' + secondaryBtn.route + '" class="rounded-full bg-white/85 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0F3D3A] hover:bg-white transition-colors shadow-xs">' + escapeHtml(secondaryBtn.label) + '</button>' : '') +
            '</div>' +
          '</div>' +
          '<div class="flex items-center gap-4 self-end sm:self-center">' +
            '<div class="relative h-20 w-20 flex items-center justify-center">' +
              '<svg class="h-20 w-20 -rotate-90" viewBox="0 0 80 80">' +
                '<circle cx="40" cy="40" r="' + radius + '" stroke="#0F3D3A" stroke-opacity="0.16" stroke-width="6" fill="transparent"/>' +
                '<circle cx="40" cy="40" r="' + radius + '" stroke="#6C151E" stroke-width="6" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '" stroke-linecap="round" fill="transparent"/>' +
              '</svg>' +
              '<div class="absolute inset-2 rounded-full bg-[#0F3D3A] text-cream flex items-center justify-center font-bold text-sm">' + escapeHtml(initials) + '</div>' +
            '</div>' +
            '<div>' +
              '<p class="text-xl font-extrabold text-[#6C151E]">' + clamped + '%</p>' +
              '<p class="text-xs font-semibold text-[#0F3D3A]/80">' + escapeHtml(ringSubtext) + '</p>' +
            '</div>' +
          '</div>' +
        '</section>';
      }

      function renderStatCard(label, value, svgIcon) {
        return '<div class="neu-raised rounded-[20px] p-5 flex items-center gap-4">' +
          '<div class="neu-inset flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-brand-green">' + svgIcon + '</div>' +
          '<div>' +
            '<p class="text-2xl sm:text-3xl font-extrabold text-surface leading-tight">' + value + '</p>' +
            '<p class="text-xs font-semibold text-muted">' + escapeHtml(label) + '</p>' +
          '</div>' +
        '</div>';
      }

      function renderStatusDonutSection(canvasId, title, subtitle, countsByStatus) {
        var statuses = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
        var total = 0;
        for (var i = 0; i < statuses.length; i++) {
          total += countsByStatus[statuses[i]] || 0;
        }

        if (total === 0) {
          return '<section class="neu-raised rounded-[22px] p-6">' +
            '<h3 class="text-lg font-bold text-brand-green">' + escapeHtml(title) + '</h3>' +
            '<p class="text-xs text-muted mb-5">' + escapeHtml(subtitle) + '</p>' +
            '<div class="rounded-2xl border-2 border-dashed border-[#8A7B6A]/35 p-8 text-center space-y-3">' +
              '<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl neu-inset text-muted">' +
                '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
              '</div>' +
              '<p class="text-sm font-bold text-surface">No Reports Recorded Yet</p>' +
              '<p class="text-xs text-muted max-w-md mx-auto">Submit a civic issue report to populate status analytics and progress bars.</p>' +
              '<button type="button" data-action="nav" data-route="report-new" class="btn-primary rounded-full px-5 py-2 text-xs font-bold">Report an Issue</button>' +
            '</div>' +
          '</section>';
        }

        var barsHtml = '';
        for (var j = 0; j < statuses.length; j++) {
          var st = statuses[j];
          var cnt = countsByStatus[st] || 0;
          var pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
          var meta = STATUS_META[st];
          barsHtml += '<div class="space-y-1.5">' +
            '<div class="flex items-center justify-between text-xs font-semibold">' +
              '<span class="flex items-center gap-2 text-surface"><span class="h-2.5 w-2.5 rounded-full" style="background:' + meta.color + '"></span>' + escapeHtml(meta.label) + '</span>' +
              '<span class="text-muted">' + cnt + ' (' + pct + '%)</span>' +
            '</div>' +
            '<div class="neu-inset h-2.5 w-full overflow-hidden rounded-full p-0.5">' +
              '<div class="h-full rounded-full transition-all duration-300" style="width:' + pct + '%;background:' + meta.color + '"></div>' +
            '</div>' +
          '</div>';
        }

        return '<section class="neu-raised rounded-[22px] p-6">' +
          '<div class="mb-4">' +
            '<h3 class="text-lg font-bold text-brand-green">' + escapeHtml(title) + '</h3>' +
            '<p class="text-xs text-muted">' + escapeHtml(subtitle) + '</p>' +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">' +
            '<div class="relative h-60 w-full flex items-center justify-center">' +
              '<canvas id="' + canvasId + '"></canvas>' +
              '<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">' +
                '<span class="text-3xl font-extrabold text-surface">' + total + '</span>' +
                '<span class="text-xs font-medium text-muted">Total</span>' +
              '</div>' +
            '</div>' +
            '<div class="space-y-3.5">' + barsHtml + '</div>' +
          '</div>' +
        '</section>';
      }

      // =========================================================================
      // 7. APP SHELL (Sidebar + Tactile Main Container + Right Activity Rail)
      // =========================================================================
      function renderAppShell(user, pageTitle, mainContentHtml, rightRailHtml) {
        var isAdmin = user && user.role === 'ADMIN';
        var navItems = isAdmin
          ? [
              { route: 'admin-overview', label: 'Overview', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
              { route: 'admin-complaints', label: 'Complaints', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
              { route: 'admin-analytics', label: 'Analytics', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
              { route: 'admin-users', label: 'Users', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
              { route: 'admin-settings', label: 'Settings', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
              { route: 'explore', label: 'Public Explorer', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' }
            ]
          : [
              { route: 'dashboard', label: 'Dashboard', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
              { route: 'reports', label: 'My Reports', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
              { route: 'report-new', label: 'Report an Issue', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>' },
              { route: 'explore', label: 'Public Explorer', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' },
              { route: 'notifications', label: 'Notifications', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
              { route: 'profile', label: 'Profile', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' }
            ];

        var userNotifs = db.notifications.filter(function (n) { return n.user_id === user.id; });
        var unreadCount = userNotifs.filter(function (n) { return !n.is_read; }).length;
        var initials = (user.full_name || 'CF').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();

        var navHtml = '';
        for (var i = 0; i < navItems.length; i++) {
          var item = navItems[i];
          var active = state.route === item.route ||
            (item.route === 'reports' && state.route === 'report-detail') ||
            (item.route === 'admin-complaints' && state.route === 'admin-complaint-detail');
          navHtml += '<button type="button" data-action="nav" data-route="' + item.route + '" class="w-full flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all ' +
            (active ? 'bg-[#6C151E] text-cream font-bold shadow-md' : 'text-cream/80 hover:bg-[#0F3D3A] hover:text-cream') + '">' +
            item.icon +
            '<span>' + escapeHtml(item.label) + '</span>' +
          '</button>';
        }

        var sidebarInner = '<div class="flex h-full flex-col justify-between bg-[#0A2B28] text-cream p-5 rounded-[26px] shadow-xl">' +
          '<div>' +
            '<button type="button" data-action="nav" data-route="landing" class="flex items-center gap-3 px-2 py-1.5 mb-6 text-left">' +
              '<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C151E] text-cream shadow-md">' + CIVICFIX_LOGO_SVG + '</div>' +
              '<div>' +
                '<span class="text-lg font-extrabold tracking-tight text-cream block leading-none">CivicFix</span>' +
                '<span class="text-[11px] text-cream/70 uppercase tracking-wider">' + (isAdmin ? 'Admin Portal' : 'Citizen Portal') + '</span>' +
              '</div>' +
            '</button>' +
            '<nav aria-label="Main Sidebar" class="space-y-1.5">' + navHtml + '</nav>' +
          '</div>' +
          '<div class="space-y-4 pt-6 border-t border-cream/10">' +
            '<div class="flex items-center justify-between gap-2 rounded-2xl bg-[#0F3D3A] p-3">' +
              '<div class="flex items-center gap-3 min-w-0">' +
                '<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-[#0F3D3A] font-extrabold text-sm">' + escapeHtml(initials) + '</div>' +
                '<div class="min-w-0">' +
                  '<p class="truncate text-sm font-bold text-cream">' + escapeHtml(user.full_name) + '</p>' +
                  '<div class="flex items-center gap-1.5 text-xs text-cream/80">' +
                    '<span class="h-2 w-2 rounded-full bg-[#2E9E5B]"></span>' +
                    '<span>Active</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<button type="button" data-action="logout" aria-label="Sign out" title="Sign out" class="rounded-xl p-2 text-cream/75 hover:bg-[#6C151E] hover:text-cream">' +
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
              '</button>' +
            '</div>' +
            '<div class="flex justify-center">' + renderThemePillSwitch() + '</div>' +
          '</div>' +
        '</div>';

        var notifDropdownHtml = '';
        if (state.notifDropdownOpen) {
          var listHtml = '';
          if (userNotifs.length === 0) {
            listHtml = '<p class="py-6 text-center text-xs text-muted">No notifications yet. System updates appear here.</p>';
          } else {
            for (var nIdx = 0; nIdx < Math.min(6, userNotifs.length); nIdx++) {
              var n = userNotifs[nIdx];
              listHtml += '<div class="rounded-xl p-3 mb-2 ' + (n.is_read ? 'neu-inset' : 'neu-raised') + '">' +
                '<div class="flex items-center justify-between text-xs font-bold">' +
                  '<span class="text-surface">' + escapeHtml(n.title) + '</span>' +
                  '<span class="text-[10px] text-muted">' + formatDate(n.created_at) + '</span>' +
                '</div>' +
                '<p class="mt-1 text-xs text-muted">' + escapeHtml(n.message) + '</p>' +
                '<div class="mt-2 flex items-center justify-between">' +
                  (n.report_id ? '<button type="button" data-action="open-report" data-id="' + n.report_id + '" class="text-[11px] font-bold text-bordo hover:underline">View report →</button>' : '<span></span>') +
                  (!n.is_read ? '<button type="button" data-action="mark-notif-read" data-id="' + n.id + '" class="text-[11px] text-muted hover:text-surface">Mark read</button>' : '') +
                '</div>' +
              '</div>';
            }
          }
          notifDropdownHtml = '<div class="neu-modal absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-4 z-50">' +
            '<div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-surface">' +
              '<span class="text-xs font-extrabold uppercase tracking-wider text-brand-green">Notifications</span>' +
              (unreadCount > 0 ? '<button type="button" data-action="mark-all-notifs-read" class="text-xs font-bold text-bordo hover:underline">Mark all read</button>' : '') +
            '</div>' +
            '<div class="max-h-72 overflow-y-auto">' + listHtml + '</div>' +
            '<div class="pt-2 mt-2 border-t border-surface text-center">' +
              '<button type="button" data-action="nav" data-route="notifications" class="text-xs font-bold text-bordo hover:underline">Open all notifications</button>' +
            '</div>' +
          '</div>';
        }

        return renderTopPortalBar(user) +
          '<div class="min-h-[calc(100vh-42px)] bg-surface-bg p-2 sm:p-4 lg:p-6">' +
            '<div class="mx-auto flex max-w-[1440px] gap-6">' +
              '<aside class="hidden lg:block w-64 shrink-0 sticky top-6 h-[calc(100vh-3.5rem)]">' + sidebarInner + '</aside>' +
              (state.mobileDrawerOpen
                ? '<div class="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">' +
                    '<div class="fixed inset-0 bg-black/60" data-action="toggle-mobile-drawer"></div>' +
                    '<div class="relative z-10 w-72 max-w-[85vw] h-full p-2">' + sidebarInner + '</div>' +
                  '</div>'
                : '') +
              '<div class="neu-raised flex-1 min-w-0 rounded-[26px] p-4 sm:p-6 lg:p-8">' +
                '<header class="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-surface">' +
                  '<div class="flex items-center gap-3">' +
                    '<button type="button" data-action="toggle-mobile-drawer" aria-label="Open menu" class="neu-raised lg:hidden rounded-xl p-2 text-surface">' +
                      '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
                    '</button>' +
                    '<h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-green">' + escapeHtml(pageTitle) + '</h1>' +
                  '</div>' +
                  '<div class="flex items-center gap-3">' +
                    '<div class="relative">' +
                      '<button type="button" data-action="toggle-notif-dropdown" aria-label="Notifications" class="neu-raised relative rounded-full p-2.5 text-surface">' +
                        '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
                        (unreadCount > 0 ? '<span class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6C151E] px-1.5 text-[11px] font-bold text-cream">' + unreadCount + '</span>' : '') +
                      '</button>' +
                      notifDropdownHtml +
                    '</div>' +
                    '<button type="button" data-action="nav" data-route="report-new" class="btn-primary hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold">+ Report Issue</button>' +
                  '</div>' +
                '</header>' +
                '<div class="grid grid-cols-1 xl:grid-cols-12 gap-6">' +
                  '<main class="animate-enter ' + (rightRailHtml ? 'xl:col-span-8 space-y-6' : 'xl:col-span-12 space-y-6') + '">' + mainContentHtml + '</main>' +
                  (rightRailHtml ? '<aside class="xl:col-span-4 rounded-[22px] bg-rail p-5 h-fit space-y-6 border border-surface">' + rightRailHtml + '</aside>' : '') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      // =========================================================================
      // 8. PUBLIC LANDING PAGE (Complete Sections + Tactile Cards)
      // =========================================================================
      function renderLandingView(user) {
        var total = db.reports.length;
        var resolved = db.reports.filter(function (r) { return r.status === 'RESOLVED'; }).length;
        var pending = db.reports.filter(function (r) { return r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW'; }).length;
        var inProgress = db.reports.filter(function (r) { return r.status === 'IN_PROGRESS'; }).length;
        var publicReports = getPublicReportsView().slice(0, 6);
        var resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        var recentCardsHtml = '';
        if (publicReports.length === 0) {
          recentCardsHtml = '<div class="neu-raised rounded-[22px] p-10 text-center space-y-3">' +
            '<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl neu-inset text-muted">' +
              '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            '</div>' +
            '<p class="text-base font-bold text-brand-green">No Publicly Approved Reports Yet</p>' +
            '<p class="text-xs text-muted max-w-md mx-auto">Reports appear here once municipal administrators review and approve them for public display.</p>' +
            '<button type="button" data-action="nav" data-route="report-new" class="btn-primary rounded-full px-6 py-2.5 text-xs font-bold">Submit the First Report</button>' +
          '</div>';
        } else {
          var cards = '';
          for (var i = 0; i < publicReports.length; i++) {
            var r = publicReports[i];
            var img = r.images && r.images[0] ? r.images[0].image_url : '';
            cards += '<div class="neu-raised neu-raised-hover rounded-[22px] overflow-hidden flex flex-col justify-between">' +
              '<div>' +
                (img ? '<img src="' + img + '" alt="' + escapeHtml(r.title) + '" class="h-40 w-full object-cover"/>' : '<div class="h-36 w-full bg-rail flex items-center justify-center text-xs text-muted">No photo attached</div>') +
                '<div class="p-5 space-y-2.5">' +
                  '<div class="flex flex-wrap items-center gap-2">' + renderStatusBadge(r.status) + renderPriorityBadge(r.priority) + '</div>' +
                  '<p class="text-xs font-bold text-bordo">' + escapeHtml(CATEGORIES[r.category]) + ' · ' + escapeHtml(r.complaint_number) + '</p>' +
                  '<h3 class="text-base font-bold text-surface">' + escapeHtml(r.title) + '</h3>' +
                  '<p class="text-xs text-muted">' + escapeHtml(r.address) + '</p>' +
                '</div>' +
              '</div>' +
              '<div class="px-5 py-3 border-t border-surface flex items-center justify-between text-xs text-muted">' +
                '<span>By ' + escapeHtml(r.reporter_display_name) + '</span>' +
                '<button type="button" data-action="open-public-report" data-id="' + r.id + '" class="font-bold text-bordo hover:underline">View More →</button>' +
              '</div>' +
            '</div>';
          }
          recentCardsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' + cards + '</div>';
        }

        var catCardsHtml = '';
        Object.keys(CATEGORIES).forEach(function (k) {
          catCardsHtml += '<button type="button" data-action="explore-category" data-category="' + k + '" class="neu-raised neu-raised-hover rounded-[20px] p-5 text-left space-y-2">' +
            '<h3 class="text-sm font-extrabold text-brand-green">' + escapeHtml(CATEGORIES[k]) + '</h3>' +
            '<p class="text-xs text-muted leading-relaxed">' + escapeHtml(CATEGORY_DESCRIPTIONS[k]) + '</p>' +
          '</button>';
        });

        return renderTopPortalBar(user) +
          '<div class="min-h-screen bg-surface-bg text-surface">' +
            '<header class="border-b border-surface bg-surface-card/90 sticky top-0 z-30 backdrop-blur-md">' +
              '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">' +
                '<div class="flex items-center gap-2.5">' +
                  '<div class="h-9 w-9 rounded-xl bg-[#6C151E] text-cream flex items-center justify-center shadow-sm">' + CIVICFIX_LOGO_SVG + '</div>' +
                  '<span class="text-lg font-extrabold text-brand-green">CivicFix</span>' +
                '</div>' +
                '<div class="flex items-center gap-3">' +
                  renderThemePillSwitch() +
                  '<button type="button" data-action="nav" data-route="explore" class="neu-raised rounded-full px-4 py-2 text-xs font-bold text-surface">Explore Reports</button>' +
                  '<button type="button" data-action="nav" data-route="report-new" class="btn-primary rounded-full px-5 py-2 text-xs font-bold">Report an Issue</button>' +
                '</div>' +
              '</div>' +
            '</header>' +

            '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">' +
              '<div class="rounded-[28px] bg-[#0F3D3A] text-cream p-8 sm:p-12 lg:p-14 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">' +
                '<div class="lg:col-span-7 space-y-5">' +
                  '<span class="inline-flex items-center gap-2 rounded-full bg-cream/15 px-3.5 py-1 text-xs font-semibold text-cream">Transparent Municipal Accountability</span>' +
                  '<h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream leading-tight">Your Community. Your Voice. Your CivicFix.</h1>' +
                  '<p class="text-sm sm:text-base text-cream/85 max-w-xl leading-relaxed">Report local problems, track their progress, and help build a cleaner, safer, and better-connected community.</p>' +
                  '<div class="flex flex-wrap items-center gap-4 pt-2">' +
                    '<button type="button" data-action="nav" data-route="report-new" class="btn-bordo rounded-full px-7 py-3.5 text-sm font-bold shadow-md">Report an Issue →</button>' +
                    '<button type="button" data-action="nav" data-route="explore" class="rounded-full border-2 border-cream px-7 py-3.5 text-sm font-bold text-cream hover:bg-cream hover:text-[#0F3D3A] transition-colors">Explore Reports</button>' +
                  '</div>' +
                '</div>' +
                '<div class="lg:col-span-5 flex justify-center">' +
                  '<svg viewBox="0 0 420 300" class="w-full max-w-md rounded-2xl bg-[#0A2B28] p-4 border border-cream/15">' +
                    '<rect x="16" y="16" width="388" height="268" rx="18" fill="#0F3D3A"/>' +
                    '<path d="M30 220 L140 150 L260 205 L390 110" stroke="#F5DABF" stroke-opacity="0.25" stroke-width="8" fill="none" stroke-linecap="round"/>' +
                    '<rect x="55" y="125" width="56" height="90" rx="6" fill="#F5DABF" fill-opacity="0.16"/>' +
                    '<rect x="125" y="95" width="68" height="120" rx="8" fill="#F5DABF" fill-opacity="0.22"/>' +
                    '<circle cx="159" cy="82" r="22" fill="#6C151E"/>' +
                    '<circle cx="159" cy="82" r="8" fill="#F5DABF"/>' +
                    '<rect x="240" y="64" width="140" height="52" rx="12" fill="#F5DABF"/>' +
                    '<circle cx="265" cy="90" r="12" fill="#2E9E5B"/>' +
                    '<rect x="285" y="80" width="76" height="8" rx="4" fill="#0F3D3A"/>' +
                    '<rect x="285" y="94" width="52" height="6" rx="3" fill="#6C151E"/>' +
                  '</svg>' +
                '</div>' +
              '</div>' +
            '</section>' +

            '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">' +
              renderStatCard('Total Reports', total, '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>') +
              renderStatCard('Resolved', resolved, '<svg class="w-6 h-6 text-[#2E9E5B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>') +
              renderStatCard('Pending Review', pending, '<svg class="w-6 h-6 text-[#D99A1E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>') +
              renderStatCard('In Progress', inProgress, '<svg class="w-6 h-6 text-[#1F8A7D]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>') +
            '</section>' +

            '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">' +
              '<h2 class="text-2xl font-extrabold text-brand-green text-center">How CivicFix Works</h2>' +
              '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' +
                '<div class="neu-raised rounded-[22px] p-6 space-y-2"><span class="inline-flex h-9 w-9 items-center justify-center rounded-xl neu-inset text-xs font-extrabold text-bordo">01</span><h3 class="text-base font-bold text-brand-green">Report an Issue</h3><p class="text-xs text-muted leading-relaxed">Upload up to 5 verified photos, drop a pin on the interactive street map, and describe the issue.</p></div>' +
                '<div class="neu-raised rounded-[22px] p-6 space-y-2"><span class="inline-flex h-9 w-9 items-center justify-center rounded-xl neu-inset text-xs font-extrabold text-bordo">02</span><h3 class="text-base font-bold text-brand-green">Track Progress</h3><p class="text-xs text-muted leading-relaxed">Follow every status change from Submitted to Under Review and In Progress with official updates.</p></div>' +
                '<div class="neu-raised rounded-[22px] p-6 space-y-2"><span class="inline-flex h-9 w-9 items-center justify-center rounded-xl neu-inset text-xs font-extrabold text-bordo">03</span><h3 class="text-base font-bold text-brand-green">Build a Better Community</h3><p class="text-xs text-muted leading-relaxed">Receive instant notifications when repairs are completed and verify neighborhood impact.</p></div>' +
              '</div>' +
            '</section>' +

            '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">' +
              '<div class="flex items-center justify-between">' +
                '<div><h2 class="text-2xl font-extrabold text-brand-green">Recent Community Reports</h2><p class="text-xs text-muted">Approved public reports across neighborhoods</p></div>' +
                '<button type="button" data-action="nav" data-route="explore" class="text-xs font-bold text-bordo hover:underline">Explore All →</button>' +
              '</div>' +
              recentCardsHtml +
            '</section>' +

            '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">' +
              '<h2 class="text-2xl font-extrabold text-brand-green">Issue Categories</h2>' +
              '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' + catCardsHtml + '</div>' +
            '</section>' +

            '<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">' +
              '<div class="rounded-[24px] bg-cream text-[#0F3D3A] p-7 space-y-3 shadow-md">' +
                '<h2 class="text-xl font-extrabold">Community Impact</h2>' +
                (total === 0
                  ? '<p class="text-xs text-[#0F3D3A]/80">No reports logged yet. Submit your first report to start tracking municipal resolution rates.</p>'
                  : '<p class="text-sm text-[#0F3D3A]/90"><strong>' + total + '</strong> reports logged with a <strong>' + resolutionRate + '%</strong> resolution rate (' + resolved + ' resolved, ' + inProgress + ' in progress).</p>' +
                    '<div class="h-2.5 w-full rounded-full bg-[#0F3D3A]/15 overflow-hidden"><div class="h-full bg-[#6C151E]" style="width:' + resolutionRate + '%"></div></div>') +
              '</div>' +
              '<div class="neu-raised rounded-[24px] p-7 space-y-3">' +
                '<h2 class="text-xl font-extrabold text-brand-green">Frequently Asked Questions</h2>' +
                '<details class="neu-inset rounded-xl p-3 text-xs"><summary class="cursor-pointer font-bold text-surface">Is my email or phone exposed publicly?</summary><p class="mt-2 text-muted">Never. Public views strip all emails, phone numbers, and user IDs, showing "Community member" by default.</p></details>' +
                '<details class="neu-inset rounded-xl p-3 text-xs"><summary class="cursor-pointer font-bold text-surface">How are uploaded photos verified?</summary><p class="mt-2 text-muted">Both MIME type and binary magic-byte signatures (JPEG, PNG, WebP) are checked before storage.</p></details>' +
              '</div>' +
            '</section>' +

            '<footer class="mt-10 bg-[#0F3D3A] text-cream py-10 px-4">' +
              '<div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">' +
                '<div class="flex items-center gap-2.5"><div class="h-8 w-8 rounded-lg bg-[#6C151E] flex items-center justify-center">' + CIVICFIX_LOGO_SVG + '</div><span class="font-bold">CivicFix — Municipal Issue Resolution</span></div>' +
                '<div class="flex gap-5 text-cream/80"><button type="button" data-action="nav" data-route="explore" class="hover:text-cream">Public Explorer</button><button type="button" data-action="nav" data-route="report-new" class="hover:text-cream">Report Issue</button><button type="button" data-action="nav" data-route="login" class="hover:text-cream">Sign In</button></div>' +
              '</div>' +
            '</footer>' +
          '</div>';
      }

      // =========================================================================
      // 9. AUTHENTICATION VIEWS (Login / Register / Forgot Password)
      // =========================================================================
      function renderAuthView(mode) {
        var cardHtml = '';
        if (mode === 'login') {
          cardHtml = '<h1 class="text-2xl font-extrabold text-brand-green text-center">Sign in to CivicFix</h1>' +
            '<p class="text-xs text-muted text-center">Access your citizen dashboard or administrator portal.</p>' +
            '<div class="space-y-3">' +
              '<div><label for="auth-login-email" class="block text-xs font-bold text-muted mb-1">Email Address</label><input id="auth-login-email" type="email" value="shaber@citizen.civicfix.org" class="w-full rounded-xl px-4 py-2.5 text-sm"/></div>' +
              '<div><label for="auth-login-pass" class="block text-xs font-bold text-muted mb-1">Password</label><input id="auth-login-pass" type="password" value="Citizen2026" class="w-full rounded-xl px-4 py-2.5 text-sm"/></div>' +
              '<button type="button" data-action="auth-login-submit" class="btn-primary w-full rounded-full py-3 text-sm font-bold">Sign In</button>' +
            '</div>' +
            '<div class="flex items-center justify-between text-xs pt-2">' +
              '<button type="button" data-action="nav" data-route="register" class="font-bold text-bordo hover:underline">Create account</button>' +
              '<button type="button" data-action="nav" data-route="forgot-password" class="text-muted hover:underline">Forgot password?</button>' +
            '</div>';
        } else if (mode === 'register') {
          cardHtml = '<h1 class="text-2xl font-extrabold text-brand-green text-center">Create Citizen Account</h1>' +
            '<div class="space-y-3">' +
              '<div><label for="auth-reg-name" class="block text-xs font-bold text-muted mb-1">Full Name</label><input id="auth-reg-name" type="text" placeholder="Your full name" class="w-full rounded-xl px-4 py-2.5 text-sm"/></div>' +
              '<div><label for="auth-reg-email" class="block text-xs font-bold text-muted mb-1">Email Address</label><input id="auth-reg-email" type="email" placeholder="you@example.com" class="w-full rounded-xl px-4 py-2.5 text-sm"/></div>' +
              '<div><label for="auth-reg-pass" class="block text-xs font-bold text-muted mb-1">Password (min 8 chars, upper, lower, number)</label><input id="auth-reg-pass" type="password" class="w-full rounded-xl px-4 py-2.5 text-sm"/></div>' +
              '<button type="button" data-action="auth-register-submit" class="btn-primary w-full rounded-full py-3 text-sm font-bold">Create Account</button>' +
            '</div>' +
            '<p class="text-center text-xs text-muted">Already registered? <button type="button" data-action="nav" data-route="login" class="font-bold text-bordo hover:underline">Sign In</button></p>';
        } else {
          cardHtml = '<h1 class="text-2xl font-extrabold text-brand-green text-center">Reset Password</h1>' +
            '<p class="text-xs text-muted text-center">Enter your account email to receive a password reset link.</p>' +
            '<div class="space-y-3">' +
              '<div><label for="auth-forgot-email" class="block text-xs font-bold text-muted mb-1">Email Address</label><input id="auth-forgot-email" type="email" placeholder="you@example.com" class="w-full rounded-xl px-4 py-2.5 text-sm"/></div>' +
              '<button type="button" data-action="auth-forgot-submit" class="btn-primary w-full rounded-full py-3 text-sm font-bold">Send Reset Link</button>' +
            '</div>' +
            '<p class="text-center text-xs"><button type="button" data-action="nav" data-route="login" class="font-bold text-bordo hover:underline">Back to Sign In</button></p>';
        }

        return renderTopPortalBar(getCurrentUser()) +
          '<div class="min-h-[calc(100vh-42px)] bg-surface-bg flex items-center justify-center p-4">' +
            '<div class="neu-raised w-full max-w-md rounded-[26px] p-8 space-y-5">' +
              '<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C151E] text-cream shadow-md">' + CIVICFIX_LOGO_SVG + '</div>' +
              cardHtml +
            '</div>' +
          '</div>';
      }

      // =========================================================================
      // 10. CITIZEN DASHBOARD, WIZARD, REPORTS, PROFILE, NOTIFICATIONS
      // =========================================================================
      function renderCitizenDashboard(user) {
        var myReports = db.reports.filter(function (r) { return r.user_id === user.id; });
        var myTotal = myReports.length;
        var myPending = myReports.filter(function (r) { return r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW'; }).length;
        var myProgress = myReports.filter(function (r) { return r.status === 'IN_PROGRESS'; }).length;
        var myResolved = myReports.filter(function (r) { return r.status === 'RESOLVED'; }).length;

        var countsByStatus = { SUBMITTED: 0, UNDER_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 };
        for (var i = 0; i < myReports.length; i++) {
          var st = myReports[i].status;
          countsByStatus[st] = (countsByStatus[st] || 0) + 1;
        }

        var userNotifs = db.notifications.filter(function (n) { return n.user_id === user.id; });
        var resolvedList = myReports.filter(function (r) { return r.status === 'RESOLVED'; }).slice(0, 3);

        var latestUpdatesHtml = '';
        if (userNotifs.length === 0) {
          latestUpdatesHtml = '<p class="text-xs text-muted py-3">No updates yet. Submit a report to receive status notifications.</p>';
        } else {
          for (var j = 0; j < Math.min(4, userNotifs.length); j++) {
            var nf = userNotifs[j];
            latestUpdatesHtml += '<button type="button" data-action="open-report" data-id="' + (nf.report_id || '') + '" class="neu-raised neu-raised-hover w-full text-left block rounded-2xl p-3.5 mb-2.5">' +
              '<span class="inline-block rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold text-[#0F3D3A]">' + formatDate(nf.created_at) + '</span>' +
              '<p class="mt-1.5 text-xs font-bold text-surface">' + escapeHtml(nf.title) + '</p>' +
              '<p class="mt-0.5 text-[11px] text-muted">' + escapeHtml(nf.message) + '</p>' +
            '</button>';
          }
        }

        var resolvedHtml = '';
        if (resolvedList.length === 0) {
          resolvedHtml = '<p class="text-xs text-muted py-2">No resolved reports yet.</p>';
        } else {
          for (var k = 0; k < resolvedList.length; k++) {
            var rr = resolvedList[k];
            resolvedHtml += '<button type="button" data-action="open-report" data-id="' + rr.id + '" class="neu-raised neu-raised-hover w-full text-left block rounded-2xl p-3.5 mb-2.5">' +
              '<span class="inline-block rounded-full bg-[#2E9E5B]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#2E9E5B]">' + formatDate(rr.resolved_at || rr.updated_at) + '</span>' +
              '<p class="mt-1.5 text-xs font-bold text-surface">' + escapeHtml(rr.title) + '</p>' +
              '<p class="mt-0.5 text-[11px] text-muted">' + escapeHtml(rr.complaint_number) + ' · Resolved</p>' +
            '</button>';
          }
        }

        var rightRail = '<div>' +
            '<div class="flex items-center justify-between mb-3">' +
              '<h3 class="text-xs font-extrabold uppercase tracking-wider text-brand-green">Latest Updates</h3>' +
              '<button type="button" data-action="nav" data-route="notifications" class="text-xs font-bold text-bordo hover:underline">View all</button>' +
            '</div>' +
            latestUpdatesHtml +
          '</div>' +
          '<div class="pt-4 border-t border-surface">' +
            '<div class="flex items-center justify-between mb-3">' +
              '<h3 class="text-xs font-extrabold uppercase tracking-wider text-brand-green">Recently Resolved</h3>' +
              '<button type="button" data-action="nav" data-route="reports" class="text-xs font-bold text-bordo hover:underline">View all</button>' +
            '</div>' +
            resolvedHtml +
          '</div>';

        var firstName = (user.full_name || 'Citizen').split(' ')[0];
        var mainHtml = renderWelcomeBanner(
            firstName,
            'Report local infrastructure issues, attach photo evidence, and track municipal resolution in real time.',
            computeProfileCompletion(user),
            'Profile Completion',
            { label: 'Report an Issue', route: 'report-new' },
            { label: 'My Reports', route: 'reports' }
          ) +
          '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' +
            renderStatCard('My Total', myTotal, '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>') +
            renderStatCard('Pending', myPending, '<svg class="w-6 h-6 text-[#D99A1E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>') +
            renderStatCard('In Progress', myProgress, '<svg class="w-6 h-6 text-[#1F8A7D]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>') +
            renderStatCard('Resolved', myResolved, '<svg class="w-6 h-6 text-[#2E9E5B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>') +
          '</div>' +
          renderStatusDonutSection('citizen-donut-chart', 'My Report Status Breakdown', 'Live status counts across your submitted reports', countsByStatus);

        return renderAppShell(user, 'Citizen Dashboard', mainHtml, rightRail);
      }

      function renderReportWizardView(user) {
        var w = state.wizard;
        var steps = [
          { id: 1, label: '1. Issue Info' },
          { id: 2, label: '2. Photos' },
          { id: 3, label: '3. Location' },
          { id: 4, label: '4. Review' }
        ];
        var stepperHtml = '';
        for (var i = 0; i < steps.length; i++) {
          var s = steps[i];
          var isCur = w.step === s.id;
          var isDone = w.step > s.id;
          stepperHtml += '<div class="relative flex flex-col items-center text-center pt-7">' +
            (isCur
              ? '<div class="absolute -top-1 rounded-lg bg-[#2D2A26] text-cream px-2.5 py-1 text-[10px] font-bold shadow-md whitespace-nowrap">Current Step: ' + escapeHtml(s.label.split('. ')[1]) + '</div>'
              : '') +
            '<div class="h-10 w-10 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ' +
              (isCur
                ? 'bg-[#124E4B] text-cream shadow-md ring-4 ring-[#124E4B]/20'
                : isDone
                ? 'bg-[#124E4B]/20 text-[#124E4B] border-2 border-[#124E4B]'
                : 'neu-raised text-muted') + '">' +
              (isDone ? '✓' : s.id) +
            '</div>' +
            '<span class="mt-2 text-xs font-bold ' + (isCur ? 'text-surface' : 'text-muted') + '">' + escapeHtml(s.label) + '</span>' +
          '</div>';
        }

        var stepBody = '';
        if (w.step === 1) {
          var catOpts = '';
          Object.keys(CATEGORIES).forEach(function (k) {
            catOpts += '<option value="' + k + '" ' + (w.category === k ? 'selected' : '') + '>' + escapeHtml(CATEGORIES[k]) + '</option>';
          });
          var priOpts = '';
          ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].forEach(function (p) {
            priOpts += '<option value="' + p + '" ' + (w.prioritySuggestion === p ? 'selected' : '') + '>' + p + '</option>';
          });

          stepBody = '<div class="neu-raised rounded-[22px] p-6 space-y-4">' +
            '<div>' +
              '<label for="wiz-title" class="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Issue Title * (5–160 chars)</label>' +
              '<input id="wiz-title" type="text" value="' + escapeHtml(w.title) + '" placeholder="e.g., Deep pothole near Central Hospital gate" class="w-full rounded-xl px-4 py-2.5 text-sm"/>' +
            '</div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
              '<div>' +
                '<label for="wiz-category" class="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Category *</label>' +
                '<select id="wiz-category" class="w-full rounded-xl px-4 py-2.5 text-sm">' + catOpts + '</select>' +
              '</div>' +
              '<div>' +
                '<label for="wiz-priority" class="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Priority Suggestion</label>' +
                '<select id="wiz-priority" class="w-full rounded-xl px-4 py-2.5 text-sm">' + priOpts + '</select>' +
              '</div>' +
            '</div>' +
            '<div>' +
              '<label for="wiz-desc" class="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Detailed Description * (15–4000 chars)</label>' +
              '<textarea id="wiz-desc" rows="4" placeholder="Describe the severity, safety impact, and nearby landmarks..." class="w-full rounded-xl p-4 text-sm">' + escapeHtml(w.description) + '</textarea>' +
            '</div>' +
          '</div>';
        } else if (w.step === 2) {
          var thumbs = '';
          for (var pIdx = 0; pIdx < w.photos.length; pIdx++) {
            var ph = w.photos[pIdx];
            thumbs += '<div class="neu-raised relative rounded-xl overflow-hidden">' +
              '<img src="' + ph.dataUrl + '" alt="' + escapeHtml(ph.name) + '" class="h-28 w-full object-cover"/>' +
              '<div class="p-2 flex items-center justify-between text-[10px]">' +
                '<span class="truncate text-muted">' + escapeHtml(ph.name) + '</span>' +
                '<button type="button" data-action="remove-wizard-photo" data-idx="' + pIdx + '" class="font-bold text-bordo hover:underline">Remove</button>' +
              '</div>' +
            '</div>';
          }
          stepBody = '<div class="neu-raised rounded-[22px] p-6 space-y-4">' +
            '<div id="wiz-dropzone" class="rounded-2xl border-2 border-dashed border-[#8A7B6A]/40 p-8 text-center space-y-3">' +
              '<p class="text-sm font-bold text-surface">Drag &amp; drop photos here, or select files (Max 5 files, 5 MB each, JPEG/PNG/WebP)</p>' +
              '<p class="text-xs text-muted">Validated by both MIME type and binary magic-byte file signature.</p>' +
              '<div class="flex flex-wrap items-center justify-center gap-3 pt-2">' +
                '<label for="wiz-photo-input" class="btn-primary cursor-pointer rounded-full px-5 py-2 text-xs font-bold">Choose Image Files' +
                  '<input id="wiz-photo-input" type="file" multiple accept="image/jpeg,image/png,image/webp" class="sr-only"/>' +
                '</label>' +
                '<button type="button" data-action="add-verified-evidence-photo" class="neu-raised rounded-full px-4 py-2 text-xs font-bold text-surface">+ Attach Sample Camera Capture</button>' +
              '</div>' +
            '</div>' +
            (w.photos.length > 0 ? '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">' + thumbs + '</div>' : '<p class="text-xs text-muted text-center">No photos attached yet.</p>') +
          '</div>';
        } else if (w.step === 3) {
          stepBody = '<div class="neu-raised rounded-[22px] p-6 space-y-4">' +
            '<div class="flex flex-wrap items-center justify-between gap-2">' +
              '<div class="flex flex-1 items-center gap-2 min-w-[220px]">' +
                '<input id="wiz-nominatim-q" type="text" value="' + escapeHtml(w.searchQuery) + '" placeholder="Search street or city (Nominatim)..." class="flex-1 rounded-xl px-3.5 py-2 text-xs"/>' +
                '<button type="button" data-action="nominatim-search" class="btn-primary rounded-xl px-4 py-2 text-xs font-bold">Search</button>' +
              '</div>' +
              '<button type="button" data-action="detect-gps" class="btn-bordo rounded-full px-4 py-2 text-xs font-bold">Detect My Location</button>' +
            '</div>' +
            '<div id="wizard-leaflet-map" class="h-72 w-full rounded-2xl border border-surface overflow-hidden"></div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">' +
              '<div>' +
                '<label for="wiz-lat" class="block text-xs font-bold text-muted mb-1">Latitude (-90..90)</label>' +
                '<input id="wiz-lat" type="number" step="any" value="' + w.latitude + '" class="w-full rounded-xl px-3 py-2 text-xs font-mono"/>' +
              '</div>' +
              '<div>' +
                '<label for="wiz-lng" class="block text-xs font-bold text-muted mb-1">Longitude (-180..180)</label>' +
                '<input id="wiz-lng" type="number" step="any" value="' + w.longitude + '" class="w-full rounded-xl px-3 py-2 text-xs font-mono"/>' +
              '</div>' +
              '<div>' +
                '<label for="wiz-address" class="block text-xs font-bold text-muted mb-1">Street Address / Landmark *</label>' +
                '<input id="wiz-address" type="text" value="' + escapeHtml(w.address) + '" class="w-full rounded-xl px-3 py-2 text-xs"/>' +
              '</div>' +
            '</div>' +
          '</div>';
        } else {
          stepBody = '<div class="neu-raised rounded-[22px] p-6 space-y-4">' +
            '<div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface">' +
              '<div>' +
                '<span class="text-xs font-bold uppercase text-bordo">' + escapeHtml(CATEGORIES[w.category]) + '</span>' +
                '<h3 class="text-xl font-extrabold text-brand-green">' + escapeHtml(w.title) + '</h3>' +
              '</div>' +
              '<div class="flex items-center gap-2">' + renderStatusBadge('SUBMITTED') + renderPriorityBadge(w.prioritySuggestion) + '</div>' +
            '</div>' +
            '<p class="text-sm text-surface whitespace-pre-line">' + escapeHtml(w.description) + '</p>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 neu-inset rounded-xl p-3.5 text-xs">' +
              '<div><strong class="text-muted block">Address:</strong> ' + escapeHtml(w.address) + '</div>' +
              '<div><strong class="text-muted block">Coordinates:</strong> ' + Number(w.latitude).toFixed(6) + ', ' + Number(w.longitude).toFixed(6) + '</div>' +
            '</div>' +
            '<p class="text-xs text-muted">Attached Photos: <strong>' + w.photos.length + '</strong> · Idempotency Token: <code class="font-mono">' + escapeHtml(w.idempotencyKey) + '</code></p>' +
          '</div>';
        }

        var navBtns = '<div class="flex items-center justify-between pt-2">' +
          (w.step > 1 ? '<button type="button" data-action="wizard-prev" class="neu-raised rounded-full px-5 py-2.5 text-xs font-bold text-surface">← Back</button>' : '<span></span>') +
          (w.step < 4
            ? '<button type="button" data-action="wizard-next" class="btn-primary rounded-full px-6 py-2.5 text-xs font-bold">Next Step →</button>'
            : '<button type="button" data-action="wizard-submit" class="btn-primary rounded-full px-7 py-3 text-xs sm:text-sm font-extrabold">Confirm &amp; Submit Report</button>') +
        '</div>';

        var html = '<div class="space-y-6">' +
          '<div class="relative"><div class="hidden sm:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-[#124E4B]/20"></div><div class="relative grid grid-cols-2 sm:grid-cols-4 gap-3">' + stepperHtml + '</div></div>' +
          stepBody +
          navBtns +
        '</div>';

        return renderAppShell(user, 'Report an Issue', html, null);
      }

      function renderCitizenReportsList(user) {
        var f = state.citizenFilter;
        var list = db.reports.filter(function (r) {
          if (r.user_id !== user.id) return false;
          if (f.category && r.category !== f.category) return false;
          if (f.status && r.status !== f.status) return false;
          if (f.q) {
            var qLower = f.q.toLowerCase();
            var match = r.title.toLowerCase().indexOf(qLower) !== -1 ||
                        r.complaint_number.toLowerCase().indexOf(qLower) !== -1 ||
                        r.address.toLowerCase().indexOf(qLower) !== -1;
            if (!match) return false;
          }
          return true;
        });

        list.sort(function (a, b) {
          return f.sort === 'oldest'
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at);
        });

        var rowsHtml = '';
        if (list.length === 0) {
          rowsHtml = '<div class="rounded-2xl border-2 border-dashed border-[#8A7B6A]/35 p-10 text-center space-y-3">' +
            '<p class="text-sm font-bold text-brand-green">No Results Found</p>' +
            '<p class="text-xs text-muted">Try adjusting your filters or submit a new civic issue report.</p>' +
            '<button type="button" data-action="clear-citizen-filters" class="btn-primary rounded-full px-5 py-2 text-xs font-bold">Clear Filters</button>' +
          '</div>';
        } else {
          for (var i = 0; i < list.length; i++) {
            var r = list[i];
            rowsHtml += '<div class="neu-raised neu-raised-hover rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">' +
              '<div class="space-y-1">' +
                '<div class="flex items-center gap-2 text-xs font-bold text-bordo">' +
                  '<span>' + escapeHtml(r.complaint_number) + '</span><span>·</span><span>' + escapeHtml(CATEGORIES[r.category]) + '</span>' +
                '</div>' +
                '<h3 class="text-base font-bold text-surface">' + escapeHtml(r.title) + '</h3>' +
                '<p class="text-xs text-muted">' + escapeHtml(r.address) + ' · Submitted ' + formatDate(r.created_at) + '</p>' +
              '</div>' +
              '<div class="flex flex-wrap items-center gap-2">' +
                renderStatusBadge(r.status) +
                renderPriorityBadge(r.priority) +
                '<button type="button" data-action="open-report" data-id="' + r.id + '" class="btn-primary rounded-full px-4 py-1.5 text-xs font-bold">View More →</button>' +
              '</div>' +
            '</div>';
          }
        }

        var catOpts = '<option value="">All Categories</option>';
        Object.keys(CATEGORIES).forEach(function (k) {
          catOpts += '<option value="' + k + '" ' + (f.category === k ? 'selected' : '') + '>' + escapeHtml(CATEGORIES[k]) + '</option>';
        });
        var stOpts = '<option value="">All Statuses</option>';
        Object.keys(STATUS_META).forEach(function (k) {
          stOpts += '<option value="' + k + '" ' + (f.status === k ? 'selected' : '') + '>' + escapeHtml(STATUS_META[k].label) + '</option>';
        });

        var mainHtml = '<div class="neu-raised grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-2xl p-4">' +
            '<input id="cit-filter-q" type="text" value="' + escapeHtml(f.q) + '" placeholder="Search title, CF-2026..." class="rounded-xl px-3.5 py-2 text-xs"/>' +
            '<select id="cit-filter-cat" class="rounded-xl px-3.5 py-2 text-xs">' + catOpts + '</select>' +
            '<select id="cit-filter-status" class="rounded-xl px-3.5 py-2 text-xs">' + stOpts + '</select>' +
            '<select id="cit-filter-sort" class="rounded-xl px-3.5 py-2 text-xs"><option value="newest" ' + (f.sort === 'newest' ? 'selected' : '') + '>Newest First</option><option value="oldest" ' + (f.sort === 'oldest' ? 'selected' : '') + '>Oldest First</option></select>' +
          '</div>' +
          '<div class="space-y-3">' + rowsHtml + '</div>';

        return renderAppShell(user, 'My Reports', mainHtml, null);
      }

      function renderReportDetailView(user, reportId, isAdminMode) {
        var r = null;
        for (var i = 0; i < db.reports.length; i++) {
          if (db.reports[i].id === reportId) {
            r = db.reports[i];
            break;
          }
        }
        if (!r || (!isAdminMode && r.user_id !== user.id && !r.is_public)) {
          return renderAppShell(user, 'Report Not Found', '<p class="text-sm text-muted">Report not found or unauthorized.</p>', null);
        }

        var imgs = db.report_images.filter(function (im) { return im.report_id === r.id; });
        var updates = db.report_updates.filter(function (u) { return u.report_id === r.id; });

        var galleryHtml = '';
        if (imgs.length > 0) {
          var gItems = '';
          for (var g = 0; g < imgs.length; g++) {
            gItems += '<button type="button" data-action="open-lightbox" data-src="' + imgs[g].image_url + '" class="neu-raised overflow-hidden rounded-xl">' +
              '<img src="' + imgs[g].image_url + '" alt="Evidence photo ' + (g + 1) + '" class="h-36 w-full object-cover hover:scale-105 transition-transform"/>' +
            '</button>';
          }
          galleryHtml = '<div><h3 class="text-xs font-bold uppercase tracking-wider text-muted mb-2">Photo Gallery</h3><div class="grid grid-cols-2 sm:grid-cols-3 gap-3">' + gItems + '</div></div>';
        }

        var timelineHtml = '';
        for (var uIdx = 0; uIdx < updates.length; uIdx++) {
          var u = updates[uIdx];
          timelineHtml += '<li class="neu-inset rounded-xl p-3.5">' +
            '<div class="flex items-center justify-between gap-2">' +
              renderStatusBadge(u.new_status) +
              '<span class="text-[11px] text-muted">' + formatDate(u.created_at) + '</span>' +
            '</div>' +
            '<p class="mt-2 text-xs text-surface">' + escapeHtml(u.comment) + '</p>' +
            (u.previous_status ? '<p class="mt-1 text-[10px] text-muted">Transitioned from ' + escapeHtml(STATUS_META[u.previous_status].label) + ' → ' + escapeHtml(STATUS_META[u.new_status].label) + '</p>' : '') +
          '</li>';
        }

        var adminPanelHtml = '';
        if (isAdminMode && user.role === 'ADMIN') {
          var stOptions = '';
          var allowed = VALID_TRANSITIONS[r.status] || [];
          Object.keys(STATUS_META).forEach(function (stKey) {
            var isOk = allowed.indexOf(stKey) !== -1;
            stOptions += '<option value="' + stKey + '" ' + (r.status === stKey ? 'selected' : '') + ' ' + (!isOk ? 'disabled' : '') + '>' +
              escapeHtml(STATUS_META[stKey].label) + (!isOk ? ' (Invalid transition)' : '') +
            '</option>';
          });

          var priOptions = '';
          Object.keys(PRIORITY_META).forEach(function (pKey) {
            priOptions += '<option value="' + pKey + '" ' + (r.priority === pKey ? 'selected' : '') + '>' + pKey + '</option>';
          });

          adminPanelHtml = '<div class="neu-raised rounded-[22px] p-5 space-y-4">' +
            '<h3 class="text-base font-extrabold text-brand-green">Administrator Workflow Controls</h3>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
              '<div><label for="adm-status" class="block text-xs font-bold text-muted mb-1">Next Status</label><select id="adm-status" class="w-full rounded-xl px-3 py-2 text-xs font-bold">' + stOptions + '</select></div>' +
              '<div><label for="adm-priority" class="block text-xs font-bold text-muted mb-1">Priority</label><select id="adm-priority" class="w-full rounded-xl px-3 py-2 text-xs font-bold">' + priOptions + '</select></div>' +
            '</div>' +
            '<label class="neu-inset flex items-center justify-between rounded-xl p-3.5 cursor-pointer">' +
              '<span class="text-xs font-bold text-surface">Approve for Public Complaint Explorer</span>' +
              '<input id="adm-public" type="checkbox" ' + (r.is_public ? 'checked' : '') + ' class="h-4 w-4 accent-[#124E4B]"/>' +
            '</label>' +
            '<div>' +
              '<label for="adm-comment" class="block text-xs font-bold text-muted mb-1">Official Progress Note / Rejection Reason</label>' +
              '<textarea id="adm-comment" rows="3" placeholder="Enter municipal update or mandatory rejection reason..." class="w-full rounded-xl p-3 text-xs"></textarea>' +
            '</div>' +
            '<button type="button" data-action="admin-save-workflow" data-id="' + r.id + '" class="btn-primary rounded-full px-6 py-2.5 text-xs font-bold">Save &amp; Notify Citizen</button>' +
          '</div>';
        }

        var backRoute = isAdminMode ? 'admin-complaints' : (state.route === 'explore-detail' ? 'explore' : 'reports');
        var detailHtml = '<div class="space-y-6">' +
          '<button type="button" data-action="nav" data-route="' + backRoute + '" class="text-xs font-bold text-bordo hover:underline">← Back</button>' +
          '<div class="neu-raised rounded-[22px] p-6 space-y-5">' +
            '<div class="flex flex-wrap items-start justify-between gap-3 border-b border-surface pb-4">' +
              '<div>' +
                '<p class="text-xs font-bold text-bordo">' + escapeHtml(r.complaint_number) + ' · ' + escapeHtml(CATEGORIES[r.category]) + '</p>' +
                '<h2 class="text-xl font-extrabold text-brand-green mt-0.5">' + escapeHtml(r.title) + '</h2>' +
                '<p class="text-xs text-muted mt-1">' + escapeHtml(r.address) + ' · Submitted ' + formatDate(r.created_at) + ' · ' + (r.is_public ? 'Public' : 'Private') + '</p>' +
              '</div>' +
              '<div class="flex items-center gap-2">' + renderStatusBadge(r.status) + renderPriorityBadge(r.priority) + '</div>' +
            '</div>' +
            '<p class="text-sm text-surface whitespace-pre-line">' + escapeHtml(r.description) + '</p>' +
            galleryHtml +
            '<div>' +
              '<h3 class="text-xs font-bold uppercase tracking-wider text-muted mb-2">Verified Coordinates (' + r.latitude.toFixed(5) + ', ' + r.longitude.toFixed(5) + ')</h3>' +
              '<div id="detail-leaflet-map" class="h-64 w-full rounded-2xl border border-surface overflow-hidden"></div>' +
            '</div>' +
            adminPanelHtml +
            '<div class="pt-4 border-t border-surface">' +
              '<h3 class="text-sm font-extrabold uppercase tracking-wider text-brand-green mb-3">Status History Timeline</h3>' +
              '<ol class="space-y-2.5 border-l-2 border-[#124E4B]/30 pl-4">' + timelineHtml + '</ol>' +
            '</div>' +
          '</div>' +
        '</div>';

        return renderAppShell(user, 'Complaint ' + r.complaint_number, detailHtml, null);
      }

      // =========================================================================
      // 11. PUBLIC EXPLORER (Full Search, Filters, Sort, & Grid/List View)
      // =========================================================================
      function renderExploreView(user) {
        var ef = state.exploreFilter;
        var pubList = getPublicReportsView().filter(function (r) {
          if (ef.category && r.category !== ef.category) return false;
          if (ef.status && r.status !== ef.status) return false;
          if (ef.area && r.address.toLowerCase().indexOf(ef.area.toLowerCase()) === -1) return false;
          if (ef.q) {
            var qLower = ef.q.toLowerCase();
            if (
              r.title.toLowerCase().indexOf(qLower) === -1 &&
              r.description.toLowerCase().indexOf(qLower) === -1 &&
              r.complaint_number.toLowerCase().indexOf(qLower) === -1
            ) {
              return false;
            }
          }
          return true;
        });

        pubList.sort(function (a, b) {
          if (ef.sort === 'priority') {
            var diff = (PRIORITY_META[b.priority].rank || 0) - (PRIORITY_META[a.priority].rank || 0);
            if (diff !== 0) return diff;
          }
          return new Date(b.created_at) - new Date(a.created_at);
        });

        var catOpts = '<option value="">All Categories</option>';
        Object.keys(CATEGORIES).forEach(function (k) {
          catOpts += '<option value="' + k + '" ' + (ef.category === k ? 'selected' : '') + '>' + escapeHtml(CATEGORIES[k]) + '</option>';
        });
        var stOpts = '<option value="">All Statuses</option>';
        Object.keys(STATUS_META).forEach(function (k) {
          stOpts += '<option value="' + k + '" ' + (ef.status === k ? 'selected' : '') + '>' + escapeHtml(STATUS_META[k].label) + '</option>';
        });

        var filterBar = '<div class="neu-raised rounded-[20px] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">' +
          '<input id="exp-filter-q" type="text" value="' + escapeHtml(ef.q) + '" placeholder="Search title, CF-2026..." class="lg:col-span-2 rounded-xl px-3.5 py-2 text-xs"/>' +
          '<select id="exp-filter-cat" class="rounded-xl px-3 py-2 text-xs">' + catOpts + '</select>' +
          '<select id="exp-filter-status" class="rounded-xl px-3 py-2 text-xs">' + stOpts + '</select>' +
          '<input id="exp-filter-area" type="text" value="' + escapeHtml(ef.area) + '" placeholder="Area / Street..." class="rounded-xl px-3 py-2 text-xs"/>' +
          '<div class="flex items-center gap-2">' +
            '<select id="exp-filter-sort" class="flex-1 rounded-xl px-3 py-2 text-xs"><option value="newest" ' + (ef.sort === 'newest' ? 'selected' : '') + '>Newest</option><option value="priority" ' + (ef.sort === 'priority' ? 'selected' : '') + '>Priority</option></select>' +
            '<button type="button" data-action="toggle-explore-view" class="neu-raised rounded-xl px-3 py-2 text-xs font-bold text-surface">' + (ef.view === 'grid' ? 'List' : 'Grid') + '</button>' +
          '</div>' +
        '</div>';

        var cards = '';
        if (pubList.length === 0) {
          cards = '<div class="rounded-[22px] border-2 border-dashed border-[#8A7B6A]/35 p-10 text-center space-y-3">' +
            '<p class="text-base font-bold text-brand-green">No Results Found</p>' +
            '<p class="text-xs text-muted max-w-md mx-auto">Reports appear here once approved by an administrator, or try clearing active filters.</p>' +
            '<button type="button" data-action="clear-explore-filters" class="btn-primary rounded-full px-5 py-2 text-xs font-bold">Clear Filters</button>' +
          '</div>';
        } else {
          var grid = '';
          for (var i = 0; i < pubList.length; i++) {
            var r = pubList[i];
            var img = r.images && r.images[0] ? r.images[0].image_url : '';
            grid += '<div class="neu-raised neu-raised-hover rounded-[20px] overflow-hidden flex flex-col justify-between">' +
              '<div>' +
                (img ? '<img src="' + img + '" alt="' + escapeHtml(r.title) + '" class="h-40 w-full object-cover"/>' : '') +
                '<div class="p-5 space-y-2">' +
                  '<div class="flex items-center gap-2">' + renderStatusBadge(r.status) + renderPriorityBadge(r.priority) + '</div>' +
                  '<p class="text-xs font-bold text-bordo">' + escapeHtml(r.complaint_number) + ' · ' + escapeHtml(CATEGORIES[r.category]) + '</p>' +
                  '<h3 class="text-base font-bold text-surface">' + escapeHtml(r.title) + '</h3>' +
                  '<p class="text-xs text-muted">' + escapeHtml(r.address) + '</p>' +
                '</div>' +
              '</div>' +
              '<div class="px-5 py-3 border-t border-surface flex items-center justify-between text-xs text-muted">' +
                '<span>By ' + escapeHtml(r.reporter_display_name) + '</span>' +
                '<button type="button" data-action="open-public-report" data-id="' + r.id + '" class="font-bold text-bordo hover:underline">View More →</button>' +
              '</div>' +
            '</div>';
          }
          cards = '<div class="' + (ef.view === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6') + '">' + grid + '</div>';
        }

        return renderAppShell(user, 'Public Complaint Explorer', filterBar + cards, null);
      }

      // =========================================================================
      // 12. ADMIN OVERVIEW, FILTERED COMPLAINTS TABLE & ANALYTICS
      // =========================================================================
      function renderAdminOverview(user) {
        var total = db.reports.length;
        var counts = { SUBMITTED: 0, UNDER_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 };
        for (var i = 0; i < db.reports.length; i++) {
          var s = db.reports[i].status;
          counts[s] = (counts[s] || 0) + 1;
        }

        var mainHtml = renderWelcomeBanner(
            'Admin',
            'Review incoming citizen submissions, assign priorities, approve public visibility, and resolve municipal issues.',
            total > 0 ? Math.round((counts.RESOLVED / total) * 100) : 100,
            counts.RESOLVED + ' Resolved This Month',
            { label: 'Manage Complaints', route: 'admin-complaints' },
            { label: 'View Analytics', route: 'admin-analytics' }
          ) +
          '<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">' +
            renderStatCard('Total', total, '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>') +
            renderStatCard('New (Submitted)', counts.SUBMITTED, '<svg class="w-6 h-6 text-[#8A7B6A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>') +
            renderStatCard('Under Review', counts.UNDER_REVIEW, '<svg class="w-6 h-6 text-[#D99A1E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/></svg>') +
            renderStatCard('In Progress', counts.IN_PROGRESS, '<svg class="w-6 h-6 text-[#1F8A7D]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>') +
            renderStatCard('Resolved', counts.RESOLVED, '<svg class="w-6 h-6 text-[#2E9E5B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>') +
            renderStatCard('Rejected', counts.REJECTED, '<svg class="w-6 h-6 text-[#6C151E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>') +
          '</div>' +
          renderStatusDonutSection('admin-donut-chart', 'Citywide Status Distribution', 'Real-time breakdown across all municipal complaints', counts);

        return renderAppShell(user, 'Administrator Overview', mainHtml, null);
      }

      function renderAdminComplaintsTable(user) {
        var af = state.adminFilter;
        var filtered = db.reports.filter(function (r) {
          if (af.category && r.category !== af.category) return false;
          if (af.status && r.status !== af.status) return false;
          if (af.priority && r.priority !== af.priority) return false;
          if (af.q) {
            var qLower = af.q.toLowerCase();
            if (
              r.title.toLowerCase().indexOf(qLower) === -1 &&
              r.complaint_number.toLowerCase().indexOf(qLower) === -1 &&
              r.address.toLowerCase().indexOf(qLower) === -1
            ) return false;
          }
          return true;
        });

        var catOpts = '<option value="">All Categories</option>';
        Object.keys(CATEGORIES).forEach(function (k) {
          catOpts += '<option value="' + k + '" ' + (af.category === k ? 'selected' : '') + '>' + escapeHtml(CATEGORIES[k]) + '</option>';
        });
        var stOpts = '<option value="">All Statuses</option>';
        Object.keys(STATUS_META).forEach(function (k) {
          stOpts += '<option value="' + k + '" ' + (af.status === k ? 'selected' : '') + '>' + escapeHtml(STATUS_META[k].label) + '</option>';
        });
        var prOpts = '<option value="">All Priorities</option>';
        Object.keys(PRIORITY_META).forEach(function (k) {
          prOpts += '<option value="' + k + '" ' + (af.priority === k ? 'selected' : '') + '>' + k + '</option>';
        });

        var filterBar = '<div class="neu-raised rounded-[20px] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">' +
          '<input id="adm-filter-q" type="text" value="' + escapeHtml(af.q) + '" placeholder="Search CF-2026, title, address..." class="lg:col-span-2 rounded-xl px-3.5 py-2 text-xs"/>' +
          '<select id="adm-filter-cat" class="rounded-xl px-3 py-2 text-xs">' + catOpts + '</select>' +
          '<select id="adm-filter-status" class="rounded-xl px-3 py-2 text-xs">' + stOpts + '</select>' +
          '<select id="adm-filter-priority" class="rounded-xl px-3 py-2 text-xs">' + prOpts + '</select>' +
        '</div>';

        var rows = '';
        if (filtered.length === 0) {
          rows = '<tr><td colspan="6" class="px-4 py-10 text-center text-xs text-muted">No matching complaints found.</td></tr>';
        } else {
          for (var i = 0; i < filtered.length; i++) {
            var r = filtered[i];
            rows += '<tr class="border-b border-surface hover:bg-rail/60 transition-colors">' +
              '<td class="px-4 py-3.5 font-mono text-xs font-bold text-bordo">' + escapeHtml(r.complaint_number) + '</td>' +
              '<td class="px-4 py-3.5"><p class="text-xs font-bold text-surface">' + escapeHtml(r.title) + '</p><p class="text-[11px] text-muted">' + escapeHtml(CATEGORIES[r.category]) + ' · ' + escapeHtml(r.address) + '</p></td>' +
              '<td class="px-4 py-3.5">' + renderStatusBadge(r.status) + '</td>' +
              '<td class="px-4 py-3.5">' + renderPriorityBadge(r.priority) + '</td>' +
              '<td class="px-4 py-3.5 text-xs font-semibold">' + (r.is_public ? '<span class="text-[#2E9E5B]">Public</span>' : '<span class="text-muted">Private</span>') + '</td>' +
              '<td class="px-4 py-3.5 text-right"><button type="button" data-action="open-admin-report" data-id="' + r.id + '" class="btn-primary rounded-full px-3.5 py-1.5 text-xs font-bold">Manage →</button></td>' +
            '</tr>';
          }
        }

        var tableHtml = '<div class="neu-raised overflow-x-auto rounded-[20px]">' +
          '<table class="w-full text-left">' +
            '<thead class="border-b border-surface bg-rail text-[11px] font-bold uppercase text-surface">' +
              '<tr><th class="px-4 py-3.5">Complaint #</th><th class="px-4 py-3.5">Issue &amp; Location</th><th class="px-4 py-3.5">Status</th><th class="px-4 py-3.5">Priority</th><th class="px-4 py-3.5">Visibility</th><th class="px-4 py-3.5 text-right">Action</th></tr>' +
            '</thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>';

        return renderAppShell(user, 'Complaint Management', filterBar + tableHtml, null);
      }

      function renderAdminAnalyticsView(user) {
        var counts = { SUBMITTED: 0, UNDER_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 };
        var priCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
        for (var i = 0; i < db.reports.length; i++) {
          var r = db.reports[i];
          counts[r.status] = (counts[r.status] || 0) + 1;
          priCounts[r.priority] = (priCounts[r.priority] || 0) + 1;
        }
        var total = db.reports.length;
        var resRate = total > 0 ? Math.round((counts.RESOLVED / total) * 100) : 0;

        var priBars = '';
        Object.keys(PRIORITY_META).forEach(function (pk) {
          var pm = PRIORITY_META[pk];
          var cnt = priCounts[pk] || 0;
          var pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
          priBars += '<div class="space-y-1.5">' +
            '<div class="flex items-center justify-between text-xs font-bold"><span class="text-surface">' + pm.label + ' Priority</span><span class="text-muted">' + cnt + ' (' + pct + '%)</span></div>' +
            '<div class="neu-inset h-2.5 w-full rounded-full p-0.5"><div class="h-full rounded-full" style="width:' + pct + '%;background:' + pm.color + '"></div></div>' +
          '</div>';
        });

        var html = '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">' +
            renderStatCard('Resolution Rate', resRate + '%', '<svg class="w-6 h-6 text-[#2E9E5B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>') +
            renderStatCard('Total Complaints', total, '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>') +
            renderStatCard('Active In Progress', counts.IN_PROGRESS, '<svg class="w-6 h-6 text-[#1F8A7D]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>') +
          '</div>' +
          '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' +
            renderStatusDonutSection('analytics-donut-chart', 'Status Distribution', 'Live breakdown by workflow status', counts) +
            '<div class="neu-raised rounded-[22px] p-6">' +
              '<h3 class="text-lg font-bold text-brand-green">Complaints by Category</h3>' +
              '<p class="text-xs text-muted mb-4">Real volume by infrastructure category</p>' +
              '<div class="relative h-64 w-full"><canvas id="analytics-category-chart"></canvas></div>' +
            '</div>' +
          '</div>' +
          '<div class="neu-raised rounded-[22px] p-6 space-y-4">' +
            '<h3 class="text-lg font-bold text-brand-green">Priority Distribution</h3>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' + priBars + '</div>' +
          '</div>';

        return renderAppShell(user, 'Municipal Analytics', html, null);
      }

      function renderProfileView(user) {
        var html = '<div class="neu-raised rounded-[22px] p-6 max-w-xl space-y-4">' +
          '<h2 class="text-lg font-bold text-brand-green">Profile Settings</h2>' +
          '<div><label for="prof-name-in" class="block text-xs font-bold text-muted mb-1">Full Name</label>' +
          '<input id="prof-name-in" type="text" value="' + escapeHtml(user.full_name) + '" class="w-full rounded-xl px-3.5 py-2.5 text-sm"/></div>' +
          '<div><label for="prof-phone-in" class="block text-xs font-bold text-muted mb-1">Phone Number</label>' +
          '<input id="prof-phone-in" type="tel" value="' + escapeHtml(user.phone || '') + '" class="w-full rounded-xl px-3.5 py-2.5 text-sm"/></div>' +
          '<label class="neu-inset flex items-center gap-2.5 rounded-xl p-3.5 text-xs font-semibold text-surface cursor-pointer">' +
            '<input id="prof-optin-in" type="checkbox" ' + (user.show_first_name_publicly ? 'checked' : '') + ' class="h-4 w-4 accent-[#124E4B]"/>' +
            '<span>Show my first name on approved public reports (otherwise "Community member")</span>' +
          '</label>' +
          '<button type="button" data-action="save-profile" class="btn-primary rounded-full px-6 py-2.5 text-xs font-bold">Save Profile</button>' +
        '</div>';
        return renderAppShell(user, 'My Profile', html, null);
      }

      function renderNotificationsView(user) {
        var list = db.notifications.filter(function (n) { return n.user_id === user.id; });
        var itemsHtml = '';
        if (list.length === 0) {
          itemsHtml = '<div class="neu-raised rounded-2xl p-8 text-center text-xs text-muted">No notifications yet.</div>';
        } else {
          for (var i = 0; i < list.length; i++) {
            var n = list[i];
            itemsHtml += '<div class="' + (n.is_read ? 'neu-inset' : 'neu-raised') + ' rounded-2xl p-4 flex items-center justify-between gap-4">' +
              '<div><p class="text-xs font-bold text-surface">' + escapeHtml(n.title) + ' · <span class="text-muted">' + formatDate(n.created_at) + '</span></p>' +
              '<p class="text-xs text-muted mt-1">' + escapeHtml(n.message) + '</p></div>' +
              (n.report_id ? '<button type="button" data-action="open-report" data-id="' + n.report_id + '" class="btn-primary rounded-full px-4 py-1.5 text-xs font-bold shrink-0">View Report</button>' : '') +
            '</div>';
          }
        }
        return renderAppShell(user, 'Notifications', '<div class="space-y-3">' + itemsHtml + '</div>', null);
      }

      function renderAdminUsersView(user) {
        var rows = '';
        for (var i = 0; i < db.profiles.length; i++) {
          var p = db.profiles[i];
          rows += '<tr class="border-b border-surface"><td class="px-4 py-3 text-xs font-bold">' + escapeHtml(p.full_name) + '</td><td class="px-4 py-3 text-xs text-muted">' + escapeHtml(p.email) + '</td><td class="px-4 py-3 text-xs font-bold">' + escapeHtml(p.role) + '</td></tr>';
        }
        var html = '<div class="neu-raised rounded-2xl overflow-hidden"><table class="w-full text-left"><thead class="bg-rail text-xs font-bold uppercase"><tr><th class="px-4 py-3">Name</th><th class="px-4 py-3">Email</th><th class="px-4 py-3">Role (Locked by Trigger)</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        return renderAppShell(user, 'Registered Users (Read-Only)', html, null);
      }

      // =========================================================================
      // 13. RENDER ENGINE WITH FOCUS PRESERVATION
      // =========================================================================
      function renderApp() {
        var activeEl = document.activeElement;
        var activeId = activeEl && activeEl.id ? activeEl.id : null;
        var selStart = activeEl && typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null;

        cleanupVisualInstances();
        var root = document.getElementById('app-root');
        if (!root) return;

        var user = getCurrentUser() || db.profiles[0];

        if (state.route === 'landing') {
          root.innerHTML = renderLandingView(user);
        } else if (state.route === 'login' || state.route === 'register' || state.route === 'forgot-password') {
          root.innerHTML = renderAuthView(state.route);
        } else if (state.route === 'dashboard') {
          root.innerHTML = renderCitizenDashboard(user);
        } else if (state.route === 'report-new') {
          root.innerHTML = renderReportWizardView(user);
        } else if (state.route === 'reports') {
          root.innerHTML = renderCitizenReportsList(user);
        } else if (state.route === 'report-detail') {
          root.innerHTML = renderReportDetailView(user, state.selectedReportId, false);
        } else if (state.route === 'explore') {
          root.innerHTML = renderExploreView(user);
        } else if (state.route === 'explore-detail') {
          root.innerHTML = renderReportDetailView(user, state.selectedReportId, false);
        } else if (state.route === 'profile' || state.route === 'admin-settings') {
          root.innerHTML = renderProfileView(user);
        } else if (state.route === 'notifications') {
          root.innerHTML = renderNotificationsView(user);
        } else if (state.route === 'admin-overview') {
          root.innerHTML = renderAdminOverview(user);
        } else if (state.route === 'admin-complaints') {
          root.innerHTML = renderAdminComplaintsTable(user);
        } else if (state.route === 'admin-complaint-detail') {
          root.innerHTML = renderReportDetailView(user, state.selectedReportId, true);
        } else if (state.route === 'admin-analytics') {
          root.innerHTML = renderAdminAnalyticsView(user);
        } else if (state.route === 'admin-users') {
          root.innerHTML = renderAdminUsersView(user);
        } else {
          root.innerHTML = renderCitizenDashboard(user);
        }

        mountChartsAndMaps(user);

        // Restore text input focus cleanly when typing in live search filters
        if (activeId) {
          var restored = document.getElementById(activeId);
          if (restored && typeof restored.focus === 'function') {
            restored.focus();
            if (selStart !== null && typeof restored.setSelectionRange === 'function') {
              try { restored.setSelectionRange(selStart, selStart); } catch (e) {}
            }
          }
        }
      }

      function mountChartsAndMaps(user) {
        ['citizen-donut-chart', 'admin-donut-chart', 'analytics-donut-chart'].forEach(function (cid) {
          var canvas = document.getElementById(cid);
          if (!canvas || typeof Chart === 'undefined') return;
          var list = cid === 'citizen-donut-chart'
            ? db.reports.filter(function (r) { return r.user_id === user.id; })
            : db.reports;
          if (list.length === 0) return;
          var statuses = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
          var dataVals = statuses.map(function (st) {
            return list.filter(function (r) { return r.status === st; }).length;
          });
          var colors = statuses.map(function (st) { return STATUS_META[st].color; });
          var labels = statuses.map(function (st) { return STATUS_META[st].label; });

          var inst = new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{ data: dataVals, backgroundColor: colors, borderWidth: 2 }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: { legend: { display: false } }
            }
          });
          activeChartInstances.push(inst);
        });

        var catCanvas = document.getElementById('analytics-category-chart');
        if (catCanvas && typeof Chart !== 'undefined') {
          var catKeys = Object.keys(CATEGORIES);
          var catLabels = catKeys.map(function (k) { return CATEGORIES[k]; });
          var catCounts = catKeys.map(function (k) {
            return db.reports.filter(function (r) { return r.category === k; }).length;
          });
          var barInst = new Chart(catCanvas, {
            type: 'bar',
            data: {
              labels: catLabels,
              datasets: [{ label: 'Reports', data: catCounts, backgroundColor: CHART_PALETTE, borderRadius: 6 }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
            }
          });
          activeChartInstances.push(barInst);
        }

        if (state.route === 'report-new' && state.wizard.step === 3) {
          initLeafletMap('wizard-leaflet-map', state.wizard.latitude, state.wizard.longitude, true, function (lat, lng) {
            state.wizard.latitude = lat;
            state.wizard.longitude = lng;
            var latIn = document.getElementById('wiz-lat');
            var lngIn = document.getElementById('wiz-lng');
            if (latIn) latIn.value = String(lat);
            if (lngIn) lngIn.value = String(lng);
          });
        }

        if (state.route === 'report-detail' || state.route === 'admin-complaint-detail' || state.route === 'explore-detail') {
          var rep = null;
          for (var i = 0; i < db.reports.length; i++) {
            if (db.reports[i].id === state.selectedReportId) {
              rep = db.reports[i];
              break;
            }
          }
          if (rep) {
            initLeafletMap('detail-leaflet-map', rep.latitude, rep.longitude, false);
          }
        }
      }

      // =========================================================================
      // 14. EVENT HANDLERS
      // =========================================================================
      function syncWizardStepInputs() {
        var w = state.wizard;
        if (w.step === 1) {
          var t = document.getElementById('wiz-title');
          var c = document.getElementById('wiz-category');
          var p = document.getElementById('wiz-priority');
          var d = document.getElementById('wiz-desc');
          if (t) w.title = t.value;
          if (c) w.category = c.value;
          if (p) w.prioritySuggestion = p.value;
          if (d) w.description = d.value;
        } else if (w.step === 3) {
          var la = document.getElementById('wiz-lat');
          var ln = document.getElementById('wiz-lng');
          var ad = document.getElementById('wiz-address');
          var sq = document.getElementById('wiz-nominatim-q');
          if (la) w.latitude = parseFloat(la.value) || 0;
          if (ln) w.longitude = parseFloat(ln.value) || 0;
          if (ad) w.address = ad.value;
          if (sq) w.searchQuery = sq.value;
        }
      }

      function processUploadedFiles(files) {
        if (!files || files.length === 0) return;
        if (state.wizard.photos.length + files.length > 5) {
          showToast('You can upload at most 5 photos per report.', 'error');
          return;
        }
        Array.from(files).forEach(function (file) {
          if (['image/jpeg', 'image/png', 'image/webp'].indexOf(file.type) === -1) {
            showToast(file.name + ': Only JPEG, PNG, and WebP are permitted.', 'error');
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            showToast(file.name + ' exceeds 5 MB limit.', 'error');
            return;
          }
          var reader = new FileReader();
          reader.onload = function (ev) {
            var uint8 = new Uint8Array(ev.target.result);
            if (!verifyMagicBytes(uint8, file.type)) {
              showToast(file.name + ' failed binary magic-byte signature validation.', 'error');
              return;
            }
            var urlReader = new FileReader();
            urlReader.onload = function (uEv) {
              state.wizard.photos.push({
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: uEv.target.result
              });
              showToast(file.name + ' verified and attached.', 'success');
              window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        window.__deferredInstallPrompt = e;
      });
      renderApp();
            };
            urlReader.readAsDataURL(file);
          };
          reader.readAsArrayBuffer(file);
        });
      }

      var pendingConfirmCallback = null;

      function openConfirmModal(message, onConfirm) {
        pendingConfirmCallback = onConfirm;
        document.getElementById('confirm-modal-message').textContent = message;
        document.getElementById('confirm-modal').classList.remove('hidden');
      }

      document.getElementById('confirm-modal-cancel').addEventListener('click', function () {
        pendingConfirmCallback = null;
        document.getElementById('confirm-modal').classList.add('hidden');
      });

      document.getElementById('confirm-modal-proceed').addEventListener('click', function () {
        document.getElementById('confirm-modal').classList.add('hidden');
        if (typeof pendingConfirmCallback === 'function') {
          var cb = pendingConfirmCallback;
          pendingConfirmCallback = null;
          cb();
        }
      });

      document.getElementById('close-supabase-modal').addEventListener('click', function () {
        document.getElementById('supabase-modal').classList.add('hidden');
      });

      document.getElementById('save-supabase-btn').addEventListener('click', function () {
        var url = document.getElementById('sb-url-input').value.trim();
        var key = document.getElementById('sb-key-input').value.trim();
        state.supabaseConfig = { url: url, anonKey: key };
        safeSetStorage('civicfix_sb_cfg', state.supabaseConfig);
        document.getElementById('supabase-modal').classList.add('hidden');
        showToast('Supabase configuration saved.', 'success');
      });

      document.getElementById('disconnect-supabase-btn').addEventListener('click', function () {
        state.supabaseConfig = { url: '', anonKey: '' };
        safeSetStorage('civicfix_sb_cfg', state.supabaseConfig);
        document.getElementById('supabase-modal').classList.add('hidden');
        showToast('Credentials cleared.', 'success');
      });

      document.getElementById('close-lightbox-btn').addEventListener('click', function () {
        document.getElementById('lightbox-modal').classList.add('hidden');
      });

      document.addEventListener('dragover', function (e) {
        if (e.target && e.target.closest && e.target.closest('#wiz-dropzone')) {
          e.preventDefault();
        }
      });

      document.addEventListener('drop', function (e) {
        if (e.target && e.target.closest && e.target.closest('#wiz-dropzone')) {
          e.preventDefault();
          processUploadedFiles(e.dataTransfer.files);
        }
      });

      document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');

        if (action === 'nav') {
          syncWizardStepInputs();
          state.route = btn.getAttribute('data-route');
          state.mobileDrawerOpen = false;
          state.notifDropdownOpen = false;
          renderApp();
        } else if (action === 'explore-category') {
          state.exploreFilter.category = btn.getAttribute('data-category') || '';
          state.route = 'explore';
          renderApp();
        } else if (action === 'toggle-explore-view') {
          state.exploreFilter.view = state.exploreFilter.view === 'grid' ? 'list' : 'grid';
          renderApp();
        } else if (action === 'clear-explore-filters') {
          state.exploreFilter = { q: '', category: '', status: '', area: '', sort: 'newest', view: 'grid', page: 1 };
          renderApp();
        } else if (action === 'clear-citizen-filters') {
          state.citizenFilter = { q: '', category: '', status: '', sort: 'newest', page: 1 };
          renderApp();
        } else if (action === 'set-theme') {
          state.theme = btn.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
          applyTheme();
          renderApp();
        } else if (action === 'switch-role') {
          var role = btn.getAttribute('data-role');
          if (role === 'ADMIN') {
            state.currentUserId = 'usr-admin-1';
            state.route = 'admin-overview';
            showToast('Signed in as Municipal Administrator.', 'success');
          } else {
            state.currentUserId = 'usr-citizen-1';
            state.route = 'dashboard';
            showToast('Signed in as Citizen.', 'success');
          }
          safeSetStorage('civicfix_session_uid', state.currentUserId);
          renderApp();
        } else if (action === 'auth-login-submit') {
          var em = (document.getElementById('auth-login-email') || {}).value || '';
          var matched = db.profiles.find(function (p) { return p.email.toLowerCase() === em.trim().toLowerCase(); });
          if (!matched) {
            showToast('Invalid email or password.', 'error');
            return;
          }
          state.currentUserId = matched.id;
          safeSetStorage('civicfix_session_uid', matched.id);
          state.route = matched.role === 'ADMIN' ? 'admin-overview' : 'dashboard';
          showToast('Welcome back, ' + matched.full_name + '!', 'success');
          renderApp();
        } else if (action === 'auth-register-submit') {
          var rName = ((document.getElementById('auth-reg-name') || {}).value || '').trim();
          var rEmail = ((document.getElementById('auth-reg-email') || {}).value || '').trim();
          var rPass = (document.getElementById('auth-reg-pass') || {}).value || '';
          if (rName.length < 2 || rEmail.indexOf('@') === -1 || rPass.length < 8) {
            showToast('Please enter a valid name, email, and 8+ character password.', 'error');
            return;
          }
          var newId = 'usr-citizen-' + Date.now();
          db.profiles.push({
            id: newId,
            full_name: rName,
            email: rEmail,
            phone: '',
            password_hash: rPass,
            role: 'CITIZEN',
            show_first_name_publicly: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          persistDb();
          state.currentUserId = newId;
          safeSetStorage('civicfix_session_uid', newId);
          state.route = 'dashboard';
          showToast('Citizen account created!', 'success');
          renderApp();
        } else if (action === 'auth-forgot-submit') {
          showToast('If an account exists for that email, a reset link has been sent.', 'success');
          state.route = 'login';
          renderApp();
        } else if (action === 'toggle-mobile-drawer') {
          state.mobileDrawerOpen = !state.mobileDrawerOpen;
          renderApp();
        } else if (action === 'toggle-notif-dropdown') {
          state.notifDropdownOpen = !state.notifDropdownOpen;
          renderApp();
        } else if (action === 'install-pwa-app') {
          if (window.__deferredInstallPrompt) {
            window.__deferredInstallPrompt.prompt();
            window.__deferredInstallPrompt.userChoice.then(function () {
              window.__deferredInstallPrompt = null;
            });
          } else {
            showToast('To install CivicFix as an app: open your browser menu and select "Install App" or "Add to Home Screen".', 'success');
          }
        } else if (action === 'open-supabase-modal') {
          document.getElementById('sb-url-input').value = state.supabaseConfig.url || '';
          document.getElementById('sb-key-input').value = state.supabaseConfig.anonKey || '';
          document.getElementById('supabase-modal').classList.remove('hidden');
        } else if (action === 'wizard-next') {
          syncWizardStepInputs();
          var w = state.wizard;
          if (w.step === 1) {
            if (w.title.trim().length < 5) {
              showToast('Title must be at least 5 characters.', 'error');
              return;
            }
            if (w.description.trim().length < 15) {
              showToast('Description must be at least 15 characters.', 'error');
              return;
            }
          }
          if (w.step === 3) {
            if (w.latitude < -90 || w.latitude > 90 || w.longitude < -180 || w.longitude > 180) {
              showToast('Coordinates must be within valid latitude/longitude bounds.', 'error');
              return;
            }
            if (w.address.trim().length < 3) {
              showToast('Please enter a street address or landmark.', 'error');
              return;
            }
          }
          w.step = Math.min(4, w.step + 1);
          renderApp();
        } else if (action === 'wizard-prev') {
          syncWizardStepInputs();
          state.wizard.step = Math.max(1, state.wizard.step - 1);
          renderApp();
        } else if (action === 'add-verified-evidence-photo') {
          if (state.wizard.photos.length >= 5) {
            showToast('Maximum 5 photos allowed per report.', 'error');
            return;
          }
          var count = state.wizard.photos.length + 1;
          var svgData = createCivicEvidenceSvg('#6C151E', CATEGORIES[state.wizard.category] + ' — Evidence #' + count);
          state.wizard.photos.push({
            name: 'evidence-' + count + '.jpg',
            size: 184320,
            type: 'image/jpeg',
            dataUrl: svgData
          });
          showToast('Sample evidence photo attached.', 'success');
          renderApp();
        } else if (action === 'remove-wizard-photo') {
          var idx = parseInt(btn.getAttribute('data-idx'), 10);
          state.wizard.photos.splice(idx, 1);
          renderApp();
        } else if (action === 'detect-gps') {
          syncWizardStepInputs();
          if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser.', 'error');
            return;
          }
          navigator.geolocation.getCurrentPosition(
            function (pos) {
              state.wizard.latitude = Number(pos.coords.latitude.toFixed(6));
              state.wizard.longitude = Number(pos.coords.longitude.toFixed(6));
              showToast('GPS coordinates detected.', 'success');
              renderApp();
            },
            function () {
              showToast('Location permission denied. Click or drag the map pin manually.', 'error');
            },
            { timeout: 8000 }
          );
        } else if (action === 'nominatim-search') {
          syncWizardStepInputs();
          var q = state.wizard.searchQuery.trim();
          if (q.length < 3) {
            showToast('Enter at least 3 characters to search.', 'error');
            return;
          }
          try {
            fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q))
              .then(function (r) { return r.json(); })
              .then(function (arr) {
                if (arr && arr[0]) {
                  state.wizard.latitude = Number(parseFloat(arr[0].lat).toFixed(6));
                  state.wizard.longitude = Number(parseFloat(arr[0].lon).toFixed(6));
                  state.wizard.address = arr[0].display_name;
                  showToast('Map centered on searched location.', 'success');
                  renderApp();
                } else {
                  showToast('No matching address found.', 'error');
                }
              })
              .catch(function () {
                showToast('Address search unavailable; click the map directly to place pin.', 'error');
              });
          } catch (err) {
            showToast('Address search unavailable; click the map directly to place pin.', 'error');
          }
        } else if (action === 'wizard-submit') {
          try {
            var created = txSubmitReport(getCurrentUser(), state.wizard);
            state.wizard = {
              step: 1,
              idempotencyKey: 'cf-idem-' + Date.now(),
              title: '',
              category: 'ROAD_DAMAGE',
              description: '',
              prioritySuggestion: 'MEDIUM',
              photos: [],
              latitude: 25.7439,
              longitude: 89.2752,
              address: 'Station Road, Rangpur',
              searchQuery: ''
            };
            state.selectedReportId = created.id;
            state.route = 'report-detail';
            showToast('Report ' + created.complaint_number + ' submitted!', 'success');
            renderApp();
          } catch (err) {
            showToast(err.message || 'Submission failed.', 'error');
          }
        } else if (action === 'open-report') {
          var repId = btn.getAttribute('data-id');
          if (!repId) return;
          state.selectedReportId = repId;
          state.notifDropdownOpen = false;
          state.route = 'report-detail';
          renderApp();
        } else if (action === 'open-public-report') {
          state.selectedReportId = btn.getAttribute('data-id');
          state.route = 'explore-detail';
          renderApp();
        } else if (action === 'open-admin-report') {
          state.selectedReportId = btn.getAttribute('data-id');
          state.route = 'admin-complaint-detail';
          renderApp();
        } else if (action === 'admin-save-workflow') {
          var rId = btn.getAttribute('data-id');
          var stEl = document.getElementById('adm-status');
          var prEl = document.getElementById('adm-priority');
          var pubEl = document.getElementById('adm-public');
          var cmEl = document.getElementById('adm-comment');
          if (!stEl || !prEl || !pubEl || !cmEl) return;

          var nextSt = stEl.value;
          var nextPr = prEl.value;
          var nextPub = pubEl.checked;
          var nextCm = cmEl.value;
          var existing = db.reports.find(function (x) { return x.id === rId; });
          if (!existing) return;

          var runUpdate = function () {
            try {
              txAdminUpdateWorkflow(getCurrentUser(), rId, nextSt, nextPr, nextPub, nextCm);
              showToast('Updated ' + existing.complaint_number + ' and notified citizen.', 'success');
              renderApp();
            } catch (err) {
              showToast(err.message || 'Failed to update workflow.', 'error');
            }
          };

          if (nextSt === 'REJECTED' && existing.status !== 'REJECTED') {
            openConfirmModal('Reject complaint ' + existing.complaint_number + '? The citizen will be notified immediately.', runUpdate);
          } else if (existing.is_public && !nextPub) {
            openConfirmModal('Revoke public visibility for ' + existing.complaint_number + '?', runUpdate);
          } else {
            runUpdate();
          }
        } else if (action === 'mark-notif-read') {
          var nId = btn.getAttribute('data-id');
          for (var i = 0; i < db.notifications.length; i++) {
            if (db.notifications[i].id === nId) db.notifications[i].is_read = true;
          }
          persistDb();
          renderApp();
        } else if (action === 'mark-all-notifs-read') {
          var u = getCurrentUser();
          for (var j = 0; j < db.notifications.length; j++) {
            if (db.notifications[j].user_id === u.id) db.notifications[j].is_read = true;
          }
          persistDb();
          renderApp();
        } else if (action === 'save-profile') {
          var uProf = getCurrentUser();
          var nm = document.getElementById('prof-name-in');
          var ph = document.getElementById('prof-phone-in');
          var op = document.getElementById('prof-optin-in');
          if (uProf && nm && ph && op) {
            uProf.full_name = nm.value.trim() || uProf.full_name;
            uProf.phone = ph.value.trim();
            uProf.show_first_name_publicly = op.checked;
            persistDb();
            showToast('Profile saved!', 'success');
            renderApp();
          }
        } else if (action === 'open-lightbox') {
          var src = btn.getAttribute('data-src');
          var lbImg = document.getElementById('lightbox-img');
          var lbModal = document.getElementById('lightbox-modal');
          if (lbImg && lbModal && src) {
            lbImg.src = src;
            lbModal.classList.remove('hidden');
          }
        } else if (action === 'logout') {
          state.route = 'login';
          showToast('Signed out.', 'success');
          renderApp();
        }
      });

      document.addEventListener('change', function (e) {
        var id = e.target && e.target.id;
        if (id === 'wiz-photo-input') {
          processUploadedFiles(e.target.files);
        } else if (id === 'cit-filter-cat' || id === 'cit-filter-status' || id === 'cit-filter-sort') {
          state.citizenFilter.category = (document.getElementById('cit-filter-cat') || {}).value || '';
          state.citizenFilter.status = (document.getElementById('cit-filter-status') || {}).value || '';
          state.citizenFilter.sort = (document.getElementById('cit-filter-sort') || {}).value || 'newest';
          renderApp();
        } else if (id === 'exp-filter-cat' || id === 'exp-filter-status' || id === 'exp-filter-sort') {
          state.exploreFilter.category = (document.getElementById('exp-filter-cat') || {}).value || '';
          state.exploreFilter.status = (document.getElementById('exp-filter-status') || {}).value || '';
          state.exploreFilter.sort = (document.getElementById('exp-filter-sort') || {}).value || 'newest';
          renderApp();
        } else if (id === 'adm-filter-cat' || id === 'adm-filter-status' || id === 'adm-filter-priority') {
          state.adminFilter.category = (document.getElementById('adm-filter-cat') || {}).value || '';
          state.adminFilter.status = (document.getElementById('adm-filter-status') || {}).value || '';
          state.adminFilter.priority = (document.getElementById('adm-filter-priority') || {}).value || '';
          renderApp();
        } else if (id === 'adm-status') {
          var val = e.target.value;
          var pubCheckbox = document.getElementById('adm-public');
          if (pubCheckbox && (val === 'UNDER_REVIEW' || val === 'IN_PROGRESS' || val === 'RESOLVED')) {
            pubCheckbox.checked = true;
          }
        }
      });

      document.addEventListener('input', function (e) {
        var id = e.target && e.target.id;
        if (id === 'cit-filter-q') {
          state.citizenFilter.q = e.target.value;
          renderApp();
        } else if (id === 'exp-filter-q') {
          state.exploreFilter.q = e.target.value;
          renderApp();
        } else if (id === 'exp-filter-area') {
          state.exploreFilter.area = e.target.value;
          renderApp();
        } else if (id === 'adm-filter-q') {
          state.adminFilter.q = e.target.value;
          renderApp();
        }
      });

      renderApp();
})();
