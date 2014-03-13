#!/usr/bin/env python3
from os import path

import pymongo
from flask import Flask, g, request, jsonify
from flask import render_template

from flask.ext.appconfig import AppConfig

from fomapp import persistence

def create_app(configfiles=None):
        app = Flask('fomapp')
        AppConfig(app, configfiles)
        return app


def get_persistence():
    if not hasattr(g, 'persistence'):
        host, port = None, None
        hoststr = app.config['MONGO']['host']
        if ':' in hoststr:
            host, port = hoststr.split(':')
            port = int(port)
        conn = pymongo.MongoClient(host=host, port=port)
        g.persistence = persistence.Persistence(
            conn,
            app.config['MONGO']['db'],
            app.config['MONGO']['collection_prefix']
        )
    return g.persistence


app = create_app(configfiles=[path.join(path.dirname(__file__), 'settings.py')])


@app.route('/')
def index():
    persistence = get_persistence()
    return render_template('index.html')


@app.route('/rest/servers')
def list_servers():
    persistence = get_persistence()
    return jsonify(servers=persistence.list_servers(sort=[]))
 

@app.route('/rest/databases')
def list_databases():
    conn = get_conn()
    #c.admin.command("listDatabases")     
     
     
if __name__ == "__main__":
    app.run()
