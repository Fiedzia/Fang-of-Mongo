# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson as json

import re
import base64
import pymongo
from pymongo import json_util
import handle_plugins
from exceptions import CmdException


def fix_json_output(json_obj):
    """
        Handle binary data in output json, because pymongo cannot encode them properly (generating UnicodeDecode exceptions)
    """
    def _fix_json(d):
        if d in [None, [], {}]: #if not d: breaks empty Binary
            return d
        data_type = type(d)
        if data_type == list:
            data = []
            for item in d:
                data.append(_fix_json(item))
            return data
        elif data_type == dict:
            data = {}
            for k in d:
                data[_fix_json(k)] = _fix_json(d[k])
            return data
        elif data_type == pymongo.binary.Binary:
            ud = base64.encodestring(d)
            return { '$binary' : ud, '$type': d.subtype }
        else:
            return d

    return _fix_json(json_obj)

def fix_json_input(json_obj):
    """
        Handle binary data in input json, because pymongo cannot decode them properly (leaving $binary as string)
    """
    def _fix_json(d):
        if d in [None, [], {}]: #if not d: breaks empty Binary
            return d
        data_type = type(d)
        if data_type == list:
            data = []
            for item in d:
                data.append(_fix_json(item))
            return data
        elif data_type == dict:
            data = {}
            if '$binary' in d: #base64 encoded data
                return pymongo.binary.Binary(base64.decodestring(d['$binary']), d['$type'])
            else:
                for k in d:
                    data[_fix_json(k)] = _fix_json(d[k])
            return data
        else:
            return d

    return _fix_json(json_obj)



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
        build_info = conn['admin'].command({"buildinfo": 1})
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
        resp = db.command({'dbstats': 1})
        json_response = json.dumps({'data':resp},default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    return HttpResponse(json_response, mimetype='application/json')


#@auth_required
def coll_indexes(request, host, port, dbname, collname):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)

    Return information about collection indexes
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        coll = db[collname];
        resp = coll.index_information()
        json_response = json.dumps({'data':resp},default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    resp = HttpResponse(json_response, mimetype='application/json')
    resp['Cache-Control'] = 'no-cache'
    return resp



#@auth_required
def coll_stats(request, host, port, dbname, collname):
    """
    From GET take:  login, password : database credentials(optional, currently ignored)

    Return json with basic collection info
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        resp = db.command({'collstats':collname})
        #coll = db[collname];
        #resp = {}
        #resp['count'] = coll.count();
        #resp['indexes'] = coll.index_information()
        #resp['options'] = coll.options()
        json_response = json.dumps({'data':resp},default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    resp = HttpResponse(json_response, mimetype='application/json')
    resp['Cache-Control'] = 'no-cache'
    return resp

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
        query = json.loads(request.GET['q'], object_hook=json_util.object_hook)
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
        cnt = cur.count()
        if sort:
            cur = cur.sort(sort)
        resp = [a for a in cur]
        json_response = json.dumps({'data':fix_json_output(resp), 'meta': {'count': cnt}}, default=pymongo.json_util.default)

    except (Exception), e:
        print e
        import traceback
        traceback.print_stack()
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    resp = HttpResponse(json_response, mimetype='application/json' )
    resp['Cache-Control'] = 'no-cache'
    return resp

def cmd(request, host, port):
    """
    From POST take:  login, password : database credentials(optional, currently ignored)

         cmd: command to perform

    Return json with requested data or error
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        cmd = request.POST['cmd']
        if cmd == 'create_database':
            db = conn[request.POST['database_name']]
            #hack: this will actually create database if one doesn't exists
            db.collection_names()
        elif cmd == 'drop_database':
            conn.drop_database(request.POST['database_name'])
        elif cmd == 'create_collection':
            db = conn[request.POST['database']]
            db.create_collection(request.POST['collection_name'])
        elif cmd == 'drop_collection':
            db = conn[request.POST['database']]
            db.drop_collection(request.POST['collection_name'])
        else:
            raise Exception('incorrect command')
        resp = {}
        json_response = json.dumps({'data':resp}, default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    finally:
        conn.disconnect()
        
    resp = HttpResponse(json_response, mimetype='application/json' )
    resp['Cache-Control'] = 'no-cache'
    return resp

def save_document(request, host, port, dbname, collname):
    """
    From POST take:  login, password : database credentials(optional, currently ignored)
         document -  mongo document, JSON strict format

    Return document _id or error
    """
    try:
        conn = pymongo.Connection(host = host, port = int(port))
        db = conn[dbname]
        coll = db[collname];
        resp = {}
        document = fix_json_input(json.loads(request.POST['document'], object_hook=json_util.object_hook))
        _id =  coll.save(document)
        json_response = json.dumps({'_id':_id}, default=pymongo.json_util.default)
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
        import traceback
        traceback.print_stack()
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

