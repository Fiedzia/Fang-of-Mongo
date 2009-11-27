/* Fang of Mongo init function. So the world begins... */
//$('#errors').ajaxError(function(){ $(this).append("<li>Error requesting page.</li>"); }); 

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
        //alert('sending' + signal_name);
        $.ui.fom_object.prototype.signal.call(this);
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
//end of data bus


/**
*
*       Console ui object
*
*/

Fom_ui_console = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        $.ui.fom_object.prototype._init.call(this); // call the original function 
        this.dialog_id = this.options['div_id'] + '_dialog';
        this.console_id = this.options['div_id'] + '_console_div';
        this.input_id = this.options['div_id'] + '_input';
        this.button_id = this.options['div_id'] + '_button';

        $('#' + this.options['div_id']).append("<div id='" + this.dialog_id + "'><input type='text' name='" + this.input_id +"' id='" + this.input_id + "'/><button id='" + this.button_id + "'>Run</button><div id='" + this.console_id + "'></div></div>");
        var my_id = '#' + this.options['div_id'];
        var input_id = this.input_id;
        $('#' + this.button_id).click(function() { $(my_id).trigger('console_exec', [$('#' + input_id).get(0).value]) } );
        $('#' + this.input_id).keyup(function(event) { if (event.keyCode == 13) { $(my_id).trigger('console_exec', [$('#' + input_id).get(0).value]) }} );                


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
            //fix for jqueryui - remember dialog position between open/close. Already fixed in jqueryui trunk
            beforeclose: function(){
                $(this).dialog('option', 'position', [$(this).offset().left, $(this).offset().top]);
                $(this).dialog('option', 'width', $(this).width());
                $(this).dialog('option', 'height', $(this).height());
            },


            

     }); //end of dialog

     $('#' + this.dialog_id).dialog('open');
     var dialog_id = this.dialog_id;
     $('#' + this.options['tool_button_id']).click(function () { $('#' + dialog_id).dialog('isOpen')? $('#' + dialog_id).dialog('close') : $('#' + dialog_id).dialog('open');});

    }, 
    
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_ui_console", Fom_ui_console); 


//end of console ui object


/**
*
*       Console object
*
*/

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
        //alert('db received signal' + signal_name);
        if (signal_name == 'app_init')
        {

        }
        if ( signal_name == 'database_selected')
        {
            $('#mongo_ui_console_dialog').dialog('option','title','Mongo console [' + signal_data['database'] + ']');
            //$('#mongo_ui_database_list').fom_ui_list('set_list', signal_data['data'], signal_data['search'], signal_data['method']);
        }
        if ( signal_name == 'collection_selected')
        {
            var db_name = $('#mongo_ajax').fom_object_mongo_ajax('option','database');
            $('#mongo_ui_console_dialog').dialog('option','title','Mongo console [' + db_name + ' -> ' + signal_data['collection'] + ']');
        }        
   },
   exec_cmd: function(cmd){
   //alert('cmd:'+ cmd);
   },
    destroy: function(){ 
        $.ui.fom_object.prototype.destroy.call(this); // call the original function 
    }, 
}); 
$.widget("ui.fom_console", Fom_console); 
//end of console

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
        this.input_id = this.options['div_id'] + '_input';
        this.search_id = this.options['div_id'] + '_search';
        this.clear_id = this.options['div_id'] + '_clear';
        
        $('#' + this.options['div_id']).append("<div id='" + this.dialog_id + "'><input type='text' name='" + this.input_id +"' id='" + this.input_id + "'/><button id='" + this.search_id + "'>Search</button><button id='" + this.clear_id + "'>Clear</button><div id='" + this.item_list_id + "'></div></div>");
        var my_id = '#' + this.options['div_id'];
        var search_id = this.search_id;
        var clear_id = this.clear_id;
        var input_id = this.input_id;
     
     //dialog - item list
     $('#' + this.options['div_id'] + '_dialog').dialog({
            autoOpen: true,
            height: 200,
            width: 200,
            modal: false,
            closeOnEscape: false,
            title: this.options['title'],
            buttons: {},
            position : this.options['position'],
            //fix for jqueryui - remember dialog position between open/close. Already fixed in jqueryui trunk
            beforeclose: function(){
                $(this).dialog('option', 'position', [$(this).offset().left, $(this).offset().top]);
                $(this).dialog('option', 'width', $(this).width());
                $(this).dialog('option', 'height', $(this).height());
            },

     }); //end of dialog

     $('#' + this.dialog_id).dialog('open');
     var dialog_id = this.dialog_id
     $('#' + this.options['tool_button_id']).click(function () { $('#' + dialog_id).dialog('isOpen')? $('#' + dialog_id).dialog('close') : $('#' + dialog_id).dialog('open');});
     
     $('#' + search_id).click(function() { $('#' + dialog_id).dialog('option','title','Databases ~' + $('#' + input_id).get(0).value); $(my_id).trigger('search', [$('#' + input_id).get(0).value]) } );     
     $('#' + clear_id).click(function() { $('#' + dialog_id).dialog('option','title','Databases'); $('#' + input_id).get(0).value = ''; $(my_id).trigger('search', ['']) } );     
     $('#' + input_id).keyup(function(event) { if (event.keyCode == 13) { $('#' + dialog_id).dialog('option','title','Databases ~' + $('#' + input_id).get(0).value ); $(my_id).trigger('search', [$('#' + input_id).get(0).value]) }} );                
     

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
            if (search != '') { params += 'search=' + search; };
            if (method != '') { params += '&method=' + method; };
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
$('#mongo_ajax').fom_object_mongo_ajax({'host':'localhost', 'port': 27017, 'database' : null, 'collection' : null });
//init console
$('#mongo_ui_container').append("<div id='mongo_console'></div>");
$('#mongo_console').fom_console();
//initialize all plugins
fom_init_plugins();
//tell everybody we are starting the party
$('#mongo_ui_header_tools_bus').fom_bus('signal', 'app_init', this, {} );
//hide error msg
$('#errormsg').hide();


}); //end of function

} //end of fom_init_mongo_ui


