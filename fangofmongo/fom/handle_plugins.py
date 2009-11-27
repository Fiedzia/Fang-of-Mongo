#!/usr/bin/env python

import os
from xml.etree.ElementTree import ElementTree



from django.conf import settings



class FomPlugin(object):
    """
        class representing single plugin
    """

    def __init__(self, fname):
        tree = ElementTree()
        tree.parse(fname)
        #for plugin in tree.findall('plugin'):
        plugin = tree.find('plugin')
        self.author = plugin.find('info/author').text
        self.version = plugin.find('info/author').text
        self.description = plugin.find('info/author').text
        self.name = plugin.find('info/name').text
        self.css = plugin.find('resources/css').text
        self.html = plugin.find('resources/html').text
        self.js = plugin.find('resources/js').text



def load_plugins():
    """
        Load available plugins
    """
    plugins = []
    for fname in os.listdir(settings.FOM_PLUGIN_DIR):
        try:
            if fname.endswith('.fomxml'):
                plugins.append( FomPlugin( settings.FOM_PLUGIN_DIR + fname) )
        except(Exception,) ,e:
            print 'Failed to load plugin: %s (%s)' % (fname, repr(e))
            raise
    return plugins
