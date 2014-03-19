import base64
from bson import binary, objectid


def bson2json(json_obj):
    """
    Handle binary data in output json, because pymongo cannot encode them properly (generating UnicodeDecode exceptions)
    """
    #import pudb; pudb.set_trace()
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
        elif data_type == binary.Binary:
            ud = base64.encodestring(d)
            return { '$binary' : ud, '$type': d.subtype }
        elif data_type is objectid.ObjectId:
            return {'$objectid': str(d) }
        else:
            return d

    return _fix_json(json_obj)

def json2bson(json_obj):
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
                return binary.Binary(base64.decodestring(d['$binary']), d['$type'])
            elif '$objectid' in d:
                return objectid.ObjectId(d)
            else:
                for k in d:
                    data[_fix_json(k)] = _fix_json(d[k])
            return data
        else:
            return d

    return _fix_json(json_obj)


