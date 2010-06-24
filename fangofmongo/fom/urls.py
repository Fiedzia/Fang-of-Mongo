# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, include

urlpatterns = patterns('',
    # Example:
    (r'^$',  'fom.views.start_page'),
    (r'ui/mongo/(?P<host>.+)/(?P<port>\d+)/$',  'fom.views.ui_page'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/cmd/$',  'fom.views.cmd'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/databases/$',  'fom.views.list_databases'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/database/(?P<dbname>.+)/stats/$',  'fom.views.db_stats'),
    
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/database/(?P<dbname>.+)/cmd/$',  'fom.views.db_run_command'),
    
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collections/(?P<dbname>.+)/$',  'fom.views.list_collections'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/stats/$',  'fom.views.coll_stats'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/indexes/$',  'fom.views.coll_indexes'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/save_document/$',  'fom.views.save_document'),

    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collection/(?P<dbname>.+)/(?P<collname>.+)/query/$',  'fom.views.coll_query'),

    (r'rest/mongo/cmd/$',  'fom.views.exec_cmd'),
)
