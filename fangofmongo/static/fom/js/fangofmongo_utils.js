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
        return $.format.date(new Date(), format);
    
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

        if (value == null)
        {
            return '<div class="fom_ui_json_value_null>null</div>';
        }

        switch(value.constructor.name)
        {
            case("Number"):
            case("Boolean"):
                return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">' + $('#fom_utils').fom_utils('escape_html', value+"") + '</div>';
            case("String"):
                return '<div class="fom_ui_json_value_' + value.constructor.name.toLowerCase() + '">"' + $('#fom_utils').fom_utils('escape_html', value) + '"</div>';
            case("Array"):
            {
                resp = '<div class="fom_ui_json_value_array">[';
                for(var i in value)
                {
                    resp += this.render_json_value(value[i]);
                }               
                resp += ']</div>';
                return resp; 
            }
            case("Object"):
            {
                if ('$date' in value) {
                    var date = new Date(value['$date']);
                    return '<div class="fom_ui_json_value_date">' + this.formatDate( date , "yyyy-MM-dd HH:mm:ss.SSS") + '</div>';
                    }
                    
                if ('$oid' in value)
                    return '<div class="fom_ui_json_value_oid">ObjectId("' + value['$oid'] + '")</div>';
                
                resp = '<div class="fom_ui_json_value_dict">{<br/>';
                for(var key in value)
                {
                    resp += '<div class="fom_ui_json_key">' + $('#fom_utils').fom_utils('escape_html', JSON.stringify(key)) + '</div>' + ' : ';
                    resp += this.render_json_value(value[key]) + '<br/>';
                }
                resp += '}</div><br/>';
                return resp;

            }
        };
        
    },


    format_mongo_json_data: function (json_data_array)
    /*
        Return json represented in html
    */
    {
        var resp = '<div class="fom_ui_json_data">';
        
        for(var i in json_data_array)
        {
            resp += '<div class="fom_ui_json_container">';

            resp += '<div class="fom_ui_json_toggle">+</div>';
            if(!('_id' in json_data_array[i]))
                resp += '<div class="fom_ui_json_value_missing">value missing</div>';
            else
                resp += '<div class="fom_ui_json_value_oid">' + (this.render_json_value(json_data_array[i]['_id'])) + '</div>';
            resp += '<div class="fom_ui_json_value_document">';
            
            for(var key in json_data_array[i])
            {
                resp += '<div class="fom_ui_json_key">' + $('#fom_utils').fom_utils('escape_html', JSON.stringify(key)) + '</div>' + ' : ';
                resp += this.render_json_value(json_data_array[i][key]);
                resp += '<br/>';
            }
            resp += '</div>'; //document
            resp += '</div>'; //container
        }
        resp += '</div>'; //fom_ui_json_data
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
            data: mongo data
            options:
                not used currently 
    */
    fom_json_list_keys: function(json_data, options) {
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
