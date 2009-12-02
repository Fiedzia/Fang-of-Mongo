from django.conf.urls.defaults import patterns, include

urlpatterns = patterns('',
    # Example:
    (r'^$',  'fom.views.start_page'),
    (r'ui/mongo/(?P<host>.+)/(?P<port>\d+)/$',  'fom.views.ui_page'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/databases/$',  'fom.views.list_databases'),
    (r'rest/mongo/(?P<host>.+)/(?P<port>\d+)/collections/(?P<dbname>.+)/$',  'fom.views.list_collections'),
    (r'rest/mongo/cmd/$',  'fom.views.exec_cmd'),
)
