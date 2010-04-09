#!/usr/bin/env python

"""
    Convert freedb.org cd database into json format suitable to import into mongodb
"""

import os
import re
import json

data = {}
dirname = 'rock'


class MissingTitle(Exception):
    pass

for fname in os.listdir(dirname):
    #print fname
    finfo = {'songs': []}
    f = open(dirname + '/' + fname)
    try:
        for line in f:
            if re.match('[^#].*=.*', line):
            
                k,v = map(lambda s:s.strip(),line.split('=',1))
                if v == '':
                    continue
                v = unicode(v, 'utf-8').encode('utf8')
                if k == 'DISCID':
                    finfo['discid'] = v
                    finfo['_id'] = v
                elif k == 'YEAR':
                    finfo['year'] = v
                elif k == 'DYEAR':
                    finfo['dyear'] = v
                elif k == 'DTITLE':
                    if not '/' in v:
                        raise MissingTitle
                    artist, album = map(lambda s:s.strip(), v.split('/',1))
                    finfo['artist'] = artist
                    finfo['album'] = album
                    #finfo['title'] = v
                elif k == 'DGENRE':
                    finfo['genre'] = v.lower()
                elif k.startswith('TTITLE'):
                    finfo['songs'].append({'order' : int(k[6:]), 'title' : v})
                elif k == 'EXTD':
                    pass
                    
                else:
                    print 'unknow key:', fname , k, ' v=', v

    except UnicodeDecodeError:
        print fname, 'encoding error'
        f.close()
        continue 
    except MissingTitle:
        print fname, 'incorrect title'
        continue
    
    if finfo['artist'] in data:
        data[finfo['artist']]['albums'][finfo['discid']] = finfo
    else:
         data[finfo['artist']] = {'albums':{finfo['discid']:finfo}, '_id': finfo['artist'] }

fout = open('out.json', 'w')
for item in data:
    fout.write(json.dumps(data[item]) + '\n')
fout.close()
print len(data)
