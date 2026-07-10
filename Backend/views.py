"""
Backend/views.py – All 20 Function-Based View API endpoints (MongoDB / PyMongo).

Every view adds CORS headers so that the HTML/JS frontend (served from
file:// or a different port) can call the API without browser errors.

Module breakdown
────────────────
Freelancers  : get_freelancers, add_freelancer, update_freelancer, delete_freelancer
Clients      : get_clients, add_client, update_client, delete_client
Projects     : get_projects, add_project, update_project, delete_project
Bids         : get_bids, add_bid, update_bid, delete_bid
Contracts    : get_contracts, add_contract, update_contract, delete_contract
Bonus stats  : get_stats
"""
import json
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .db import (
    freelancers_col,
    clients_col,
    projects_col,
    bids_col,
    contracts_col,
    get_next_id,
    to_dict,
)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _cors(response):
    """Attach CORS headers to any response."""
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


def ok(data, status=200):
    """Return a JSON response with CORS headers."""
    return _cors(JsonResponse(data, safe=False, status=status))


def preflight():
    """Return an empty 200 for CORS preflight OPTIONS requests."""
    return _cors(JsonResponse({}))


def body(request) -> dict:
    """Parse the JSON request body; return {} on failure."""
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return {}


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 1 – FREELANCER MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

@csrf_exempt
def get_freelancers(request):
    """GET /freelancers/?skill=<skill>  — list all freelancers (bonus: skill search)."""
    if request.method == 'OPTIONS':
        return preflight()

    query  = {}
    skill  = request.GET.get('skill', '').strip()
    if skill:
        # Case-insensitive substring search on the skills field
        query['skills'] = {'$regex': re.escape(skill), '$options': 'i'}

    rows = [to_dict(doc) for doc in freelancers_col.find(query)]
    return ok(rows)


@csrf_exempt
def add_freelancer(request):
    """POST /freelancers/add/  — register a new freelancer."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'POST':
        return ok({'error': 'Method not allowed'}, 405)

    data = body(request)
    doc  = {
        'freelancer_id' : get_next_id('freelancers'),
        'full_name'     : data.get('full_name', ''),
        'email'         : data.get('email', ''),
        'phone'         : data.get('phone', ''),
        'skills'        : data.get('skills', ''),
        'experience'    : int(data.get('experience', 0)),
        'hourly_rate'   : float(data.get('hourly_rate', 0)),
        'profile_image' : data.get('profile_image', ''),
    }
    freelancers_col.insert_one(doc)
    return ok(
        {'message': 'Freelancer registered successfully',
         'freelancer_id': doc['freelancer_id']},
        201,
    )


@csrf_exempt
def update_freelancer(request, id):
    """PUT /freelancers/update/<id>/  — update freelancer profile."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'PUT':
        return ok({'error': 'Method not allowed'}, 405)

    data = body(request)
    update = {
        'full_name'     : data.get('full_name', ''),
        'email'         : data.get('email', ''),
        'phone'         : data.get('phone', ''),
        'skills'        : data.get('skills', ''),
        'experience'    : int(data.get('experience', 0)),
        'hourly_rate'   : float(data.get('hourly_rate', 0)),
        'profile_image' : data.get('profile_image', ''),
    }
    freelancers_col.update_one({'freelancer_id': id}, {'$set': update})
    return ok({'message': 'Freelancer updated successfully'})


@csrf_exempt
def delete_freelancer(request, id):
    """DELETE /freelancers/delete/<id>/  — remove a freelancer."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'DELETE':
        return ok({'error': 'Method not allowed'}, 405)

    freelancers_col.delete_one({'freelancer_id': id})
    return ok({'message': 'Freelancer deleted successfully'})


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 2 – CLIENT MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

@csrf_exempt
def get_clients(request):
    """GET /clients/  — list all clients."""
    if request.method == 'OPTIONS':
        return preflight()

    rows = [to_dict(doc) for doc in clients_col.find()]
    return ok(rows)


@csrf_exempt
def add_client(request):
    """POST /clients/add/  — register a new client."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'POST':
        return ok({'error': 'Method not allowed'}, 405)

    data = body(request)
    doc  = {
        'client_id'      : get_next_id('clients'),
        'company_name'   : data.get('company_name', ''),
        'contact_person' : data.get('contact_person', ''),
        'email'          : data.get('email', ''),
        'phone'          : data.get('phone', ''),
        'location'       : data.get('location', ''),
    }
    clients_col.insert_one(doc)
    return ok(
        {'message': 'Client registered successfully',
         'client_id': doc['client_id']},
        201,
    )


@csrf_exempt
def update_client(request, id):
    """PUT /clients/update/<id>/  — update client information."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'PUT':
        return ok({'error': 'Method not allowed'}, 405)

    data   = body(request)
    update = {
        'company_name'   : data.get('company_name', ''),
        'contact_person' : data.get('contact_person', ''),
        'email'          : data.get('email', ''),
        'phone'          : data.get('phone', ''),
        'location'       : data.get('location', ''),
    }
    clients_col.update_one({'client_id': id}, {'$set': update})
    return ok({'message': 'Client updated successfully'})


@csrf_exempt
def delete_client(request, id):
    """DELETE /clients/delete/<id>/  — remove a client."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'DELETE':
        return ok({'error': 'Method not allowed'}, 405)

    clients_col.delete_one({'client_id': id})
    return ok({'message': 'Client deleted successfully'})


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 3 – PROJECT MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

@csrf_exempt
def get_projects(request):
    """GET /projects/  — list projects with optional search, category & status filters."""
    if request.method == 'OPTIONS':
        return preflight()

    query    = {}
    search   = request.GET.get('search',   '').strip()
    category = request.GET.get('category', '').strip()
    status   = request.GET.get('status',   '').strip()

    if search:
        query['$or'] = [
            {'project_title': {'$regex': re.escape(search), '$options': 'i'}},
            {'description':   {'$regex': re.escape(search), '$options': 'i'}},
        ]
    if category:
        query['category'] = {'$regex': f'^{re.escape(category)}$', '$options': 'i'}
    if status:
        query['status'] = status

    rows = [to_dict(doc) for doc in projects_col.find(query)]
    return ok(rows)


@csrf_exempt
def add_project(request):
    """POST /projects/add/  — post a new project."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'POST':
        return ok({'error': 'Method not allowed'}, 405)

    data = body(request)
    doc  = {
        'project_id'    : get_next_id('projects'),
        'project_title' : data.get('project_title', ''),
        'description'   : data.get('description', ''),
        'category'      : data.get('category', ''),
        'budget'        : float(data.get('budget', 0)),
        'deadline'      : data.get('deadline', ''),
        'client_name'   : data.get('client_name', ''),
        'status'        : data.get('status', 'Open'),
    }
    projects_col.insert_one(doc)
    return ok(
        {'message': 'Project posted successfully',
         'project_id': doc['project_id']},
        201,
    )


@csrf_exempt
def update_project(request, id):
    """PUT /projects/update/<id>/  — update project details or status."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'PUT':
        return ok({'error': 'Method not allowed'}, 405)

    data   = body(request)
    update = {
        'project_title' : data.get('project_title', ''),
        'description'   : data.get('description', ''),
        'category'      : data.get('category', ''),
        'budget'        : float(data.get('budget', 0)),
        'deadline'      : data.get('deadline', ''),
        'client_name'   : data.get('client_name', ''),
        'status'        : data.get('status', 'Open'),
    }
    projects_col.update_one({'project_id': id}, {'$set': update})
    return ok({'message': 'Project updated successfully'})


@csrf_exempt
def delete_project(request, id):
    """DELETE /projects/delete/<id>/  — remove a project."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'DELETE':
        return ok({'error': 'Method not allowed'}, 405)

    projects_col.delete_one({'project_id': id})
    return ok({'message': 'Project deleted successfully'})


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 4 – BID MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

@csrf_exempt
def get_bids(request):
    """GET /bids/  — list bids with optional project/freelancer filters."""
    if request.method == 'OPTIONS':
        return preflight()

    query      = {}
    project    = request.GET.get('project',    '').strip()
    freelancer = request.GET.get('freelancer', '').strip()

    if project:
        query['project_title']   = {'$regex': re.escape(project),    '$options': 'i'}
    if freelancer:
        query['freelancer_name'] = {'$regex': re.escape(freelancer), '$options': 'i'}

    rows = [to_dict(doc) for doc in bids_col.find(query)]
    return ok(rows)


@csrf_exempt
def add_bid(request):
    """POST /bids/add/  — submit a new bid/proposal."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'POST':
        return ok({'error': 'Method not allowed'}, 405)

    data = body(request)
    doc  = {
        'bid_id'          : get_next_id('bids'),
        'project_title'   : data.get('project_title', ''),
        'freelancer_name' : data.get('freelancer_name', ''),
        'bid_amount'      : float(data.get('bid_amount', 0)),
        'proposal'        : data.get('proposal', ''),
        'status'          : data.get('status', 'Pending'),
    }
    bids_col.insert_one(doc)
    return ok(
        {'message': 'Bid submitted successfully',
         'bid_id': doc['bid_id']},
        201,
    )


@csrf_exempt
def update_bid(request, id):
    """PUT /bids/update/<id>/  — update bid or change status (Accept / Reject)."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'PUT':
        return ok({'error': 'Method not allowed'}, 405)

    data   = body(request)
    update = {
        'project_title'   : data.get('project_title', ''),
        'freelancer_name' : data.get('freelancer_name', ''),
        'bid_amount'      : float(data.get('bid_amount', 0)),
        'proposal'        : data.get('proposal', ''),
        'status'          : data.get('status', 'Pending'),
    }
    bids_col.update_one({'bid_id': id}, {'$set': update})
    return ok({'message': 'Bid updated successfully'})


@csrf_exempt
def delete_bid(request, id):
    """DELETE /bids/delete/<id>/  — remove a bid."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'DELETE':
        return ok({'error': 'Method not allowed'}, 405)

    bids_col.delete_one({'bid_id': id})
    return ok({'message': 'Bid deleted successfully'})


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 5 – CONTRACT MANAGEMENT
# ─────────────────────────────────────────────────────────────────────────────

@csrf_exempt
def get_contracts(request):
    """GET /contracts/  — list all contracts."""
    if request.method == 'OPTIONS':
        return preflight()

    rows = [to_dict(doc) for doc in contracts_col.find()]
    return ok(rows)


@csrf_exempt
def add_contract(request):
    """POST /contracts/add/  — create a new contract."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'POST':
        return ok({'error': 'Method not allowed'}, 405)

    data = body(request)
    doc  = {
        'contract_id'     : get_next_id('contracts'),
        'project_title'   : data.get('project_title', ''),
        'freelancer_name' : data.get('freelancer_name', ''),
        'client_name'     : data.get('client_name', ''),
        'agreed_budget'   : float(data.get('agreed_budget', 0)),
        'start_date'      : data.get('start_date', ''),
        'end_date'        : data.get('end_date', ''),
        'contract_status' : data.get('contract_status', 'Active'),
    }
    contracts_col.insert_one(doc)
    return ok(
        {'message': 'Contract created successfully',
         'contract_id': doc['contract_id']},
        201,
    )


@csrf_exempt
def update_contract(request, id):
    """PUT /contracts/update/<id>/  — update contract or change status."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'PUT':
        return ok({'error': 'Method not allowed'}, 405)

    data   = body(request)
    update = {
        'project_title'   : data.get('project_title', ''),
        'freelancer_name' : data.get('freelancer_name', ''),
        'client_name'     : data.get('client_name', ''),
        'agreed_budget'   : float(data.get('agreed_budget', 0)),
        'start_date'      : data.get('start_date', ''),
        'end_date'        : data.get('end_date', ''),
        'contract_status' : data.get('contract_status', 'Active'),
    }
    contracts_col.update_one({'contract_id': id}, {'$set': update})
    return ok({'message': 'Contract updated successfully'})


@csrf_exempt
def delete_contract(request, id):
    """DELETE /contracts/delete/<id>/  — remove a contract."""
    if request.method == 'OPTIONS':
        return preflight()
    if request.method != 'DELETE':
        return ok({'error': 'Method not allowed'}, 405)

    contracts_col.delete_one({'contract_id': id})
    return ok({'message': 'Contract deleted successfully'})


# ─────────────────────────────────────────────────────────────────────────────
# BONUS – PLATFORM STATISTICS
# ─────────────────────────────────────────────────────────────────────────────

@csrf_exempt
def get_stats(request):
    """GET /stats/  — aggregate counts for dashboard statistics."""
    if request.method == 'OPTIONS':
        return preflight()

    stats = {
        'freelancers'      : freelancers_col.count_documents({}),
        'clients'          : clients_col.count_documents({}),
        'projects'         : projects_col.count_documents({}),
        'open_projects'    : projects_col.count_documents({'status': 'Open'}),
        'in_progress'      : projects_col.count_documents({'status': 'In Progress'}),
        'completed_proj'   : projects_col.count_documents({'status': 'Completed'}),
        'bids'             : bids_col.count_documents({}),
        'pending_bids'     : bids_col.count_documents({'status': 'Pending'}),
        'accepted_bids'    : bids_col.count_documents({'status': 'Accepted'}),
        'contracts'        : contracts_col.count_documents({}),
        'active_contracts' : contracts_col.count_documents({'contract_status': 'Active'}),
        'done_contracts'   : contracts_col.count_documents({'contract_status': 'Completed'}),
    }
    return ok(stats)
