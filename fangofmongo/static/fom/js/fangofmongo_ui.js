/* Fang of Mongo init function */

function fom_init_mongo_ui()
/*
    Base class for all fom objects
*/
{

$(function() {


/*
  Base class for fom objects
*/
$.widget("ui.fom_object", {
   _init: function() {
     // init code for mywidget
     var defaults = {
         
     };
     this.options  = $.extend({}, defaults, this.options);
     //alert('d:'+this.options.disabled);
     // can use this.options

   },
   //set_enabled(enabled) {}
   //value: function(a) { return a; },
   //length: function ( ) { return this.listeners.length;  },

   signal: function(signal_name, signal_source, signal_data ) {

   },

   destroy: function() {
       $.widget.prototype.apply(this, arguments); // default destroy
        // now do other stuff particular to this widget
   }
 });


 $.extend($.ui.fom_object, {
   getters: "value length",
   /*defaults: {
     //hidden: true
   }*/
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
* Query builder elemen
*/

Fom_query_builder = $.extend({}, $.ui.fom_object.prototype,{
    _init: function(){ 
        var defaults = {
            autocomplete: true,
            completion_source: [],
            layout: 'vertical', //horizontal or vertical
        };
        this.options  = $.extend({}, defaults, this.options);

        $.ui.fom_object.prototype._init.call(this); // call the original function
        var this_obj = this;
        this.div = $('#' + this.options['div_id']);
        $(this.div).addClass('fom_query_builder');
        if(this.options['layout'] == 'horizontal') {
            $(this.div).append('<table>\
                                    <tr>\
                                        <td>Field</td>\
                                        <td><button class="fom_query_builder_btn_add" title="add condition">+</button></td>\
                                    </tr>\
                                    <tr>\
                                        <td>Condition</td>\
                                        <td><button class="fom_query_builder_btn_del" title="remove condition">-</button></td>\
                                    </tr>\
                                    <tr>\
                                        <td>Value</td>\
                                        <td></td>\
                                    </tr>\
                                </table>');
        } else { //vertical layout
            $(this.div).append('<table><tr><td><button class="fom_query_builder_btn_add" title="add condition">+</button></td><td><button class="fom_query_builder_btn_del" title="remove condition">-</button></td></tr></table>');
        };
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
        var qb_field_condition = $('\
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
                                <option value="$elemMatch">matches element</option>\
                                <option value="$where">matches condition ($where)</option>\
                            </select>\
        ');
        var qb_field_name = $('<input type="text" value="" class="fom_query_builder_field_name"/>')
            .autocomplete({ minLength:0, source:this.options.completion_source})
            .css('display','inline');
        var qb_field_btn = $("<button>&nbsp;</button>")
            .attr("tabIndex", -1)
            .attr("title", "Show all field names")
            .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                }).removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-button-icon")
                .click(function() {
                    // close if already visible
                    if (qb_field_name.autocomplete("widget").is(":visible")) {
                        qb_field_name.autocomplete("close");
                        return;
                    }
                    // pass empty string as value to search for, displaying all results
                    qb_field_name.autocomplete("search", "");
                    qb_field_name.focus();
                });


        var qb_field_value = $('<input type="text" class="fom_query_builder_field_value"/>');

        if(this.options['layout'] == 'horizontal') {
            var rows = $(this.table).find('tr');
            $(rows[0]).append($('<td />').html($(qb_field_name).add(qb_field_btn)));
            $(rows[1]).append($('<td></td>').append(qb_field_condition));
            $(rows[2]).append($('<td></td>').append(qb_field_value));
        } else { //vertical layout
            var new_row = $('<tr></tr>').html(
                 $('<td/>').html('Field')
                     .add( $('<td/>').html($(qb_field_name).add(qb_field_btn)))
                     .add( $('<td/>').html(qb_field_condition))
                     .add( $('<td/>').html(qb_field_value))
             );
            $(this.table).find('tr').last().before(new_row);
        }
        this.build_query();

    },
    clear_query: function() {
        if(this.options['layout'] == 'horizontal') {
            var rows = $(this.table).find('tr');
            while ($(rows[0]).children('td').length > 3) {
                    $(rows[0]).children('td:last-child').remove();
                    $(rows[1]).children('td:last-child').remove();
                    $(rows[2]).children('td:last-child').remove();
            }

            $($(rows[0]).children('td')[2]).children('input').val('');
            $($(rows[1]).children('td')[2]).children('select').get(0).selectedIndex=0;
            $($(rows[2]).children('td')[2]).children('input').val('');
        } else { //vertical layout
            while(rows = $(this.table).find('tr'), rows.length > 2) {
                rows.last().prev().remove();
            }
            $(rows.last().prev().children('td')[1]).children('input').val('');
            $(rows.last().prev().children('td')[2]).children('select').get(0).selectedIndex=0;
            $(rows.last().prev().children('td')[3]).children('input').val('');
        }

    },
    del_query: function() {
        if(this.options['layout'] == 'horizontal') {
            var rows = $(this.table).find('tr');

            if ($(rows[0]).children('td').length > 3) {
                    $(rows[0]).children('td:last-child').remove();
                    $(rows[1]).children('td:last-child').remove();
                    $(rows[2]).children('td:last-child').remove();
            }
        } else { //vertical layout
            if($(this.table).find('tr').length > 2)
                $(this.table).find('tr').last().prev().remove();
        }
        
        
        
    },
    
    build_query: function() {
    /*
    FIXME: detect if adding new query condition conflicts with existing ones
        function enhance_query(q, f, cond){
            if (!(f in q)) {
                q[f]  = cond;
            } else {
                //check conflicting queries
            };
            return q;
        }*/
        
        var field_names = $(this.table).find('.fom_query_builder_field_name');
        var field_conditions = $(this.table).find('.fom_query_builder_field_condition');
        var field_values = $(this.table).find('.fom_query_builder_field_value');
        
        var rows = $(this.table).find('tr');

        var query = {};
        for(var i=0; i<field_names.length; i++)
        {
            var field = $(field_names[i]).val();
            var condition = $(field_conditions[i]).val();
            var value = $(field_values[i]).val();
            
            try {
                if (value != "")
                value = $('#fom_utils').fom_utils('json_to_strict', eval('res=' + value));
             } catch(e) {
                 alert('query parsing error:' + e + ' for value:' + value )
                 throw(e);
             };

            if ((field == "" && condition != "$where") || condition =="_ignore") continue;
            switch(condition) {
                case '$exists':
                    q = {}
                    q[field]={$exists: true}
                    $.extend(true, query, q);
                    break;
                case '$nexists':
                    q = {}
                    q[field]={$exists: false}
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
                    q[field][condition] = value;
                    $.extend(true, query, q);
                    break;
                case '$in':
                case '$nin':
                    q = {}
                    q[field] = {};
                    q[field][condition] = value;
                    $.extend(true, query, q);
                    break;
                case '$all':
                    q = {}
                    q[field] = {$all: value};
                    $.extend(true, query, q);
                    break;
                case '$size':
                    q = {}
                    q[field] = {$size: value};
                    $.extend(true, query, q);
                    break;
                case '$type':
                    q = {}
                    q[field] = {$type: value};
                    $.extend(true, query, q);
                    break;
                case '$re':
                    q = {}
                    q[field] = value;//{$regex:value};
                    $.extend(true, query, q);
                    break;
                case '$elemMatch':
                    //alert('val:' + JSON.stringify(value));
                    q = {}
                    q[field] = {$elemMatch: value};
                    //query[field] = q;
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

    /*
        pass array of values to field name autocomplete widget
    */
    completion_source: function(completions) {
        this.options.completion_source = completions;
        $(this.table).find('tr td input.fom_query_builder_field_name').autocomplete({minLength:0, source: completions});
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

}, 
    length: function ( ) { return this.listeners.length;  },

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
*       Console ui object - commented out, but I'LL BE BACK)
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
        this.options['has_selected'] = false;
        this.dialog_id = this.options['div_id'] + '_dialog';
        this.item_list_id = this.options['div_id'] + '_list';
        this.input_id = this.options['div_id'] + '_input';
        this.search_id = this.options['div_id'] + '_search';
        this.clear_id = this.options['div_id'] + '_clear';
        var this_obj = this;
        
        $('#' + this.options['div_id']).append("\
        <div id='" + this.dialog_id + "'>\
          <div style='width: 99%; height: 99%; display: table;'>\
            <div style='display: table-row;  height: auto;'>\
              <div style=' display: table-cell; height: 99%; '>\
                <div class='fom_ui_note'></div>\
                <div class='fom_ui_list_items'>\
                  <div style='width: 99%;' id='" + this.item_list_id + "'></div>\
                </div>\
              </div>\
            </div>\
            <div style='display: table-row; height: auto;'>\
              <div class='search_toolbox' style=' height: auto; display: table-cell;'>\
                <input type='text' name='" + this.input_id +"' id='" + this.input_id + "'/>\
                <button id='" + this.search_id + "'>Search</button>\
                <button id='" + this.clear_id + "'>Clear</button>\
              </div>\
            </div>\
            <div style='display: table-row; height: auto;'>\
              <div class='toolbox' style='height: auto; display: table-cell;'></div>\
            </div>\
          </div>\
        </div>");
        
        var my_id = '#' + this.options['div_id'];
        var search_id = this.search_id;
        var clear_id = this.clear_id;
        var input_id = this.input_id;
        this.toolbox = $('#'+this_obj.dialog_id).find('.toolbox').get(0);
        this.search_toolbox = $('#'+this_obj.dialog_id).find('.search_toolbox').get(0);
        $(this.toolbox).hide();
        $(this.search_toolbox).hide();
     
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
                close: function() {$(my_id).trigger('close', []);},

        }); //end of dialog
        
        //show/hide toolbox (set of icons witl operations on selected element)
        
        $('#' + this.dialog_id).hover(function(event, ui) {
            if(! this_obj.options['disabled'])
                $(this_obj.search_toolbox).show();
                $(this_obj.toolbox).show();
        });
        
        $('#' + this.dialog_id).mouseleave(function(event, ui) {
            //if(! this_obj.options['disabled'])
                $(this_obj.search_toolbox).hide();
                $(this_obj.toolbox).hide();
        });


        $('#' + this.dialog_id).dialog('open');
        var dialog_id = this.dialog_id;
        $('#' + this.options['tool_button_id']).click(function () {
            $('#' + dialog_id).dialog('isOpen')? $('#' + dialog_id).dialog('close') : $('#' + dialog_id).dialog('open');
        });
        $('#' + this.search_id).button();
        $('#' + this.clear_id).button();

        //set title properly when appending filter there
        $('#' + dialog_id).dialog('option','title_prefix',this.options['title']);

        $('#' + search_id).click(function() {
            search_term = $('#' + input_id).get(0).value.trim();
            if (search_term != '')
              dialog_title = $('#' + dialog_id).dialog('option','title_prefix')+' ~' + search_term;
            else
              dialog_title = $('#' + dialog_id).dialog('option','title_prefix');
            
            $('#' + dialog_id).dialog('option','title', dialog_title); $(my_id).trigger('search', [$('#' + input_id).get(0).value])
        });     
        $('#' + clear_id).click(function() {
            $('#' + dialog_id).dialog('option','title',$('#' + dialog_id).dialog('option','title_prefix'));
            $('#' + input_id).get(0).value = '';
            $(my_id).trigger('search', [''])
        });
        
        $('#' + input_id).keyup(function(event) {
            if (event.keyCode == 13) {
                $('#' + search_id).click();
            }
        })
        
        if (this.options.disabled) {
            this.disable();
        };

    }, //end of _init
    
    /*
      Set list of items
    */
    set_list: function(item_list, search, method){
        var id_name = '#' + this.item_list_id;
        var this_obj = this;
        this.options['has_selected'] = false;
        $('#' + this.item_list_id).empty();
        $.each(item_list, function(){
            var dn = document.createElement('div');
            dn.fom_db = this;
            $(dn).addClass('fom_ui_list_item');
            dn.innerHTML = $('#fom_utils').fom_utils('escape_html', this);
            $(id_name).append( dn );
        });
        var my_id = '#' + this.options['div_id'];
        $('#' + this.item_list_id).children().click(function(){
            $(id_name).children().each(function() {
                $(this).removeClass('fom_ui_list_item_selected');
            });
            $(this).addClass('fom_ui_list_item_selected');
            this_obj.options['has_selected'] = true;
            $(my_id).trigger('fom_item_selected', [this.fom_db]);
        }); 
    }, //end of set_list
    
    get_ui_element: function(element) {
        switch(element) {
            case 'search_input': return $('#' + this.input_id);
            case 'search_btn': return $('#' + this.search_id);
            case 'clear_btn': return  $('#' + this.clear_id);
            case 'toolbox': return $(this.toolbox);
            default: return null;
        };
    },
    
    /*
    *  Clear items
    */
    clear: function() {
        this.options['has_selected'] = false;
        $('#' + this.item_list_id).empty();
    },
    
    enable: function() {
        this.set_enabled(true);
    },
    
    disable: function() {
        this.set_enabled(false);
    },
    
    /*
        Check if database has selected items
    */
    has_selected: function(){
        return this.options['has_selected'];
    },

    /*
        Helper: single function for enabling/disabling 
    */
    set_enabled: function(enabled) {
        if (enabled) {
            $.ui.fom_object.prototype.enable.call(this); // call the original function 
            method = 'enable';
        } else {
            method = 'disable';
            $.ui.fom_object.prototype.disable.call(this); // call the original function 
        }
        $('#' + this.dialog_id ).dialog(method);
        $('#' + this.search_id).button(method);
        $('#' + this.clear_id).button(method);
        $('#' + this.input_id).attr('disabled', !enabled);

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


        /*
         *  run command against database
         *  params:
         *      command: Object with command to perform
         */
        run_command: function(database, command, callback){
            var url = '/fangofmongo/rest/mongo/' + encodeURIComponent(this.options['host']) + '/' + encodeURIComponent(this.options['port']) + '/';
            url += 'database/' + encodeURIComponent(database) + '/cmd/'
            $.getJSON( url,
                {cmd:JSON.stringify(command)},
                function(data){
                    if ( 'error' in data ) { alert('error: ' + data['error']); return data; }
                    //alert(JSON.stringify(data));
                    callback(data);

                });

        }, //end of run_command

        /* Get list of databases from mongo server
           params:
               search (string, optional): text to search
               method (string, optional): search method, either null (text search) or 're' (search will be interpreted as regular expression)
        */
        get_db_list: function(search, method){
            this.run_command('admin',  //database
                {listDatabases : 1},   //command
                function(data) {       // callback
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    var db_list = Array();
                    for(obj in data['data']['databases'])
                    {
                        db_list.push(data['data']['databases'][obj]['name']);
                    }
                    db_list.sort();

                    if(search) {
                        db_list = $('#fom_utils').fom_utils('filter_list',db_list, search, method);
                    }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'database_list_received', this, {'search':search, 'method':method, 'data' :  db_list } );
                }
            );

        }, //end of get_db_list:


        /* Get list of collections from mongo server
           params:
               search (string, optional): text to search
               method (string, optional): search method, either null (text search) or 're' (search will be interpreted as regular expression)
        */
        get_collection_list: function(search, method){

            this.get_data(
                {$where :'this.name.indexOf("' + this.options['database'] + '.") == 0 && this.name.indexOf("$") == -1'}, 
                {
                    sort: [['name',1]],
                    callback: function(data){
                        if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                        var coll_list = Array();
                        for(obj in data['data'])
                            coll_list.push(data['data'][obj]['name'].substr(this.options['database'].length+1)); //strip database_name and dot
                            if (search)
                                coll_list =  $('#fom_utils').fom_utils('filter_list',coll_list, search, method);
                        $('#mongo_ui_header_tools_bus').fom_bus('signal', 'collection_list_received', this, {'search':search, 'method':method, 'data' :  coll_list } );
                    },
                    context: this,
                    database: this.options['database'],
                    collection: 'system.namespaces'
                }
            );



        }, // end of get_collection_list

        /*
            save document
            options:
                document: json data in strict format
                callback: function to call when we have response
                context
        */
        save_document: function(options) {
            var url = '/fangofmongo/rest/mongo/' + this.options['host'] + '/' + this.options['port'] + '/';
            if (!("document" in options)) {
                throw("save_document: Missing document");
            }

            try {

                $.ajax({
                  type: 'POST',
                  url: url + 'collection/' + encodeURIComponent(this.options['database'])  +'/' + encodeURIComponent(this.options['collection']) + '/save_document/',
                  data: {document: JSON.stringify(options["document"])},
                  dataType: 'json',
                  context: ('context' in options) ? options['context'] : null,
                  success: function(data){
                               if ( 'error' in data ) { alert('error: ' + data['error']);  };
                               if ('callback' in options)
                               options['callback'](data);
                            
                           },
                  error: function(XMLHttpRequest, textStatus, errorThrown) {
                      alert('save_document failed status' + textStatus + ' error:' + errorThrown);
                  },
                });   //end of $.ajax
            } catch(e) {alert(e); throw(e);};
                
            
        }, //end of save_document

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
                
            } catch(e) {alert(e); throw(e);};


        }, // end of get_collection_stats

        /*
            retrieve collection indexes for selected collection
        */
        get_collection_indexes: function(){
            var url = '/fangofmongo/rest/mongo/' + encodeURIComponent(this.options['host']) + '/' + encodeURIComponent(this.options['port']) + '/';
            var params = '';
            if (params != '') { params  = '?' + params; };
            try{
            $.getJSON( url + 'collection/' + encodeURIComponent(this.options['database'])  +'/' + encodeURIComponent(this.options['collection']) + '/indexes/' + params,
                function(data){
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    $('#mongo_ui_header_tools_bus').fom_bus('signal', 'collection_indexes_received', this, {'data' :  data['data'] } );
                        
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
                        sort: sort order, in mongo format: array of arrays ["fieldname", "ordering"], for example: [["_id",1]]
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
            var db = 'database' in options ? options['database'] : this.options['database'];
            var coll = 'collection' in options ? options['collection'] : this.options['collection'];
                        
            if (options['sort'])
                query_data['sort'] = JSON.stringify(options['sort']);
            $.ajax({
                url: url + 'collection/' + encodeURIComponent(db)  + '/' + encodeURIComponent(coll) + '/query/' + params,
                dataType: 'json',
                data: query_data,
                success: options['callback'],
                context: ('context' in options) ? options['context'] : null,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert('get_data failed status' + textStatus + ' error:' + errorThrown);
                },
                
            });
        }, //end of get_data
        
        /*
          Perform operation on mongodb
          params:
              options: dictionary with options. Available options depend on the operation 
                  operation: name of the operations
                  subject: one of: server, database, collection, document
                  callback: function to perform when operation is complete
                  context: context object passed to callback
                  
        */
        
        operation : function(options) {
            if (!('operation' in options) || !('subject' in options)) {
                throw 'operation: missing params';
            }
            var url = '/fangofmongo/rest/mongo/' + encodeURIComponent(this.options['host']) + '/' + encodeURIComponent(this.options['port']) + '/cmd/';
            var data = {};
            switch(options['subject']) {
                case 'server': 
                    switch(options['operation']) {
                        case 'create_database':
                            data['cmd'] = 'create_database';
                            data['database_name'] = options['database_name'];
                        break;
                        case 'drop_database':
                            data['cmd'] = 'drop_database';
                            data['database_name'] = options['database_name'];
                        break;
                        default: throw ('operation: incorrect params');
                    }
                    break;
                case 'database': 
                    switch(options['operation']) {
                        case 'create_collection':
                            data['cmd'] = 'create_collection';
                            data['database'] = options['database']
                            data['collection_name'] = options['collection_name'];
                        break;
                        case 'drop_collection':
                            data['cmd'] = 'drop_collection';
                            data['database'] = options['database']
                            data['collection_name'] = options['collection_name'];
                        break;
                        default: throw ('operation: incorrect params');
                    }
                    break;

                default: throw ('operation: incorrect params');
            }
            $.ajax({
                url: url,
                type: 'POST',
                success: options['callback'],
                data: data,
                dataType: 'json',
                context: ('context' in options) ? options['context'] : null,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert('operation failed status: ' + textStatus + ' error:' + errorThrown);
                },
            });
        },

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

//init utils
$('#fom_utils').fom_utils();
//init bus
$('#mongo_ui_header_tools_bus').fom_bus();
$('#mongo_ui_container').append("<div id='mongo_ajax'></div>");
$('#mongo_ajax').fom_object_mongo_ajax({'host':connection_params['host'], 'port': connection_params['port'], 'database' : null, 'collection' : null });

//init console
//$('#mongo_ui_container').append("<div id='mongo_console'></div>");
//$('#mongo_console').fom_console();

//set locale
$.format.locale({
                    number: {
                        groupingSeparator: ' ',
                        decimalSeparator: '.'
                    }
                });

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


