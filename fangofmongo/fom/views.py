from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson as json

import re
import pymongo

#login view
def start_page(request):
    """
        place to enter database credentials
    """
    return render_to_response('fom/templates/start_page.html', {})

#login view
def ui_page(request, host, port):
    """
        mongo user interface
    """
    return render_to_response('fom/templates/mongo_ui_page.html',
            { 'connection_params' : {'host':host, 'port': port,'db': None,'coll':None}}
            )

#########  mongo interface. Ok, just stub of it.

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


