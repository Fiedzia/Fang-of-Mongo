# -*- coding: utf-8 -*-
from django.conf.urls import *
import settings
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Example:
     (r'^fangofmongo/', include('fom.urls')),

    #serve static using django - for develpment pupose only
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes':True}),

)



