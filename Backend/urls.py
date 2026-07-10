"""
Backend/urls.py – URL patterns for all 5 modules (supports both slash and no-slash paths).

This ensures that Postman calls work perfectly regardless of whether the user
includes a trailing slash '/' or not in their request.
"""
from django.urls import path
from . import views

urlpatterns = [

    # ── Freelancer Module ─────────────────────────────────────────────────
    path('freelancers/',                  views.get_freelancers,    name='get_freelancers'),
    path('freelancers',                   views.get_freelancers),
    
    path('freelancers/add/',              views.add_freelancer,     name='add_freelancer'),
    path('freelancers/add',               views.add_freelancer),
    
    path('freelancers/update/<int:id>/',  views.update_freelancer,  name='update_freelancer'),
    path('freelancers/update/<int:id>',   views.update_freelancer),
    
    path('freelancers/delete/<int:id>/',  views.delete_freelancer,  name='delete_freelancer'),
    path('freelancers/delete/<int:id>',   views.delete_freelancer),

    # ── Client Module ─────────────────────────────────────────────────────
    path('clients/',                      views.get_clients,        name='get_clients'),
    path('clients',                       views.get_clients),
    
    path('clients/add/',                  views.add_client,         name='add_client'),
    path('clients/add',                   views.add_client),
    
    path('clients/update/<int:id>/',      views.update_client,      name='update_client'),
    path('clients/update/<int:id>',       views.update_client),
    
    path('clients/delete/<int:id>/',      views.delete_client,      name='delete_client'),
    path('clients/delete/<int:id>',       views.delete_client),

    # ── Project Module ────────────────────────────────────────────────────
    path('projects/',                     views.get_projects,       name='get_projects'),
    path('projects',                      views.get_projects),
    
    path('projects/add/',                 views.add_project,        name='add_project'),
    path('projects/add',                  views.add_project),
    
    path('projects/update/<int:id>/',     views.update_project,     name='update_project'),
    path('projects/update/<int:id>',      views.update_project),
    
    path('projects/delete/<int:id>/',     views.delete_project,     name='delete_project'),
    path('projects/delete/<int:id>',      views.delete_project),

    # ── Bid Module ────────────────────────────────────────────────────────
    path('bids/',                         views.get_bids,           name='get_bids'),
    path('bids',                          views.get_bids),
    
    path('bids/add/',                     views.add_bid,            name='add_bid'),
    path('bids/add',                      views.add_bid),
    
    path('bids/update/<int:id>/',         views.update_bid,         name='update_bid'),
    path('bids/update/<int:id>',          views.update_bid),
    
    path('bids/delete/<int:id>/',         views.delete_bid,         name='delete_bid'),
    path('bids/delete/<int:id>',          views.delete_bid),

    # ── Contract Module ───────────────────────────────────────────────────
    path('contracts/',                    views.get_contracts,      name='get_contracts'),
    path('contracts',                     views.get_contracts),
    
    path('contracts/add/',                views.add_contract,       name='add_contract'),
    path('contracts/add',                 views.add_contract),
    
    path('contracts/update/<int:id>/',    views.update_contract,    name='update_contract'),
    path('contracts/update/<int:id>',     views.update_contract),
    
    path('contracts/delete/<int:id>/',    views.delete_contract,    name='delete_contract'),
    path('contracts/delete/<int:id>',     views.delete_contract),

    # ── Bonus: platform stats ─────────────────────────────────────────────
    path('stats/',                        views.get_stats,          name='get_stats'),
    path('stats',                         views.get_stats),
]
