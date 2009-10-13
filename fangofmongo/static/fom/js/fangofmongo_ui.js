/* Fang of Mongo init function. So the world begins... */
//$('#errors').ajaxError(function(){ $(this).append("<li>Error requesting page.</li>"); }); 

function fom_init_mongo_ui()
/*
    Define and show dialogs
*/
{
    $(function() {
 
        //function updateTips(t) {
        //    tips.text(t).effect("highlight",{},1500);
        //}


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

    });




} //end of fom_init_mongo_ui



function escape_html(html_text)
/*
    Escape html characters
*/
{
    return html_text.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
}


function fom_load_db(search, method)
/*
    Load database list from mongo.
*/
{
var url = '/fangofmongo/rest/mongo/' + connection_params.host + '/' + connection_params.port + '/';
var params = '';
if (search == '') { params += 'search=' + search; };
if (method == '') { params += '&method=' + method; };
if (params != '') { params  = '?' + params; };
try{
$.getJSON('/fangofmongo/rest/mongo/' + connection_params.host + '/' + connection_params.port + '/databases/',
    function(data){
        if ( 'error' in data ) { alert(data['error']); return; }
        $('#fom_dialog_db_list').empty()
        $.each(data['data'], function(){ var dn = document.createElement('div'); dn.fom_db = this; dn.innerHTML = escape_html(this);  $('#fom_dialog_db_list').append( dn ); });
        $('#fom_dialog_db_list').children().click(function(){ connection_params.db = this.innerHTML;  fom_load_colls() });
            
    }
); //end of $.getJSON
    
} catch(e) {alert(e);};
} // end of fom_load_db


function fom_load_colls(search, method)
/*
    Load database list from mongo.
*/
{
var url = '/fangofmongo/rest/mongo/' + connection_params.host + '/' + connection_params.port + '/';
var params = '';
if (search == '') { params += 'search=' + search; };
if (method == '') { params += '&method=' + method; };
if (params != '') { params  = '?' + params; };
try{
$.getJSON('/fangofmongo/rest/mongo/' + connection_params.host + '/' + connection_params.port + '/collections/'+ connection_params.db  +'/',
    function(data){
        if ( 'error' in data ) { alert(data['error']); return; }
        $('#fom_dialog_coll_list').empty()
        //$.each(data['data'], function(){ $('#fom_dialog_coll_list').append('<div>' +  this + '</div>') });
        $.each(data['data'], function(){ var dn = document.createElement('div'); dn.fom_coll = this; dn.innerHTML = escape_html(this);  $('#fom_dialog_coll_list').append( dn ); });
       //$('#fom_dialog_db_list').children().click(function(){ fom_load_coll(this) });
            
    }
); //end of $.getJSON
    
} catch(e) {alert(e);};
} // end of fom_load_db
