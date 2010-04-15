# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson as json

import re
import pymongo
from pymongo import json_util
import handle_plugins
from exceptions import CmdException

#login view
def start_page(request):
    """
        place to enter database credentials
    """
    return render_to_response('fom/templates/start_page.html', {})

#login view
#@auth_required
def ui_page(request, host, port):
    """
        mongo user interface
    """
    plugins = handle_plugins.load_plugins()
    build_info = {}
    #for plugin in plugins:
    #    print 'plugin', plugin.name, plugin.js
    
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        build_info = conn['admin'].command("buildinfo")
    #except:
    #    pass
    finally:
        conn.disconnect()


    return render_to_response('fom/templates/mongo_ui_page.html',
            {
              'connection_params' : { 'host' : host, 'port' : port, 'db' : None, 'coll' : None },
              'plugins' : plugins,
              'build_info' : build_info,
            }
            )

#########  mongo interface. Ok, just stub of it.
#@auth_required
def list_databases(request, host, port):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)
                    search : text to search (optional)
                    method : re (means regular expression) or empty (means search for occurence of text) (optional)
                    if there is no search, return all databases (FIXME: handle large amount of databases)
    Return list of databases matching given criteria 
    """

    try:
        conn = pymongo.Connection(host = host, port = int(port))
        dbnames = conn.database_names()
        if request.GET:
            if 'search' in request.GET:
                if request.GET.get('method','') =='re':
                    dbnames = [dbname for dbname in dbnames if re.match(request.GET['search'], dbname, re.IGNORECASE)]
                else:
                    dbnames = [dbname for dbname in dbnames if request.GET['search'].lower() in dbname.lower()]
        dbnames.sort()
        json_response = json.dumps({'data':dbnames}, default=pymongo.json_util.default)
    except (Exception), e:
        json_response = (json.dumps({'error': repr(e)}))
    finally:
        conn.disconnect()
       
    return HttpResponse(json_response, mimetype='application/json')

#@auth_required
def list_collections(request, host, port, dbname):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)
                    search : text to search (optional)
                    method : re (means regular expression) or empty (means search for occurence of text) (optional)
                    if there is no search, return all collections (FIXME: handle large amount of collections)
    Return list of databases matching given criteria 
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        collnames = db.collection_names()
        if request.GET:
            if 'search' in request.GET:
                if request.GET.get('method','') =='re':
                    collnames = [collname for collname in collnames if re.match(request.GET['search'], collname, re.IGNORECASE)]
                else:
                    collnames = [collname for collname in collnames if request.GET['search'].lower() in collname.lower()]
        collnames.sort()
        json_response = json.dumps({'data':collnames}, default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()

    return HttpResponse(json_response, mimetype='application/json')




#@auth_required
def db_stats(request, host, port, dbname):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)

    Return json with database stats,as returned by mongo (db.stats())
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        resp = db.command('dbstats')
        json_response = json.dumps({'data':resp},default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    return HttpResponse(json_response, mimetype='application/json')





#@auth_required
def coll_stats(request, host, port, dbname, collname):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)

    Return json with basic collection info
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        coll = db[collname];
        resp = {}
        resp['count'] = coll.count();
        resp['indexes'] = coll.index_information()
        resp['options'] = coll.options()
        json_response = json.dumps({'data':resp},default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    return HttpResponse(json_response, mimetype='application/json')

#@auth_required
def coll_query(request, host, port, dbname, collname):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)
         q -  mongo query as JSON dictionary
         sort - sort info (JSON dictionary)
         limit
         skip
         fields

    Return json with requested data or error
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        coll = db[collname];
        resp = {}
        query = json.loads(request.GET['q'])
        limit = 10
        sort = None
        if 'limit' in request.GET:
            limit = int(request.GET['limit'])
        skip = 0
        if 'skip' in request.GET:
            skip = int(request.GET['skip'])
        if 'sort' in request.GET:
            sort = json.loads(request.GET['sort'])
        cur = coll.find(query, skip = skip, limit = limit)
        if sort:
            cur = cur.sort(sort)
        resp = [a for a in cur]
        json_response = json.dumps({'data':resp}, default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    return HttpResponse(json_response, mimetype='application/json')

#@auth_required
def exec_cmd(request):
    """
        get params from POST and execute command
    """
    error_msg = None
    cmd = None
    try:
        if not 'cmd' in request.POST:
            raise CmdException('No command given')
        cmd = request.POST['cmd']
        if cmd == 'help':
            json_response = json.dumps({'data': 'some help', 'type' : 'html'},  default=pymongo.json_util.default)
        
    except (CmdException,), e:
        json_response = json.dumps({'error': e.message})
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    return HttpResponse(json_response, mimetype='application/json')

