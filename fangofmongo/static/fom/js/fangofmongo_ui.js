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
     this.listeners = new Array();
     this.active = false;
     alert('root init');
   },
//   value: function(a) { return a; },
   length: function ( ) { return this.listeners.length;  },
   active:  function ( ) { return this.active;  },
   add_listener: function(listener) {
      this.listeners[this.listeners.length] = listener;
   },

   del_listener: function(listener) {
      // internal functions should be named begin with an underscore
      // manipulate the widget
      for(var i = this.listeners.length; i>=0; i++)
      {
        if (this.listeners[i] == listener) this.listeners.splice(i, 1);
      }
   },
   signal: function(signal_name, signal_source, signal_data ) {
    //this.signal[this.signals.length] = signal_name;
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




$('#mongo_ui_container').fom_object();
$('#mongo_ui_container').fom_object('signal', 's');


 
/*

     //fom_dialog_db - database list
     $("#fom_dialog_db").dialog({
            autoOpen: true,
            height: 200,
            width: 200,
            modal: false,
            closeOnEscape: false,
            buttons: {},
            position : ['left',100],

     }); //end of $("#fom_dialog_db").dialog

     $('#fom_dialog_db').dialog('open');
     $('#mongo_ui_header_tools_db').click(function () { $('#fom_dialog_db').dialog('isOpen')? $('#fom_dialog_db').dialog('close') : $('#fom_dialog_db').dialog('open');});

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

     $('#errormsg').hide();
*/
    }); //end of function



    /*
        DATABASE ACCESS
    */
    $(function() {
    $.widget("ui.fom_object.db", {
        _init: function() {
            this.host = null;
            this.port = null;
            this.collection = null;
            this.database = null;
        },

        get_db_list: function(search, method){
        
            var url = '/fangofmongo/rest/mongo/' + this.host + '/' + this.port + '/';
            var params = '';
            if (search != '') { params += 'search=' + search; };
            if (method != '') { params += '&method=' + method; };
            if (params != '') { params  = '?' + params; };
            
            $.getJSON( url + 'databases/' + params,
                function(data){
                
                    if ( 'error' in data ) { alert(data['error']); return; }
                    //$('#fom_dialog_db_list').empty()
                    //$.each(data['data'], function(){ var dn = document.createElement('div'); dn.fom_db = this; dn.innerHTML = escape_html(this);  $('#fom_dialog_db_list').append( dn ); });
                    //$('#fom_dialog_db_list').children().click(function(){ connection_params.db = this.innerHTML;  fom_load_colls() });
                });

        }, //end of load_db_list:

        get_collection_list: function(search, method){

            var url = '/fangofmongo/rest/mongo/' + this.host + '/' + this.port + '/';
            var params = '';
            if (search == '') { params += 'search=' + search; };
            if (method == '') { params += '&method=' + method; };
            if (params != '') { params  = '?' + params; };
            try{
            $.getJSON( url + 'collections/'+ this.database  +'/' + params,
                function(data){
                    if ( 'error' in data ) { alert(data['error']); return; }
                    //$('#fom_dialog_coll_list').empty()
                    //$.each(data['data'], function(){ $('#fom_dialog_coll_list').append('<div>' +  this + '</div>') });
                    //$.each(data['data'], function(){ var dn = document.createElement('div'); dn.fom_coll = this; dn.innerHTML = escape_html(this);  $('#fom_dialog_coll_list').append( dn ); });
                   //$('#fom_dialog_db_list').children().click(function(){ fom_load_coll(this) });
                        
                }
            ); //end of $.getJSON
                
            } catch(e) {alert(e);};


        },


    }); //end of widget ui.fom_object.db

    }); //end of function



} //end of fom_init_mongo_ui






