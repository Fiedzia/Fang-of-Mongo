/* Fang of Mongo init function. So the world begins... */
function fom_init_login_form()
/*
    Define login form and show it
*/
{
//lets rock...
    $(function() {
        var db_port = $("#db_port"),
            db_host = $("#db_host"),
            db_login = $("#db_login"),
            db_password = $("#db_password"),
            //db_engine = $("#db_engine"),

            allFields = $([]).add(db_host).add(db_port).add(db_login).add(db_password),
            tips = $("#validateTips");
 
        //function updateTips(t) {
        //    tips.text(t).effect("highlight",{},1500);
        //}
         
        $("#start_dialog").dialog({
            bgiframe: true,
            autoOpen: false,
            height: 450,
            width: 400,
            modal: true,
            closeOnEscape: false,
            buttons: {
                'Proceed to Fang of Mongo': function() {
                    var bValid = true;
                    allFields.removeClass('ui-state-error');
 
                    var db_port = $("#db_port"),
                    db_host = $("#db_host");
                  
                    if (bValid) {
                        new_location = '/fangofmongo/ui/mongo/' + db_host.val() + '/' + db_port.val()+ '/';
                        $(this).dialog('close');
                        $(this).dialog('option', 'modal', false );
                        $(this).dialog('option', 'position', ['left','top'] );
                       
                        //redirect to fom user interface
                        window.location = new_location;


                    }
                },
            },
            close: function() {
                allFields.val('').removeClass('ui-state-error');
                $('#errormsg').show();
            }
        });

     $('#errormsg').hide();
     $('#start_dialog').dialog('open');

    });
} //end of init_fom
