/*****************************************************************************
 * Main + Event handlers
 * Called when displaying sense menu
 *****************************************************************************/
$( document ).ready(function() {

    // getting parameters from tinymce editor
    var tinymce = top.tinymce;
    var editor = tinymce.activeEditor;
    var params;
    if (top.tinymce.majorVersion < 4) {
    	params = editor.windowManager.params;   
    } else {
    	params = editor.windowManager.getParams();
    }
    var pluginJsUrl = params.pluginJsUrl;
    var editorCursorPosition = params.editorCursorPosition;
    var menu = params.menu;
    
    $( "#slc-sense-menu" ).html(params.menu.menuHTML.menu);
    
    var senseMenu = $(document).find( ".idl-sensemenu" ).senseMenu({
		  view: "grid",
		  sensesel: function (event) {
		  }
		}).data("senseMenu");
	senseMenu.open();          

    $( "#slc-select-meaning" ).click(function() {
        var selectedSense = $( ".idl-sensemenu .idl-sensesel" );
        if (selectedSense.length > 0) {        	        
        	top.slcCompatibleCloseFirstAddLinkDialog();
        	top.confirmTagSingleWord( editor, editorCursorPosition, pluginJsUrl, menu.menuHTML, selectedSense.attr( "data-fsk" ) );
        	top.slcCompatibleCloseTaggingMenuDialog();        	
        } else {
        	alert( "Please select a meaning by clicking on one of the meaning tile." );
        }
    });
    
    $( "#slc-anchor-cancel" ).click(function() {
        closeDialog();        
    });
    
    var closeDialog = function() {
        top.tinymce.activeEditor.windowManager.close( window );
    };
});
