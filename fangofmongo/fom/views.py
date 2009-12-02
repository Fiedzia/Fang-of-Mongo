from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson as json

import re
import pymongo

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
    #for plugin in plugins:
    #    print 'plugin', plugin.name, plugin.js
    return render_to_response('fom/templates/mongo_ui_page.html',
            {
              'connection_params' : { 'host' : host, 'port' : port, 'db' : None, 'coll' : None },
              'plugins' : plugins 
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
                    dbnames = [dbname for dbname in dbnames if re.match(request.GET['search'], dbname)]
                else:
                    dbnames = [dbname for dbname in dbnames if request.GET['search'] in dbname]
        dbnames.sort()
        json_response = json.dumps({'data':dbnames})
    except (Exception), e:
         json_response = (json.dumps({'error': repr(e)}))
        
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
                    collnames = [collname for collname in collnames if re.match(request.GET['search'], collname)]
                else:
                    collnames = [collname for collname in collnames if request.GET['search'] in collname]
        collnames.sort()
        json_response = json.dumps({'data':collnames})
    except (Exception), e:
         json_response = json.dumps({'error': repr(e)})
        
    return HttpResponse(json_response, mimetype='application/json')

#@auth_required
def exec_cmd(request):
    """
        get params from POST and execute command
    """
    error_msg = None
    cmd = None
    print 'DATA:', request.POST
    try:
        if not 'cmd' in request.POST:
            raise CmdException('No command given')
        cmd = request.POST['cmd']
        if cmd == 'help':
            json_response = json.dumps({'data': 'some help', 'type' : 'html'})
        
    except (CmdException,), e:
        json_response = json.dumps({'error': e.message})
    except (Exception), e:
        json_response = json.dumps({'error': repr(e)})
    return HttpResponse(json_response, mimetype='application/json')

