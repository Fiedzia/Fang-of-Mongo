/*
  Mongo convenctional helpers
*/

var ObjectId = function(s) {
    return {$oid: s};
};

var BinData = function(data_type, data) {
    return {$binary: data, $type: dat_type }
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
      this.options['id_generator'] = 0; //used to generate id

    },

    /*
        generate unique ids
            params:
                prefix: optional prefix edded to id
    */
    generate_id: function(prefix) {
        id = this.options['id_generator'];
        this.options['id_generator']++;
        if (prefix)
            return prefix + '_' + id
        else
            return '' + id;
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
        
        /*$(node).children('.fom_ui_json_container').children('.fom_ui_json_toggle').click(function()
            {
                $(this).next().next().toggle();
                $(this).html($(this).next().next().is(':visible')?'-':'+');
            }
        );*/
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
        /*if (value == undefined)
        {
            return $('<div />').addClass('fom_ui_json_value_undefined').html('undefined');
        }*/

        switch(value.constructor.name)
        {
            case("Number"):
            case("Boolean"):
                return $('<div />').addClass('fom_ui_json_value_' + value.constructor.name.toLowerCase())
                                   .html($('#fom_utils').fom_utils('escape_html', value+""));
            case("String"):
                return $('<div />').addClass('fom_ui_json_value_' + value.constructor.name.toLowerCase()).html('"'+ $('#fom_utils').fom_utils('escape_html', value)+'"');
            case("Array"):
            {
                resp = $('<div />').addClass('fom_ui_json_value_array').html(function(){
                    var array_content = $('<span>[</span>');
                    for(var i in value)
                    {
                        array_content = array_content.add(this_obj.render_json_value(value[i]));
                        if (i < value.length-1) array_content = array_content.add($('<span>,</span>'))
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
                    
                if ('$regex' in value) {
                    //var re_options = '';
                    return $('<div />').addClass('fom_ui_json_value_regex').html($('#fom_utils').fom_utils('escape_html','/' + value['$regex'] + '/' + value['$options']));
                }

                if ('$binary' in value) {
                    //return $('<div />').addClass('fom_ui_json_value_binary').html('BinData(' + value['$type'] + ', ' +  JSON.stringify(value['$binary']) + ')');
                    return $('<div />').addClass('fom_ui_json_value_binary').html('BinData(' + value['$type'] + ', "' +  Base64.encode(value['$binary']) + '")');

                }

                    
                resp = $('<div />').addClass('fom_ui_json_value_dict').html(function(){
                    var object_wrapper = $('<span />').html('{').add('<br/>');
                    var object_content = $(null);
                    var value_keys = [];
                    for (k in value)
                        value_keys.push(k);
                    value_keys.sort();
                    for (i in value_keys)
                    {
                        //v = value[k];
                        k = value_keys[i]
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


    /*
        Grab document from mongo by _id and render into given div
    */
    get_end_render_document: function(document_id,element){
        var this_obj = this;
        element.html('<img src="/static/fom/img/ajax-loader.gif" style="border: 0;" />');
        $('#mongo_ajax').fom_object_mongo_ajax('get_data',
            {_id: this_obj.json_to_strict(document_id)},
            {
                callback: function(data){
                    //FIXME: handle errors
                    if ( 'error' in data ) { alert('error: ' + data['error']); return; }
                    if (data['data'].length == 0) { alert('Cannot reload document. Query returned no data for given _id.'); };
                    element.parent().html(this_obj.format_mongo_json_document(data['data'][0]));
                },
                context: element,
        });          
    },


    /*
        Return visual representation of single json document
    */
    format_mongo_json_document: function (document, options)
    {
        if (!options) options = $.extend({}, options );
        var this_obj = this;

        return $('<div />').addClass('fom_ui_json_container').html(function(){
            var doc = $('<div />').addClass('fom_ui_json_toggle').html('+').click(function(){
                $(this).next().next().toggle();
                $(this).html($(this).next().next().is(':visible')?'-':'+');
            });
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
            .one('dblclick', function(){   //edit document
                var document_id = document['_id'];
                var div_obj = this;
                $(this).html('<img src="/static/fom/img/ajax-loader.gif" style="border: 0;" />');
                $('#mongo_ajax').fom_object_mongo_ajax('get_data',
                    {_id: this_obj.json_to_strict(document_id)},
                    {
                        context: this,
                        callback: function(data){
                            var textarea_id = this_obj.generate_id('edit_');
                            $(this).html($('<textarea />')
                                .attr('id', textarea_id)
                                .css('width','98%')
                                .css('height','200px')
                                .html($('#fom_utils').fom_utils('escape_html',JSON.stringify(data["data"][0], null,' ')))
                            )
                            .after($('<div />').html(
                                $('<button>Save</button>').click(function(){
                                    try {
                                    var data = $('#' + textarea_id).val();
                                    var data = eval(' _obj = ' + data);
                                    //var data = JSON.parse(data); 
                                    if (data == null || data.constructor.name != "Object")
                                        throw("JSON parsing: invalid json");
                                    $(this_obj).html('<img src="/static/fom/img/ajax-loader.gif" style="border: 0;" />');
                                    $('#mongo_ajax').fom_object_mongo_ajax('save_document',
                                        {
                                        document: data,
                                        callback: function(data){
                                            /*alert('saved');*/
                                            this_obj.get_end_render_document(data['_id'] ,$(div_obj));
                                        },
                                        context: this
                                        }

                                    )



                                    } catch(e) {
                                        alert('error:' + e); //FIXME:add general function for error handling and displaying
                                        throw(e);
                                    }

                                }).add($('<button>Discard</button>').click(function(){
                                    this_obj.get_end_render_document(document['_id'] ,$(div_obj));
                                }))
                            ))
                        },
                });

            })
            .html( function(){

                var doc2 = $(null);
                document_keys = [];
                for (k in document)
                    document_keys.push(k);
                document_keys.sort();
                for (i in document_keys) {
                    k = document_keys[i];
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
        })

    },


    /*
        Return visual representation of  array of json documents
    */
    format_mongo_json_data: function (json_data_array, options)
    {

        if (!options) options = $.extend({}, options );
        var this_obj = this;

        var resp = $('<div />').addClass('fom_ui_json_data').html( function () {

            var documents = $(null);
            $.each(json_data_array, function(array_index,document){
                documents = documents.add(this_obj.format_mongo_json_document(document, options));



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
        return (''+html_text).replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
    },


    /*
        convert any object to strict json required by mongodb
        for example: Date instances are converted to {$date: 
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
                case("RegExp"): {
                        var re_options = '';
                        if (obj.ignoreCase) re_options += 'i';
                        if (obj.global) re_options += 'g';
                        if (obj.multiline) re_options += 'm';
                        return {'$regex' : obj.source, '$options': re_options}
                    }
                //case("BinData"):
                //    return {'$binary' : obj.data, '$type' : obj.type }
                    
            }; //end switch
        
        };
        return traverse(obj);    

},

    /*
        convert any object from strict required by mongodb to json
        for example: Date instances are converted from {$date: ...} to Date() instances
        for details see http://www.mongodb.org/display/DOCS/Mongo+Extended+JSON
    strict_to_json: function(obj) {
    
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
                    if ('$date' in obj) return new Date(obj['$date']);
                    if ('$oid' in obj) return new ObjectId(obj['$oid']);
                    if ('$regex' in obj) return new ObjectId(obj['$oid']);
                    newobj = {};
                    $.each(obj, function(k, v) {
                        newobj[traverse(k)] = traverse(v);
                    });
                    return newobj;
                case("Date"):
                    return {'$date' : obj.getTime()}
                //case("RegExp"):
                //    return {'$regex' : obj.source, $options:}
                    
            }; //end switch
        
        };
        return traverse(obj);    

},
    */

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
            var doc = json_data[i];
            for(key in doc) {
                sort_keys[key] = true;
            };
        };
        var ret_sort_keys = new Array();
        for(key in sort_keys) {
            ret_sort_keys.push(key);
        }
        ret_sort_keys.sort();
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
