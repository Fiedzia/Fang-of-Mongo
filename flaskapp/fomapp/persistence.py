

class Persistence(object):
    """
    """
    DEFAULT_COLLECTION_NAMES = ['servers', 'config']
    def __init__(self, conn, dbname, collection_prefix):
        self.conn = conn
        self.dbname = dbname
        self.collections = {cn: collection_prefix + cn for cn in self.DEFAULT_COLLECTION_NAMES}
        self.db = self.conn[dbname]

    def list_servers(self, sort=None):
        servers = []
        server_coll = self.db[self.collections['servers']]
        for server in server_coll.find(sort=sort):
            servers.append(server)
        return servers

 
