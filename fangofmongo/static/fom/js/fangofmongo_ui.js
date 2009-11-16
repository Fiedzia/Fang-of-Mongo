/* Fang of Mongo init function. So the world begins... */
//$('#errors').ajaxError(function(){ $(this).append("<li>Error requesting page.</li>"); }); 

function fom_init_mongo_ui()
/*
    Base class for fom gui objects
*/
{

$(function() {

$.widget("ui.fom_object", {
   _init: function() {
     // init code for mywidget
     // can use this.options
     this.active = false;
     //alert('root init');
   },
   //value: function(a) { return a; },
   length: function ( ) { return this.listeners.length;  },
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
     hidden: true
   }
 });
//end of fom_object

/*
Fom_object2 = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        alert('inherited init');
    }, 
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_object2", Fom_object2); 
*/


/**
*
*       Data bus
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

    add_listener: function(listener) {
        this.listeners[this.listeners.length] = listener;
    },

    signal: function(signal_name, signal_source, signal_data ) {
        $.ui.fom_object.prototype.signal.call(this);
        //alert('bus received signal' + signal_name);
        for ( var obj in this.listeners)
        {
            this.listeners[obj].signal(signal_name, signal_source, signal_data);
        };
    },

    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_bus", Fom_bus); 


/**
*
*       Item list ui object
*
*/

Fom_item_list = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        this.dialog_id = this.options['div_id'] + '_dialog';
        this.item_list_id = this.options['div_id'] + '_list';
        this.input_id = '#' + this.options['div_id'] + '_input';

        $('#' + this.options['div_id']).append("<div id='" + this.dialog_id + "' title='" + this.options['title'] + "'><input type='text' name='" + this.input_id +"' id='fom_input_db'/><div id='" + this.item_list_id + "'></div></div>");
     
     
     //dialog - item list
     $('#' + this.options['div_id'] + '_dialog').dialog({
            autoOpen: true,
            height: 200,
            width: 200,
            modal: false,
            closeOnEscape: false,
            buttons: {},
            position : ['left',100],

     }); //end of dialog

     $('#' + this.dialog_id).dialog('open');
     var dialog_id = this.dialog_id
     $('#' + this.options['tool_button_id']).click(function () { $('#' + dialog_id).dialog('isOpen')? $('#' + dialog_id).dialog('close') : $('#' + dialog_id).dialog('open');});

    }, 
    set_list: function(item_list, search, method){
        var id_name = '#' + this.item_list_id;
        $('#' + this.item_list_id).empty();
        $.each(item_list, function(){ var dn = document.createElement('div'); dn.fom_db = this; dn.innerHTML = escape_html(this);  $(id_name).append( dn ); });
        var my_id = '#' + this.options['div_id'];
        $('#' + this.item_list_id).children().click(function(){ $(my_id).trigger('fom_item_selected', [this.fom_db]);}); 
    },
    
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_ui_list", Fom_item_list); 


//end of item list ui object

/**
*
*       Database list
*
*/

Fom_db_list = $.extend({}, $.ui.fom_object.prototype, {
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        $('#mongo_ui_header_tools_bus').fom_bus('add_listener', this);
        $('#mongo_ui_container').append("<div id='mongo_ui_database_list'></div>");
        $('#mongo_ui_database_list').fom_ui_list({'title':'Databases', 'div_id': 'mongo_ui_database_list', 'tool_button_id' : 'mongo_ui_header_tools_db' });
        $('#mongo_ui_database_list').bind('fom_item_selected', function(e, dbname){  $('#mongo_ui_header_tools_bus').fom_bus('signal', 'database_selected', this, {'database': dbname } ); });
    }, 
   signal: function(signal_name, signal_source, signal_data ) {
        //alert('db received signal' + signal_name);
        if (signal_name == 'app_init')
        {
            $('#mongo_ajax').fom_object_mongo_ajax('get_db_list','','')
        }
        if ( signal_name == 'database_list_received')
        {
            $('#mongo_ui_database_list').fom_ui_list('set_list', signal_data['data'], signal_data['search'], signal_data['method']);
        }
   },    
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_object_db", Fom_db_list); 
//end of database list

/**
*
*       Collection list
*
*/

Fom_coll_list = $.extend({}, $.ui.fom_object.prototype, {
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        $('#mongo_ui_header_tools_bus').fom_bus('add_listener', this);
        $('#mongo_ui_container').append("<div id='mongo_ui_collection_list'></div>");
        $('#mongo_ui_collection_list').fom_ui_list({'title':'Collections', 'div_id': 'mongo_ui_collection_list', 'tool_button_id' : 'mongo_ui_header_tools_coll' });
        $('#mongo_ui_collection_list').bind('fom_item_selected', function(e, dbname){  $('#mongo_ui_header_tools_bus').fom_bus('signal', 'collection_selected', this, {'collection': dbname } ); });
    }, 
        
   signal: function(signal_name, signal_source, signal_data ) {
        //alert('colls received signal' + signal_name);
        if (signal_name == 'database_selected')
        {
            $('#mongo_ajax').fom_object_mongo_ajax('get_collection_list','','')
        }        
        if ( signal_name == 'collection_list_received')
        {
            $('#mongo_ui_collection_list').fom_ui_list('set_list', signal_data['data'], signal_data['search'], signal_data['method']);
        }


    },    
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_object_colls", Fom_coll_list); 
//end of collection list



/*
        DATABASE ACCESS
*/



Fom_mongo_ajax = $.extend({}, $.ui.fom_object.prototype, {    
//    $.widget("ui.fom_object_mongo_ajax", {

        _init: function() {
        $('#mongo_ui_header_tools_bus').fom_bus('add_listener', this);
        
            //this.host = null;
            //this.port = null;
            //this.collection = null;
            //this.database = null; },
       },     
            


        get_db_list: function(search, method){
            var url = '/fangofmongo/rest/mongo/' + this.options['host'] + '/' + this.options['port'] + '/';
            var params = '';
            if (search != '') { params += 'search=' + search; };
            if (method != '') { params += '&method=' + method; };
            if (params != '') { params  = '?' + params; };
            //alert('json url: ' + url+'databases/');            
            $.getJSON( url + 'databases/' + params,
                function(data, search, method){
                
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'database_list_received', this, {'search':search, 'method':method, 'data' :  data['data'] } );

                });

        }, //end of load_db_list:



        get_collection_list: function(search, method){

            var url = '/fangofmongo/rest/mongo/' + this.options['host'] + '/' + this.options['port'] + '/';
            var params = '';
            if (search == '') { params += 'search=' + search; };
            if (method == '') { params += '&method=' + method; };
            if (params != '') { params  = '?' + params; };
            try{
            $.getJSON( url + 'collections/'+ this.options['database']  +'/' + params,
                function(data,search, method){
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'collection_list_received', this, {'search':search, 'method':method, 'data' :  data['data'] } );
                        
                }
            ); //end of $.getJSON
                
            } catch(e) {alert(e);};


        },

   signal: function(signal_name, signal_source, signal_data ) {
        //alert('mongo ajax received signal' + signal_name);
        if (signal_name == 'database_selected')
        {
            this.options['database'] = signal_data['database'];

        }        
   },    

    }); //end of widget ui.fom_object.db
$.widget("ui.fom_object_mongo_ajax", Fom_mongo_ajax); 




/**
*
*       Init UI objects
*
*/


$('#mongo_ui_header_tools_bus').fom_bus();

$('#mongo_ui_container').fom_object();

$('#mongo_ui_container').append("<div id='mongo_ajax'></div>");

$('#mongo_ajax').fom_object_mongo_ajax({'host':'localhost', 'port': 27017, 'database' : null, 'collection' : null });



$('#mongo_ui_header_tools_db').fom_object_db();
$('#mongo_ui_header_tools_coll').fom_object_colls();

$('#mongo_ui_header_tools_bus').fom_bus('signal', 'app_init', this, {} );

$('#errormsg').hide();




}); //end of function

} //end of fom_init_mongo_ui


/*

     //fom_dialog_coll - collection list
     $("#fom_dialog_coll").dialog({
            autoOpen: true,
            height: 200,
            width: 200,
            modal: false,
            closeOnEscape: false,
            buttons: {},
            position : ['left',350],

     }); //end of $("#fom_dialog_coll").dialog

     $('#fom_dialog_coll').dialog('open');
     $('#mongo_ui_header_tools_coll').click(function () { $('#fom_dialog_coll').dialog('isOpen')? $('#fom_dialog_coll').dialog('close') : $('#fom_dialog_coll').dialog('open');});

     //fom_console_dialog 
     $("#fom_console_dialog").dialog({
            autoOpen: true,
            height: 450,
            width: 500,
            modal: false,
            closeOnEscape: false,
            buttons: {},
            position : [250,100],

     }); //end of $("#fom_dialog_coll").dialog
     $('#mongo_ui_header_tools_console').click(function () { $('#fom_console_dialog').dialog('isOpen')? $('#fom_console_dialog').dialog('close') : $('#fom_console_dialog').dialog('open');});

     $('#fom_dialog_coll').dialog('open');


     //get database list
     fom_load_db();

*/







