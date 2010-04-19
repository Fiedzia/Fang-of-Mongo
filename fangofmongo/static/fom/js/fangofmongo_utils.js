/*
  Mongo convenctional helpers
*/

var ObjectId = function(s) {
    return {$oid: s};
};

/*
 Fom jquery extensions
*/

/*
 (function($) {
 
   $.fn.fom_expandable = function(settings) {
     //var config = {'foo': 'bar'};
     //if (settings) $.extend(config, settings);
     var obj = this;
   fom_ui_json_toggle  
     
     this.each(function() {
       // element-specific code here
     });

     return this;
 
   };
 
 })(jQuery);
*/

/*
  Collection of fom utilities
*/

$.widget("ui.fom_utils", {
    _init: function() {
      // init code for mywidget
      // can use this.options
      this.active = false;

    },



    /*
        Convert filesize into human readable units
    */
    format_filesize: function(fsize) 
    {
        if (fsize < 1024) {
            return fsize + ' B';
        } else if (fsize < 1024 * 1024) {
            return (fsize/1024).toFixed(2) + ' KB';
        } else if (fsize < 1024 * 1024 * 1024) {
            return (fsize/(1024 * 1024)).toFixed(2) + ' MB';
        } else if (fsize < 1024 * 1024 * 1024 *1024) {
            return (fsize/(1024 * 1024 * 1024)).toFixed(2) + ' GB';
        } else if (fsize < 1024 * 1024 * 1024 * 1024 *1024) {
            return (fsize/(1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
        } else {
            return fsize + ' B';
        };

    },

    
/*
    expandable: function( node, options ) {
        alert(node);      
        if(options) {
          if ('tag' in options) tag = options['tag'];
          else tag = 'div';
          if ('hide' in options) hide = options['hide'];
          else hide = false;
        }
        else {
            tag = 'span';
            hide = false;
        };
        
    },
*/


    /*
        Format date
    */
    formatDate:function(date, format) {
        //yyyy-mm-dd hh:mm:ss.miliseconds
        return $.format.date(date, format);
    
    },

    /*
    * add event handlers to dom resulted from call to format_mongo_json_data
    * params:
    *   node: dom node (class: fom_ui_json_data)
    *   options: dict of options
    */

    add_json_events:function (node, options)
    {
        if ('expand' in options && options['expand']){
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_value_document').show();
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').html('-');

        } else {
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_value_document').hide();
            $(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').html('+');
        };
        
        $(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').click(function()
            {
                $(this).next().next().toggle();
                $(this).html($(this).next().next().is(':visible')?'-':'+');
            }
        );
    },

    /*
    * format json value as html
    */
    render_json_value: function (value)
    {
        var this_obj = this;
        if (value == null)
        {
            return $('<div />').addClass('fom_ui_json_value_null').html('null');
        }

        switch(value.constructor.name)
        {
            case("Number"):
            case("Boolean"):
                return $('<div />').addClass('fom_ui_json_value_' + value.constructor.name.toLowerCase())
                                   .html($('#fom_utils').fom_utils('escape_html', value+""));
            case("String"):
                return $('<div />').addClass('fom_ui_json_value_' + value.constructor.name.toLowerCase()).html($('#fom_utils').fom_utils('escape_html', value));
            case("Array"):
            {
                resp = $('<div />').addClass('fom_ui_json_value_array').html(function(){
                    var array_content = $('<span>[</span>');
                    for(var i in value)
                    {
                        array_content = array_content.add(this_obj.render_json_value(value[i]));
                    }               
                    var array_content = array_content.add($('<span>]</span>'));
                    return array_content;
                
                
                });
                //resp += ']</div>';
                return resp; 
            }
            case("Object"):
            {
                if ('$date' in value) {
                    var date = new Date(value['$date']);
                    return $('<div />').addClass('fom_ui_json_value_date').html(this.formatDate( date , "yyyy-MM-dd HH:mm:ss.SSS"));
                    }
                    
                if ('$oid' in value)
                    return $('<div />').addClass('fom_ui_json_value_oid').html('ObjectId("' + value['$oid'] + '")');
                    
                resp = $('<div />').addClass('fom_ui_json_value_dict').html(function(){
                    var object_wrapper = $('<span />').html('{').add('<br/>');
                    var object_content = $(null);
                    for (k in value)
                    {
                        v = value[k];
                        object_content = object_content.add($('<div />')
                            .addClass('fom_ui_json_key')
                            .html(
                                $('<span>' + $('#fom_utils').fom_utils('escape_html', JSON.stringify(k)) + '</span>')
                          )
                                .add($('<span/>').html(' : '))
                                .add(this_obj.render_json_value(v))
                                .add($('<br/>'))
                          
                      );
                    };
                    //object_content = object_content.add($('<span />').html('}').add('<br/>'));
                    object_wrapper = object_wrapper.add($('<div class="fom_ui_json_value_dict_content"/>').html(object_content));
                    object_wrapper = object_wrapper.add($('<span />').html('}').add('<br/>'));
                    
                    //object_wrapper = object_wrapper.add(object_content.wrap('<span class="fom_ui_json_value_dict_content"/>').parents());
                    return object_wrapper;
                });
                return resp;

            }
        };
        
    },


    format_mongo_json_data: function (json_data_array, options)
    /*
        Return json represented in html
    */
    {

        if (!options) options = $.extend({}, options );
        var this_obj = this;
        
        var resp = $('<div />').addClass('fom_ui_json_data').html( function () {

            var documents = $(null);
            $.each(json_data_array, function(array_index,document){
                documents = documents.add($('<div />').addClass('fom_ui_json_container').html(function(){
                    var doc = $('<div />').addClass('fom_ui_json_toggle').html('+');
                    //special case for system.indexes
                    if(!('_id' in document))
                       doc = doc.add($('<div />')
                           .addClass('fom_ui_json_value_missing')
                           .html('value missing')
                       );
                    else
                        doc = doc.add($('<div />')
                             .addClass('fom_ui_json_value_oid')
                             .html(this_obj.render_json_value(document['_id']))
                         );
                    
                    doc = doc.add($('<div />').addClass('fom_ui_json_value_document')
                    .dblclick(function(){
                        var this_id = document['_id'];
                        var this_obj = this;
                        //alert($(this_obj).html());
                        //$.ajax();
                    })
                    .html( function(){
                    
                        var doc2 = $(null);
                        for (k in document) {
                            v = document[k];
                            doc2 = doc2.add(
                                $('<div />').addClass('fom_ui_json_key').html(
                                    $('#fom_utils').fom_utils('escape_html', JSON.stringify(k))
                                )
                            );
                            doc2 = doc2.add($('<span />').html(' : '));
                            doc2 = doc2.add(this_obj.render_json_value(v));
                            doc2 = doc2.add($('<br/>'));
                        };
                        return doc2;
                    
                    }));
                    return doc;
                }))
            })
            return documents;
        
        });
        
        return resp;
    },

    /*
        Escape html characters
    */
    escape_html: function(html_text) 
    {
        return html_text.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
    },


    /*
        convert any object to strict json required by mongodb
        Date instances are converted to {$date: 
        for details see http://www.mongodb.org/display/DOCS/Mongo+Extended+JSON
    */
    json_to_strict: function(obj) {
    
        var traverse = function(obj) {
            if (obj == null)
                return null;
            switch(obj.constructor.name) {
                case("Number"):
                case("Boolean"):
                case("String"):
                    return obj;
                case("Array"):
                    var arr = [];
                    $.each(obj, function(item) {
                        arr.push(traverse(item));
                    });
                    return arr;
                case("Object"):
                    newobj = {};
                    $.each(obj, function(k, v) {
                        newobj[traverse(k)] = traverse(v);
                    });
                    return newobj;
                case("Date"):
                    return {'$date' : obj.getTime()}
                    
            }; //end switch
        
        };
        return traverse(obj);    

},


    /*
        Nice open/close button for marking opened/closed items in json view
        params:
            state: 'open' or 'closed'
    */
    fom_expandable: function(options){
        if (options && 'state' in options) {
            var state_char = options['state'] == 'open' ? '-' : '+';
        } else {
            var state_char = '-';
        };
        
        return $('<div class="fom_ui_json_toggle">' + state_char + '</div>');
    },


    /*
        Traverse json structure and return list of keys/
        used to suggest sort canidates
        params:
            data: mongo data (array of documents)
            options:
                not used currently 
    */
    fom_json_list_keys: function(json_data, options) {
        var sort_keys = {};
        for(var i =0; i < json_data.length; i++) {
            $.each(json_data[i], function(k,v) {
                sort_keys[k] = true;
            });
        };
        var ret_sort_keys = [];
        $.each(sort_keys, function(k,v) {
            ret_sort_keys.push(k);
        });
            
        return ret_sort_keys;
    },

    //value: function(a) { return a; },
    //length: function ( ) { return this.listeners.length;  },
    active:  function ( ) { return this.active;  },


    destroy: function() {
        $.widget.prototype.apply(this, arguments); // default destroy
        // now do other stuff particular to this widget
    }
 });



 $.extend($.ui.fom_utils, {
   getters: "value length",
   defaults: {
     active: false,
   }
 });
//end of fom_utils
