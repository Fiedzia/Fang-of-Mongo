/* Fang of Mongo init function */

function fom_init_mongo_ui()
/*
    Base class for all fom objects
*/
{

$(function() {

$.widget("ui.fom_object", {
   _init: function() {
     // init code for mywidget
     // can use this.options
     this.active = false;

   },
   //value: function(a) { return a; },
   //length: function ( ) { return this.listeners.length;  },
   active:  function ( ) { return this.active;  },

   signal: function(signal_name, signal_source, signal_data ) {

   },

   destroy: function() {
       $.widget.prototype.apply(this, arguments); // default destroy
        // now do other stuff particular to this widget
   }
 });


 $.extend($.ui.fom_object, {
   getters: "value length",
   defaults: {
     active: false,
     //hidden: true
   }
 });
//end of fom_object

/*
* Plugin interface
*
*/
Fom_plugin = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function
    }, 

}); 
$.widget("ui.fom_plugin", Fom_plugin); 


/*
* Query builder
*/

Fom_query_builder = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function
        var this_obj = this;
        this.div = $('#' + this.options['div_id']);
        $(this.div).addClass('fom_query_builder');
        $(this.div).append('<table>\
                                <tr>\
                                    <td>Field</td>\
                                    <td><button class="fom_query_builder_btn_add">+</button></td>\
                                </tr>\
                                <tr>\
                                    <td>Condition</td>\
                                    <td><button class="fom_query_builder_btn_del">-</button></td>\
                                </tr>\
                                <tr>\
                                    <td>Value</td>\
                                    <td></td>\
                                </tr>\
                            </table>');
        this.table = $(this.div).children()[0];
        $(this.table).find('.fom_query_builder_btn_add').click( function() {
            this_obj.add_query();
        });
        $(this.table).find('.fom_query_builder_btn_del').click( function() {
            this_obj.del_query();
        });
        this.add_query();

    },
    
    add_query: function() {
        var rows = $(this.table).find('tr');
        $(rows[0]).append('<td><input type="text" value="" class="fom_query_builder_field_name"></td>');
        $(rows[1]).append('<td>\
                               <select class="fom_query_builder_field_condition">\
                                   <option value="_ignore">(ignore)</option>\
                                   <option value="$exists">exists</option>\
                                   <option value="$nexists">does not exists</option>\
                                   <option value="$equals">equals</option>\
                                   <option value="$ne">is not equal</option>\
                                   <option value="$gt">greather</option>\
                                   <option value="$gte">greather or equal</option>\
                                   <option value="$lt">lower</option>\
                                   <option value="$lte">lower or equal</option>\
                                   <option value="$in">is any of</option>\
                                   <option value="$nin">is not any of</option>\
                                   <option value="$all">contains all of</option>\
                                   <option value="$size">is of size</option>\
                                   <option value="$type">is of type</option>\
                                   <option value="$re">matches regular expression</option>\
                                   <option value="$where">matches condition ($where)</option>\
                               </select>\
                           </td>');
                               
        $(rows[2]).append('<td><input type="text" class="fom_query_builder_field_value"/></td>');
        
        //alert( $(rows[0]).children('td').length);
        this.build_query();

    },
    del_query: function() {
        var rows = $(this.table).find('tr');
        if ($(rows[0]).children('td').length > 3) {
                $(rows[0]).children('td:last-child').remove();
                $(rows[1]).children('td:last-child').remove();
                $(rows[2]).children('td:last-child').remove();
        }
        
        
    },
    
    build_query: function() {
    /*
        function enhance_query(q, f, cond){
            if (!(f in q)) {
                q[f]  = cond;
            } else {
                //check conflicting queries
            };
            return q;
        }*/
        var rows = $(this.table).find('tr');

        var query = {};
        for(var i = 2; i< $(rows[0]).children('td').length; i++)
        {
            var field = $($(rows[0]).children('td')[i]).children('input').val();
            var condition = $($(rows[1]).children('td')[i]).children('select').val();
            var value = $($(rows[2]).children('td')[i]).children('input').val();

            if ((field == "" && condition != "$where") || condition =="_ignore") continue;
            switch(condition) {
                case '$exists':
                    q = {}
                    q[field]={$exists: true}
                    $.extend(true, query, q);
                    break;
                case '$nexists':
                    q = {}
                    q[field]={$nexists: true}
                    $.extend(true, query, q);
                    break;
                case '$equals':
                    //query[field] = value;
                    q = {}
                    q[field]=value
                    $.extend(true, query, q);
                    break;
                case '$ne':
                    q = {}
                    q[field] = {$ne:value};
                    $.extend(true, query, q);
                    break;
                case '$gt' :
                case '$gte':
                case '$lt' :
                case '$lte':
                    q = {}
                    q[field] = {};
                    q[field][condition] = parseInt(value);
                    $.extend(true, query, q);
                    break;
                case '$in':
                case '$nin':
                    q = {}
                    q[field] = {};
                    q[field][condition] = $.parseJSON(value);
                    $.extend(true, query, q);
                    break;
                case '$all':
                    q = {}
                    q[field] = {$all: $.parseJSON(value)};
                    $.extend(true, query, q);
                    break;
                case '$size':
                    q = {}
                    q[field] = {$size: parseInt(value)};
                    $.extend(true, query, q);
                    break;
                case '$type':
                    q = {}
                    q[field] = {$type: parseInt(value)};
                    $.extend(true, query, q);
                    break;
                case '$re':
                    q = {}
                    q[field] = {$regex:value};
                    $.extend(true, query, q);
                    break;
                case '$where':
                    q = {$where: value};
                    $.extend(true, query, q);
                    break;
                    
            };
            
        };
        //alert(JSON.stringify(query));
        return query;
    },

}); 
$.widget("ui.fom_query_builder", Fom_query_builder); 


/**
*
*       Message bus
*
*/

Fom_bus = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        this.listeners = new Array();
        this.active = true;

}, 
    length: function ( ) { return this.listeners.length;  },
    active:  function ( ) { return this.active;  },

    /* add listeners
       params:
           listener: fom_object
    */
    add_listener: function(listener) {
        this.listeners[this.listeners.length] = listener;
    },

    /* send signal
       params:
           signal_name: name of the signal 
           signal_source: fom_object instance originating the signal
           signal_data: json data related to signal (content depends on signal)
    */
    signal: function(signal_name, signal_source, signal_data ) {
        $.ui.fom_object.prototype.signal.call(this);
        for ( var obj in this.listeners)
        {
            this.listeners[obj].signal(signal_name, signal_source, signal_data);
        };
    },
}); 
$.widget("ui.fom_bus", Fom_bus); 
//end of message bus


/**
*
*       Console ui object
*
*/
/*
Fom_ui_console = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        this.dialog_id = this.options['div_id'] + '_dialog';
        this.console_id = this.options['div_id'] + '_console_div';
        this.input_id = this.options['div_id'] + '_input';
        this.button_id = this.options['div_id'] + '_button';

        $('#' + this.options['div_id']).append("<div id='" + this.dialog_id + "'><input type='text' name='" + this.input_id +"' id='" + this.input_id + "'/><button id='" + this.button_id + "'>Run</button><div id='" + this.console_id + "'></div><div></div></div>");
        var my_id = '#' + this.options['div_id'];
        var input_id = this.input_id;
        $('#' + this.button_id).click(function() { $(my_id).trigger('console_exec', [$('#' + input_id).get(0).value]) } );
        $('#' + this.input_id).keypress(function(event) { if (event.keyCode == 13) { $(my_id).trigger('console_exec', [$('#' + input_id).get(0).value]) }} );


     //dialog - item list
     $('#' + this.options['div_id'] + '_dialog').dialog({
            autoOpen: true,
            height: 500,
            width: 400,
            modal: false,
            closeOnEscape: false,
            buttons: {},
            title: this.options['title'],
            position : [220,100],

     }); //end of dialog

     $('#' + this.dialog_id).dialog('open');
     var dialog_id = this.dialog_id;
     //$('#' + this.options['tool_button_id']).click(function () { $('#' + dialog_id).dialog('isOpen')? $('#' + dialog_id).dialog('close') : $('#' + dialog_id).dialog('open');});

    },
    
     response_error : function (err) {
     }, //end of reponse_error
     response : function (data) {
         //alert(data);
         if (data.type == 'html') {
             $('#' + this.console_id).prepend('<div class="fom_console_message">' + data.data + '</div>')
         };
     }, //end of reponse_error    
    
}); 
$.widget("ui.fom_ui_console", Fom_ui_console); 


//end of console ui object
*/

/**
*
*       Console object
*
*/
/*
Fom_console = $.extend({}, $.ui.fom_object.prototype, {
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        $('#mongo_ui_header_tools_bus').fom_bus('add_listener', this);
        $('#mongo_ui_container').append("<div id='mongo_ui_console'></div>");
        $('#mongo_ui_console').fom_ui_console({'title':'Mongo console', 'div_id': 'mongo_ui_console', 'tool_button_id' : 'mongo_ui_header_tools_console' });
        var this_obj = this;
        $('#mongo_ui_console').bind('console_exec', function(e, cmd){  this_obj.exec_cmd(cmd); });
    }, 
   signal: function(signal_name, signal_source, signal_data ) {
        if (signal_name == 'app_init')
        {

        }
        else if ( signal_name == 'database_selected')
        {
            $('#mongo_ui_console_dialog').dialog('option','title','Mongo console [' + signal_data['database'] + ']');
            //$('#mongo_ui_database_list').fom_ui_list('set_list', signal_data['data'], signal_data['search'], signal_data['method']);
        }
        else if ( signal_name == 'collection_selected')
        {
            var db_name = $('#mongo_ajax').fom_object_mongo_ajax('option','database');
            $('#mongo_ui_console_dialog').dialog('option','title','Mongo console [' + db_name + ' -> ' + signal_data['collection'] + ']');
        }        
   },
   exec_cmd: function(cmd){
       cmd = cmd.trim();
       if (cmd.length == 0) {
           return;
       }
       var my_console_instance = this;
       if (cmd[0] == ':') {    //server command
           $('#mongo_ajax').fom_object_mongo_ajax('exec_cmd', my_console_instance, cmd);
       } else {
           alert('Unknown command: ' + cmd);
       }
   //alert('cmd:'+ cmd);
   },
   //process cmd response
   process_response: function(data){
       if (data.error) {
           $('#mongo_ui_console').fom_ui_console('response_error',data.error);
       } else {
           $('#mongo_ui_console').fom_ui_console('response', data);
       }
       
   },
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_console", Fom_console); 
//end of console
*/

/**
*
*       Item list ui object
*         - dialog displaying list of items, with ability to search
*/

Fom_item_list = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function
        this.options['title_prefix'] = this.options['title'];
        this.dialog_id = this.options['div_id'] + '_dialog';
        this.item_list_id = this.options['div_id'] + '_list';
        this.input_id = this.options['div_id'] + '_input';
        this.search_id = this.options['div_id'] + '_search';
        this.clear_id = this.options['div_id'] + '_clear';
        
        $('#' + this.options['div_id']).append("<div id='" + this.dialog_id + "'><input type='text' name='" + this.input_id +"' id='" + this.input_id + "'/><button id='" + this.search_id + "'>Search</button><button id='" + this.clear_id + "'>Clear</button><div class='fom_ui_note'></div><div class='fom_ui_list_items'><div id='" + this.item_list_id + "'></div></div></div>");
        var my_id = '#' + this.options['div_id'];
        var search_id = this.search_id;
        var clear_id = this.clear_id;
        var input_id = this.input_id;

     
     //dialog - item list
     $('#' + this.options['div_id'] + '_dialog').dialog({
            autoOpen: true,
            height: 300,
            width: 200,
            modal: false,
            closeOnEscape: false,
            title: this.options['title'],
            buttons: {},
            position : this.options['position'],


     }); //end of dialog

     $('#' + this.dialog_id).dialog('open');
     var dialog_id = this.dialog_id
     $('#' + this.options['tool_button_id']).click(function () { $('#' + dialog_id).dialog('isOpen')? $('#' + dialog_id).dialog('close') : $('#' + dialog_id).dialog('open');});
     $('#' + this.search_id).button();
     $('#' + this.clear_id).button();

     //set title properly when appending filter there
     $('#' + dialog_id).dialog('option','title_prefix',this.options['title']);

     $('#' + search_id).click(function() { $('#' + dialog_id).dialog('option','title', $('#' + dialog_id).dialog('option','title_prefix')+' ~' + $('#' + input_id).get(0).value); $(my_id).trigger('search', [$('#' + input_id).get(0).value]) } );     
     $('#' + clear_id).click(function() { $('#' + dialog_id).dialog('option','title',$('#' + dialog_id).dialog('option','title_prefix')); $('#' + input_id).get(0).value = ''; $(my_id).trigger('search', ['']) } );     
     $('#' + input_id).keyup(function(event) { if (event.keyCode == 13) { $('#' + dialog_id).dialog('option','title',$('#' + dialog_id).dialog('option','title_prefix')+' ~' + $('#' + input_id).get(0).value ); $(my_id).trigger('search', [$('#' + input_id).get(0).value]) }} );                
     

    }, 
    set_list: function(item_list, search, method){
        var id_name = '#' + this.item_list_id;
        $('#' + this.item_list_id).empty();
        $.each(item_list, function(){ var dn = document.createElement('div'); dn.fom_db = this; $(dn).addClass('fom_ui_list_item');  dn.innerHTML = escape_html(this);  $(id_name).append( dn ); });
        var my_id = '#' + this.options['div_id'];
        $('#' + this.item_list_id).children().click(function(){ $(id_name).children().each(function() {$(this).removeClass('fom_ui_list_item_selected');});  $(this).addClass('fom_ui_list_item_selected'); $(my_id).trigger('fom_item_selected', [this.fom_db]);}); 
    },
    
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_ui_list", Fom_item_list); 


//end of item list ui object




/*
        DATABASE ACCESS
            class which allows to access mongodb via ajax calls
*/

Fom_mongo_ajax = $.extend({}, $.ui.fom_object.prototype, {    

        _init: function() {
            $('#mongo_ui_header_tools_bus').fom_bus('add_listener', this);
        
            //this.host = null;
            //this.port = null;
            //this.collection = null;
            //this.database = null; },
       },   

        // process server response to exec_cmd
        process_response: function(caller_id, data) {
            caller_id.process_response(data);
        }, // end of process_reponse
        
        /*  //this is intended to be use for console plugin
        exec_cmd: function(console_obj, cmd){
            var url = '/fangofmongo/rest/mongo/cmd/';
            var caller_id = console_obj;
            var my_console = this;

            $.post(url, {'cmd':'help'}, function(data){ my_console.process_response(caller_id, data); }, "json");
            
        }, //end of exec_cmd:*/
        
        /* Get list of databases from mongo server
           params:
               search (string, optional): text to search
               method (string, optional): search method, either null (text search) or 're' (search will be interpreted as regular expression)
        */
        get_db_list: function(search, method){
            var url = '/fangofmongo/rest/mongo/' + encodeURIComponent(this.options['host']) + '/' + encodeURIComponent(this.options['port']) + '/';
            var params = '';
            if (search != '') { params += 'search=' + encodeURIComponent(search); };
            if (method != '') { params += '&method=' + encodeURIComponent(method); };
            if (params != '') { params  = '?' + params; };
            //alert('json url: ' + url+'databases/');            
            $.getJSON( url + 'databases/' + params,
                function(data, search, method){
                
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'database_list_received', this, {'search':search, 'method':method, 'data' :  data['data'] } );

                });

        }, //end of get_db_list:


        /* Get list of collections from mongo server
           params:
               search (string, optional): text to search
               method (string, optional): search method, either null (text search) or 're' (search will be interpreted as regular expression)
        */
        get_collection_list: function(search, method){
            var url = '/fangofmongo/rest/mongo/' + this.options['host'] + '/' + this.options['port'] + '/';
            var params = '';
            if (search != '') { params += 'search=' + encodeURIComponent(search); };
            if (method != '') { params += '&method=' + encodeURIComponent(method); };
            if (params != '') { params  = '?' + params; };
            try{
            $.getJSON( url + 'collections/'+ encodeURIComponent(this.options['database'])  +'/' + params,
                function(data,search, method){
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'collection_list_received', this, {'search':search, 'method':method, 'data' :  data['data'] } );
                        
                }
            ); //end of $.getJSON
                
            } catch(e) {alert(e);};


        }, // end of get_collection_list

        /*
            retrieve collection statistics for selected collection
        */
        get_collection_stats: function(){
            var url = '/fangofmongo/rest/mongo/' + encodeURIComponent(this.options['host']) + '/' + encodeURIComponent(this.options['port']) + '/';
            var params = '';
            if (params != '') { params  = '?' + params; };
            try{
            $.getJSON( url + 'collection/' + encodeURIComponent(this.options['database'])  +'/' + encodeURIComponent(this.options['collection']) + '/stats/' + params,
                function(data){
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'collection_stats_received', this, {'data' :  data['data'] } );
                        
                }
            ); //end of $.getJSON
                
            } catch(e) {alert(e);};


        }, // end of get_collection_stats


        /*
            get documents matching given criteria
                params:
                    query: JSON representing query
                    options: dictionary with:
                        limit: number of documents to retrieve
                        skip: how many documents ommit from results
                        sorting: sort order, in mongo format: array of arrays ["fieldname", "ordering"], for example: [["_id",1]]
                        callback: callback function
                        context: context object
            returns JSON with results
        */
        get_data: function(query, options){ 
            var url = '/fangofmongo/rest/mongo/' + encodeURIComponent(this.options['host']) + '/' + encodeURIComponent(this.options['port']) + '/';
            var params = '';
            query_data = {
                  q: JSON.stringify(query),
                  limit: options['limit'],
                  skip: options['skip']
                };
            if (options['sort'])
                query_data['sort'] = JSON.stringify(options['sort']);
            $.ajax({
                url: url + 'collection/' + this.options['database']  + '/' + this.options['collection'] + '/query/' + params,
                dataType: 'json',
                data: query_data,
                success: options['callback'],
                context: ('context' in options) ? options['context'] : null,
            });
        }, //end of get_data

   signal: function(signal_name, signal_source, signal_data ) {
        if (signal_name == 'database_selected')
        {
            this.options['database'] = signal_data['database'];

        }
        if (signal_name == 'collection_selected')
        {
            this.options['collection'] = signal_data['collection'];

        }                
   },    

    }); //end of widget ui.fom_object.db
$.widget("ui.fom_object_mongo_ajax", Fom_mongo_ajax); 



/**
*
*       Init UI objects
*
*/

//init bus
$('#mongo_ui_header_tools_bus').fom_bus();
$('#mongo_ui_container').append("<div id='mongo_ajax'></div>");
$('#mongo_ajax').fom_object_mongo_ajax({'host':connection_params['host'], 'port': connection_params['port'], 'database' : null, 'collection' : null });

//init console
//$('#mongo_ui_container').append("<div id='mongo_console'></div>");
//$('#mongo_console').fom_console();

//initialize all plugins
fom_init_plugins();
//tell everybody we are starting the party
$(window).load( function() {
    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'app_init', this, {} );
});
//hide error msg
$('#errormsg').hide();


}); //end of function

} //end of fom_init_mongo_ui


