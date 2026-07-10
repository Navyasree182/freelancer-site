/**
 * script.js – Freelance Marketplace Platform
 * All Fetch API calls and DOM logic for 7 frontend pages.
 *
 * Page detection: we read window.location.pathname to determine which
 * page-specific init function to run on DOMContentLoaded.
 */

'use strict';

// Page URL map (works when served by Django)
const PAGES = {
  home:      '/app/',
  login:     '/app/login/',
  register:  '/app/register/',
  projects:  '/app/projects/',
  bids:      '/app/bids/',
  contracts: '/app/contracts/',
  dashboard: '/app/dashboard/',
};

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = 'http://127.0.0.1:8000';

// ─────────────────────────────────────────────────────────────────────────────
// Fetch helpers
// ─────────────────────────────────────────────────────────────────────────────
async function apiGet(path, params = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(path, data) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function apiPut(path, data) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(API_BASE + path, { method: 'DELETE' });
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast notifications
// ─────────────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav helper – highlight current page link
// ─────────────────────────────────────────────────────────────────────────────
function highlightNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab helper
// ─────────────────────────────────────────────────────────────────────────────
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const btns  = container.querySelectorAll('.tab-btn');
  const panes = container.querySelectorAll('.tab-pane');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      const pane = container.querySelector(`#${target}`);
      if (pane) pane.classList.add('active');
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal helpers
// ─────────────────────────────────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge helper
// ─────────────────────────────────────────────────────────────────────────────
function badgeFor(status) {
  const map = {
    'Pending':     'pending',
    'Accepted':    'accepted',
    'Rejected':    'rejected',
    'Open':        'open',
    'In Progress': 'progress',
    'Completed':   'completed',
    'Active':      'active',
    'Cancelled':   'cancelled',
  };
  const cls = map[status] || 'pending';
  return `<span class="badge badge-${cls}">${status}</span>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Avatar initials helper
// ─────────────────────────────────────────────────────────────────────────────
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// ──────────────────────────  HOME PAGE  ─────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
async function initHome() {
  highlightNav();

  // Stats
  try {
    const stats = await apiGet('/stats/');
    setEl('stat-freelancers', stats.freelancers ?? '–');
    setEl('stat-projects',    stats.projects    ?? '–');
    setEl('stat-clients',     stats.clients     ?? '–');
    setEl('stat-contracts',   stats.contracts   ?? '–');
  } catch (_) { /* server may not be running */ }

  // Featured freelancers
  try {
    const freelancers = await apiGet('/freelancers/');
    renderFeaturedFreelancers(freelancers.slice(0, 3));
  } catch (_) {}

  // Featured projects
  try {
    const projects = await apiGet('/projects/');
    renderFeaturedProjects(projects.slice(0, 3));
  } catch (_) {}
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderFeaturedFreelancers(list) {
  const grid = document.getElementById('featured-freelancers');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">No freelancers yet.</p>';
    return;
  }
  grid.innerHTML = list.map(f => `
    <div class="card freelancer-card">
      <div class="freelancer-header">
        <div class="avatar">${initials(f.full_name)}</div>
        <div class="freelancer-info">
          <h3>${f.full_name}</h3>
          <p>⭐ ${f.experience} yr${f.experience !== 1 ? 's' : ''} exp · ₹${f.hourly_rate}/hr</p>
        </div>
      </div>
      <div class="skill-tags">
        ${(f.skills || '').split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
      </div>
      <div class="card-footer">
        <span class="text-gradient" style="font-weight:700">₹${f.hourly_rate}/hr</span>
        <a href="dashboard.html" class="btn btn-ghost btn-sm">View Profile</a>
      </div>
    </div>
  `).join('');
}

function renderFeaturedProjects(list) {
  const grid = document.getElementById('featured-projects');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">No projects yet.</p>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="card-meta">
        <span>📁 ${p.category || 'General'}</span>
        ${badgeFor(p.status || 'Open')}
      </div>
      <div class="card-title">${p.project_title}</div>
      <div class="card-body">${(p.description || '').slice(0, 100)}…</div>
      <div class="card-footer">
        <span style="color:var(--gold-400);font-weight:700">₹${p.budget?.toLocaleString()}</span>
        <a href="bids.html" class="btn btn-primary btn-sm">Bid Now</a>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ──────────────────────────  LOGIN PAGE  ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function initLogin() {
  highlightNav();
  // Simple demo login — stores role in localStorage
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const role  = document.getElementById('login-role').value;
    if (!email) { showToast('Please enter your email.', 'error'); return; }
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole',  role);
    showToast('Login successful! Redirecting…', 'success');
    setTimeout(() => { location.href = PAGES.dashboard; }, 1200);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ──────────────────────── REGISTER PAGE ─────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function initRegister() {
  highlightNav();
  initTabs('#register-page');

  // Freelancer registration
  const fForm = document.getElementById('freelancer-form');
  if (fForm) {
    fForm.addEventListener('submit', async e => {
      e.preventDefault();
      const imageFile = document.getElementById('f-image')?.files[0];
      let profile_image = '';
      if (imageFile) profile_image = await fileToBase64(imageFile);

      const data = {
        full_name:     val('f-name'),
        email:         val('f-email'),
        phone:         val('f-phone'),
        skills:        val('f-skills'),
        experience:    Number(val('f-exp')),
        hourly_rate:   Number(val('f-rate')),
        profile_image,
      };
      try {
        const res = await apiPost('/freelancers/add/', data);
        if (res.freelancer_id) {
          showToast(`Freelancer registered! ID: ${res.freelancer_id}`, 'success');
          fForm.reset();
        } else {
          showToast(res.error || 'Registration failed.', 'error');
        }
      } catch (_) { showToast('Could not reach server.', 'error'); }
    });
  }

  // Client registration
  const cForm = document.getElementById('client-form');
  if (cForm) {
    cForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        company_name:   val('c-company'),
        contact_person: val('c-contact'),
        email:          val('c-email'),
        phone:          val('c-phone'),
        location:       val('c-location'),
      };
      try {
        const res = await apiPost('/clients/add/', data);
        if (res.client_id) {
          showToast(`Client registered! ID: ${res.client_id}`, 'success');
          cForm.reset();
        } else {
          showToast(res.error || 'Registration failed.', 'error');
        }
      } catch (_) { showToast('Could not reach server.', 'error'); }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────  PROJECTS PAGE  ──────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
let allProjects = [];

async function initProjects() {
  highlightNav();
  await loadProjects();

  // Search & filter
  document.getElementById('proj-search')?.addEventListener('input', filterProjects);
  document.getElementById('proj-category')?.addEventListener('change', filterProjects);
  document.getElementById('proj-status')?.addEventListener('change', filterProjects);

  // Post project form
  const form = document.getElementById('post-project-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        project_title: val('proj-title'),
        description:   val('proj-desc'),
        category:      val('proj-cat'),
        budget:        Number(val('proj-budget')),
        deadline:      val('proj-deadline'),
        client_name:   val('proj-client'),
        status:        val('proj-pstatus') || 'Open',
      };
      try {
        const res = await apiPost('/projects/add/', data);
        if (res.project_id) {
          showToast(`Project posted! ID: ${res.project_id}`, 'success');
          form.reset();
          closeModal('project-modal');
          await loadProjects();
        } else {
          showToast(res.error || 'Failed to post project.', 'error');
        }
      } catch (_) { showToast('Could not reach server.', 'error'); }
    });
  }
}

async function loadProjects() {
  try {
    allProjects = await apiGet('/projects/');
    renderProjects(allProjects);
  } catch (_) {
    document.getElementById('projects-grid').innerHTML =
      '<div class="empty-state"><div class="empty-icon">🔌</div><h3>Server offline</h3><p>Start the Django server to load projects.</p></div>';
  }
}

function filterProjects() {
  const search   = (document.getElementById('proj-search')?.value   || '').toLowerCase();
  const category = document.getElementById('proj-category')?.value || '';
  const status   = document.getElementById('proj-status')?.value   || '';

  const filtered = allProjects.filter(p => {
    const matchSearch   = !search   || p.project_title.toLowerCase().includes(search) || (p.description||'').toLowerCase().includes(search);
    const matchCategory = !category || p.category === category;
    const matchStatus   = !status   || p.status   === status;
    return matchSearch && matchCategory && matchStatus;
  });
  renderProjects(filtered);
}

function renderProjects(list) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><h3>No projects found</h3><p>Try adjusting your filters.</p></div>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="card-meta">
        📁 ${p.category || 'General'} &nbsp;·&nbsp; 🏢 ${p.client_name || '—'}
        &nbsp; ${badgeFor(p.status || 'Open')}
      </div>
      <div class="card-title">${p.project_title}</div>
      <div class="card-body">${p.description || ''}</div>
      <div class="card-meta">📅 Deadline: ${p.deadline || '—'}</div>
      <div class="card-footer">
        <span style="color:var(--gold-400);font-weight:700;font-size:1.1rem">₹${(p.budget||0).toLocaleString()}</span>
        <div style="display:flex;gap:.5rem">
          <button class="btn btn-primary btn-sm" onclick="openBidModal('${p.project_title}')">Bid Now</button>
          <button class="btn btn-ghost btn-sm" onclick="openEditProject(${p.project_id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.project_id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  try {
    const res = await apiDelete(`/projects/delete/${id}/`);
    showToast(res.message || 'Deleted.', 'success');
    await loadProjects();
  } catch (_) { showToast('Error deleting project.', 'error'); }
}

function openBidModal(title) {
  const el = document.getElementById('bid-project-title');
  if (el) el.value = title;
  location.href = `${PAGES.bids}?project=${encodeURIComponent(title)}`;
}

function openEditProject(id) {
  const p = allProjects.find(x => x.project_id === id);
  if (!p) return;
  document.getElementById('edit-proj-id').value      = id;
  document.getElementById('edit-proj-title').value   = p.project_title;
  document.getElementById('edit-proj-desc').value    = p.description;
  document.getElementById('edit-proj-cat').value     = p.category;
  document.getElementById('edit-proj-budget').value  = p.budget;
  document.getElementById('edit-proj-deadline').value= p.deadline;
  document.getElementById('edit-proj-client').value  = p.client_name;
  document.getElementById('edit-proj-status').value  = p.status;
  openModal('edit-project-modal');
}

document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('edit-project-form');
  if (editForm) {
    editForm.addEventListener('submit', async e => {
      e.preventDefault();
      const id   = Number(document.getElementById('edit-proj-id').value);
      const data = {
        project_title: val('edit-proj-title'),
        description:   val('edit-proj-desc'),
        category:      val('edit-proj-cat'),
        budget:        Number(val('edit-proj-budget')),
        deadline:      val('edit-proj-deadline'),
        client_name:   val('edit-proj-client'),
        status:        val('edit-proj-status'),
      };
      try {
        const res = await apiPut(`/projects/update/${id}/`, data);
        showToast(res.message || 'Updated.', 'success');
        closeModal('edit-project-modal');
        await loadProjects();
      } catch (_) { showToast('Error updating project.', 'error'); }
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────── BIDS PAGE  ─────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
let allBids = [];

async function initBids() {
  highlightNav();

  // Pre-fill from URL query param
  const params = new URLSearchParams(location.search);
  const pt = params.get('project');
  if (pt) {
    const el = document.getElementById('bid-project-title');
    if (el) el.value = pt;
  }

  await loadBids();

  const form = document.getElementById('bid-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        project_title:   val('bid-project-title'),
        freelancer_name: val('bid-freelancer'),
        bid_amount:      Number(val('bid-amount')),
        proposal:        val('bid-proposal'),
        status:          'Pending',
      };
      try {
        const res = await apiPost('/bids/add/', data);
        if (res.bid_id) {
          showToast(`Bid submitted! ID: ${res.bid_id}`, 'success');
          form.reset();
          await loadBids();
        } else {
          showToast(res.error || 'Submission failed.', 'error');
        }
      } catch (_) { showToast('Could not reach server.', 'error'); }
    });
  }
}

async function loadBids() {
  try {
    allBids = await apiGet('/bids/');
    renderBids(allBids);
  } catch (_) {}
}

function renderBids(list) {
  const tbody = document.getElementById('bids-table-body');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">No bids found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(b => `
    <tr>
      <td>${b.bid_id}</td>
      <td>${b.project_title}</td>
      <td>${b.freelancer_name}</td>
      <td>₹${(b.bid_amount||0).toLocaleString()}</td>
      <td>${badgeFor(b.status)}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-success btn-sm" onclick="changeBidStatus(${b.bid_id},'Accepted')">Accept</button>
          <button class="btn btn-danger  btn-sm" onclick="changeBidStatus(${b.bid_id},'Rejected')">Reject</button>
          <button class="btn btn-ghost   btn-sm" onclick="deleteBid(${b.bid_id})">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function changeBidStatus(id, status) {
  const bid = allBids.find(b => b.bid_id === id);
  if (!bid) return;
  try {
    const res = await apiPut(`/bids/update/${id}/`, { ...bid, status });
    showToast(res.message || 'Updated.', 'success');
    await loadBids();
  } catch (_) { showToast('Error updating bid.', 'error'); }
}

async function deleteBid(id) {
  if (!confirm('Delete this bid?')) return;
  try {
    const res = await apiDelete(`/bids/delete/${id}/`);
    showToast(res.message || 'Deleted.', 'success');
    await loadBids();
  } catch (_) { showToast('Error.', 'error'); }
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────── CONTRACTS PAGE  ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
let allContracts = [];

async function initContracts() {
  highlightNav();
  await loadContracts();

  const form = document.getElementById('contract-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        project_title:   val('con-project'),
        freelancer_name: val('con-freelancer'),
        client_name:     val('con-client'),
        agreed_budget:   Number(val('con-budget')),
        start_date:      val('con-start'),
        end_date:        val('con-end'),
        contract_status: val('con-status') || 'Active',
      };
      try {
        const res = await apiPost('/contracts/add/', data);
        if (res.contract_id) {
          showToast(`Contract created! ID: ${res.contract_id}`, 'success');
          form.reset();
          closeModal('contract-modal');
          await loadContracts();
        } else {
          showToast(res.error || 'Failed.', 'error');
        }
      } catch (_) { showToast('Could not reach server.', 'error'); }
    });
  }
}

async function loadContracts() {
  try {
    allContracts = await apiGet('/contracts/');
    renderContracts(allContracts);
  } catch (_) {}
}

function renderContracts(list) {
  const tbody = document.getElementById('contracts-table-body');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted)">No contracts found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(c => `
    <tr>
      <td>${c.contract_id}</td>
      <td>${c.project_title}</td>
      <td>${c.freelancer_name}</td>
      <td>${c.client_name}</td>
      <td>₹${(c.agreed_budget||0).toLocaleString()}</td>
      <td>${c.start_date} → ${c.end_date}</td>
      <td>${badgeFor(c.contract_status)}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-ghost   btn-sm" onclick="editContract(${c.contract_id})">Edit</button>
          <button class="btn btn-danger  btn-sm" onclick="deleteContract(${c.contract_id})">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editContract(id) {
  const c = allContracts.find(x => x.contract_id === id);
  if (!c) return;
  document.getElementById('edit-con-id').value         = id;
  document.getElementById('edit-con-project').value    = c.project_title;
  document.getElementById('edit-con-freelancer').value = c.freelancer_name;
  document.getElementById('edit-con-client').value     = c.client_name;
  document.getElementById('edit-con-budget').value     = c.agreed_budget;
  document.getElementById('edit-con-start').value      = c.start_date;
  document.getElementById('edit-con-end').value        = c.end_date;
  document.getElementById('edit-con-status').value     = c.contract_status;
  openModal('edit-contract-modal');
}

document.addEventListener('DOMContentLoaded', () => {
  const ef = document.getElementById('edit-contract-form');
  if (ef) {
    ef.addEventListener('submit', async e => {
      e.preventDefault();
      const id   = Number(document.getElementById('edit-con-id').value);
      const data = {
        project_title:   val('edit-con-project'),
        freelancer_name: val('edit-con-freelancer'),
        client_name:     val('edit-con-client'),
        agreed_budget:   Number(val('edit-con-budget')),
        start_date:      val('edit-con-start'),
        end_date:        val('edit-con-end'),
        contract_status: val('edit-con-status'),
      };
      try {
        const res = await apiPut(`/contracts/update/${id}/`, data);
        showToast(res.message || 'Updated.', 'success');
        closeModal('edit-contract-modal');
        await loadContracts();
      } catch (_) { showToast('Error.', 'error'); }
    });
  }
});

async function deleteContract(id) {
  if (!confirm('Delete this contract?')) return;
  try {
    const res = await apiDelete(`/contracts/delete/${id}/`);
    showToast(res.message || 'Deleted.', 'success');
    await loadContracts();
  } catch (_) { showToast('Error.', 'error'); }
}

// ─────────────────────────────────────────────────────────────────────────────
// ──────────────────────── DASHBOARD PAGE  ───────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
async function initDashboard() {
  highlightNav();
  initTabs('#dashboard-page');

  // Stats
  try {
    const s = await apiGet('/stats/');
    setEl('ds-freelancers', s.freelancers);
    setEl('ds-clients',     s.clients);
    setEl('ds-projects',    s.projects);
    setEl('ds-bids',        s.bids);
    setEl('ds-contracts',   s.contracts);
    setEl('ds-open',        s.open_projects);
    setEl('ds-active-con',  s.active_contracts);
    setEl('ds-pending-bids',s.pending_bids);
  } catch (_) {}

  // Freelancers table
  try {
    const fl = await apiGet('/freelancers/');
    renderFreelancersTable(fl);
  } catch (_) {}

  // Clients table
  try {
    const cl = await apiGet('/clients/');
    renderClientsTable(cl);
  } catch (_) {}

  // Projects mini-list
  try {
    const pr = await apiGet('/projects/');
    renderDashProjects(pr);
  } catch (_) {}

  // Bids mini-list
  try {
    const bi = await apiGet('/bids/');
    renderDashBids(bi);
  } catch (_) {}

  // Contracts mini-list
  try {
    const co = await apiGet('/contracts/');
    renderDashContracts(co);
  } catch (_) {}

  // Freelancer update form
  const fuForm = document.getElementById('update-freelancer-form');
  if (fuForm) {
    fuForm.addEventListener('submit', async e => {
      e.preventDefault();
      const id   = Number(val('uf-id'));
      if (!id) { showToast('Enter a freelancer ID.', 'error'); return; }
      const data = {
        full_name:   val('uf-name'),
        email:       val('uf-email'),
        phone:       val('uf-phone'),
        skills:      val('uf-skills'),
        experience:  Number(val('uf-exp')),
        hourly_rate: Number(val('uf-rate')),
        profile_image: '',
      };
      try {
        const res = await apiPut(`/freelancers/update/${id}/`, data);
        showToast(res.message || 'Updated.', 'success');
        const fl = await apiGet('/freelancers/');
        renderFreelancersTable(fl);
      } catch (_) { showToast('Error.', 'error'); }
    });
  }

  // Client update form
  const cuForm = document.getElementById('update-client-form');
  if (cuForm) {
    cuForm.addEventListener('submit', async e => {
      e.preventDefault();
      const id = Number(val('uc-id'));
      if (!id) { showToast('Enter a client ID.', 'error'); return; }
      const data = {
        company_name:   val('uc-company'),
        contact_person: val('uc-contact'),
        email:          val('uc-email'),
        phone:          val('uc-phone'),
        location:       val('uc-location'),
      };
      try {
        const res = await apiPut(`/clients/update/${id}/`, data);
        showToast(res.message || 'Updated.', 'success');
        const cl = await apiGet('/clients/');
        renderClientsTable(cl);
      } catch (_) { showToast('Error.', 'error'); }
    });
  }

  // Skill search
  document.getElementById('skill-search-btn')?.addEventListener('click', async () => {
    const skill = val('skill-search-input');
    const fl    = await apiGet('/freelancers/', { skill });
    renderFreelancersTable(fl);
    showToast(`Found ${fl.length} freelancer(s) with "${skill}"`, 'info');
  });
}

function renderFreelancersTable(list) {
  const tbody = document.getElementById('freelancers-table-body');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:var(--text-muted)">No freelancers found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(f => `
    <tr>
      <td>${f.freelancer_id}</td>
      <td><div style="display:flex;align-items:center;gap:.75rem">
        ${f.profile_image ? `<img src="${f.profile_image}" class="avatar" style="width:36px;height:36px">` : `<div class="avatar" style="width:36px;height:36px;font-size:.8rem">${initials(f.full_name)}</div>`}
        ${f.full_name}
      </div></td>
      <td>${f.email}</td>
      <td>${f.phone || '—'}</td>
      <td><div class="skill-tags">${(f.skills||'').split(',').map(s=>`<span class="skill-tag">${s.trim()}</span>`).join('')}</div></td>
      <td>${f.experience} yr${f.experience!==1?'s':''}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteFreelancer(${f.freelancer_id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteFreelancer(id) {
  if (!confirm('Delete this freelancer?')) return;
  const res = await apiDelete(`/freelancers/delete/${id}/`);
  showToast(res.message || 'Deleted.', 'success');
  const fl = await apiGet('/freelancers/');
  renderFreelancersTable(fl);
}

function renderClientsTable(list) {
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--text-muted)">No clients found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(c => `
    <tr>
      <td>${c.client_id}</td>
      <td>${c.company_name}</td>
      <td>${c.contact_person || '—'}</td>
      <td>${c.email}</td>
      <td>${c.location || '—'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteClient(${c.client_id})">Delete</button></td>
    </tr>
  `).join('');
}

async function deleteClient(id) {
  if (!confirm('Delete this client?')) return;
  const res = await apiDelete(`/clients/delete/${id}/`);
  showToast(res.message || 'Deleted.', 'success');
  const cl = await apiGet('/clients/');
  renderClientsTable(cl);
}

function renderDashProjects(list) {
  const el = document.getElementById('dash-projects-list');
  if (!el) return;
  el.innerHTML = list.slice(0,5).map(p => `
    <div class="card" style="padding:1rem;margin-bottom:.75rem">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:700">${p.project_title}</div>
          <div style="font-size:.8rem;color:var(--text-secondary)">₹${(p.budget||0).toLocaleString()} · ${p.deadline||'—'}</div>
        </div>
        ${badgeFor(p.status||'Open')}
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No projects yet.</p>';
}

function renderDashBids(list) {
  const el = document.getElementById('dash-bids-list');
  if (!el) return;
  el.innerHTML = list.slice(0,5).map(b => `
    <div class="card" style="padding:1rem;margin-bottom:.75rem">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:700">${b.project_title}</div>
          <div style="font-size:.8rem;color:var(--text-secondary)">${b.freelancer_name} · ₹${(b.bid_amount||0).toLocaleString()}</div>
        </div>
        ${badgeFor(b.status||'Pending')}
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No bids yet.</p>';
}

function renderDashContracts(list) {
  const el = document.getElementById('dash-contracts-list');
  if (!el) return;
  el.innerHTML = list.slice(0,5).map(c => `
    <div class="card" style="padding:1rem;margin-bottom:.75rem">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:700">${c.project_title}</div>
          <div style="font-size:.8rem;color:var(--text-secondary)">${c.freelancer_name} ↔ ${c.client_name}</div>
        </div>
        ${badgeFor(c.contract_status||'Active')}
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No contracts yet.</p>';
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────
function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Router – run page init on load
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.replace(/\/$/, ''); // strip trailing slash

  // Works both when served by Django (/app/...) and opened as file:// (index.html)
  if (path === '/app'         || path.endsWith('index.html')    || path === '') initHome();
  if (path === '/app/login'   || path.endsWith('login.html'))                   initLogin();
  if (path === '/app/register'|| path.endsWith('register.html'))                initRegister();
  if (path === '/app/projects'|| path.endsWith('projects.html'))                initProjects();
  if (path === '/app/bids'    || path.endsWith('bids.html'))                    initBids();
  if (path === '/app/contracts'||path.endsWith('contracts.html'))               initContracts();
  if (path === '/app/dashboard'||path.endsWith('dashboard.html'))               initDashboard();
});
