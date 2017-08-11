/**
 * Script to be uploaded into tinyMCE
 */

com = window.com || {};
com.idilia = window.com.idilia || {};
com.idilia.apps = window.com.idilia.apps || {};

var POPUP_WIDTH = 740;
var POPUP_HEIGHT = 420;
var POPUP_HEIGHT_SMALL = 85;
var PLUGIN_TITLE = "SEO Link Creator";
var TAG_SINGLE_WORD = "Manual Link Addition";
var TAG_ALL_WORDS = "Automatic Links Addition";
var SELECT_MEANING = "Select Meaning";

var xhr = null;

/** 
 * @returns 3.x/4.x TinyMCE compatible windowManager params
 */
function slcCompatibleGetParams() {
	var params;
	if (tinymce.majorVersion < 4) {
		params = tinymce.activeEditor.windowManager.params;
	} else {
		params = tinymce.activeEditor.windowManager.getParams();
	}	
	return params;
}

/**
 * 3.x/4.x TinyMCE compatible function to disable an item (button) 
 * @param name Button Name
 * @param state 
 */
function slcCompatibleSetDisabled( name, state ) {
	var cm = tinymce.activeEditor.controlManager;
	if ( tinymce.majorVersion < 4 ) {
		cm.get( name ).setDisabled( state );
	} else {
		cm.setDisabled( name, state );
	}
}

/**
 * 3.x/4.x TinyMCE compatible function to activate an item (button)
 * @param name Button Name
 * @param state 
 */
function slcCompatibleSetActive( name, state) {
	var cm = tinymce.activeEditor.controlManager;
	if ( tinymce.majorVersion < 4 ) {
		cm.get( name ).setActive( state );
	} else {
		cm.setActive( name, state );
	}
}

/**
 * 3.x/4.x TinyMCE compatible function to activate an item (button)
 * Used from iframe opened by windowManager.open
 */
function slcCompatibleCloseAddLinkDialog() {
	if (tinymce.majorVersion < 4) {
		tinymce.activeEditor.windowManager
		        .close( document.getElementById( 
		        		window.slc_dialog_add_link.iframeElement.id ).contentWindow );		
	} else {
		tinymce.activeEditor.windowManager.close();
	}
}

function slcCompatibleCloseTaggingMenuDialog() {	
	if (tinymce.majorVersion < 4) {
		tinymce.activeEditor.windowManager
		        .close( document.getElementById( 
		        		window.slc_dialog_tagging_menu.iframeElement.id ).contentWindow );		
	} else {
		tinymce.activeEditor.windowManager.windows[0].close();
	}
}

function slcCompatibleCloseFirstAddLinkDialog() {	
	if (tinymce.majorVersion < 4) {
		tinymce.activeEditor.windowManager
		        .close( document.getElementById( 
		        		window.slc_dialog_add_link.iframeElement.id ).contentWindow );		
	} else {
		tinymce.activeEditor.windowManager.windows[0].close();
	}
}

/**
 * After insertion/removal command reinitialize SEO Link buttons
 */
function slcInitButtons() {	
	slcCompatibleSetDisabled( 'button_slc_tag_all_words', true );		        
	slcCompatibleSetDisabled( 'button_slc_tag_single_word', true );
	slcCompatibleSetActive( 'button_slc_tag_single_word', false );	
}

/**
 * Sends user single word to server to get tagging info
 * @param ed
 * @param editorCursorPosition
 * @param pluginJsUrl
 * @param text
 */
function ajaxTagSingleWord( ed, editorCursorPosition, pluginJsUrl, text ) {

	var data = { 
		action : 'slc_tag_single_word',
		text : text,
	};

	// ajaxurl is defined in the admin header and points to admin-ajax.php
	jQuery.post( ajaxurl, data, function( response ) {
		slcCompatibleCloseAddLinkDialog();				
		confirmTagSingleWord( ed, editorCursorPosition, pluginJsUrl, response );		
	});
}

/**
 * Sends user text--more than one word--to server to get tagging info
 * @param ed
 * @param editorCursorPosition
 * @param pluginJsUrl
 * @param text
 */
function ajaxTagAllWords( ed, editorCursorPosition, pluginJsUrl, text ) {

	var data = { 
		action : 'slc_tag_all_words',
		text : text
	};
	
	var nbOriginalAnchors = 0;
	var matches = text.match( /<a/ig );
	if ( matches ) {
		nbOriginalAnchors = matches.length;
	}
	
	// ajaxurl is defined in the admin header and points to admin-ajax.php
	xhr = jQuery.post( ajaxurl, data, function( response ) {
		slcCompatibleCloseAddLinkDialog();
		if ( response.success ) {
			var newText = response["new_text"];
			var nbAnchors = 0;
			var matches = newText.match( /<a/ig );
			if ( matches ) {
				nbAnchors = matches.length;
			}
			confirmTagAllWords( ed, editorCursorPosition, pluginJsUrl, newText, nbAnchors - nbOriginalAnchors );
		} else {
			displayError( ed, pluginJsUrl, response.errorMsg );
		}
	});
}

/**
 * On coming back from server, inserts new text with links otherwise alert message
 * @param ed
 * @param editorCursorPosition
 * @param pluginJsUrl
 * @param newText
 * @param nbNewLinks
 */
function confirmTagAllWords( ed, editorCursorPosition, pluginJsUrl, newText, nbNewLinks ) {	
	if ( nbNewLinks == 0 ) {
		ed.windowManager.alert( "No links found. Try manual link addition.");			
	} else {									
	    if ( tinymce.isIE ) {		
	    	tinymce.activeEditor.selection.moveToBookmark( editorCursorPosition );
	    }
		tinymce.activeEditor.selection.setContent( newText );
		ed.windowManager.alert( nbNewLinks + " new link" + ( nbNewLinks > 1 ? "s" : "" )+ " added.");
	} 			
	slcUpdateButtonsState();
}

/**
 * @param ed
 * @param pluginJsUrl
 * @param errorMsg
 */
function displayError( ed, pluginJsUrl, errorMsg ) {
	window.slc_dialog_add_link = ed.windowManager.open({
		file : pluginJsUrl + "/../html/error.html",
		title : PLUGIN_TITLE,
		width : POPUP_WIDTH,
		height : POPUP_HEIGHT_SMALL,
		inline : true,
	}, { 
		message : errorMsg
	});
	slcUpdateButtonsState();
}

/**
 * This is called when coming back from server. It popups 
 * a dialog to edit/insert link with with tagging info
 * @param ed
 * @param editorCursorPosition required for IE
 * @param pluginJsUrl plugin url to enable referencing other urls 
 * @param menu
 */
function confirmTagSingleWord( ed, editorCursorPosition, pluginJsUrl, menu, selectedSense ) {
	var page = "../html/add-link.html";
	var title = PLUGIN_TITLE + " - " + TAG_SINGLE_WORD;
	window.slc_dialog_add_link = ed.windowManager.open({
		file : pluginJsUrl + "/" + page,
		title : title,
		width : POPUP_WIDTH,
		height : POPUP_HEIGHT,
		inline : true,		
	}, { 
		menu : menu,
		selectedSense : selectedSense,
		pluginJsUrl : pluginJsUrl,
		editorCursorPosition : editorCursorPosition,
	});
}

/**
 * This is called when coming back from server. It popups 
 * a dialog to edit/insert link with with tagging info
 * @param ed
 * @param editorCursorPosition required for IE
 * @param pluginJsUrl plugin url to enable referencing other urls 
 * @param menu
 */
function displayTaggingMenu( ed, editorCursorPosition, pluginJsUrl, menu  ) {	
	var page = "../html/tagging-menu.html";
	var title = PLUGIN_TITLE + " - " + SELECT_MEANING;
	window.slc_dialog_tagging_menu = ed.windowManager.open({
		file : pluginJsUrl + "/" + page,
		title : title,
		width : POPUP_WIDTH,
		height : POPUP_HEIGHT,
		inline : true,		
	}, { 
		menu : menu,
		pluginJsUrl: pluginJsUrl,		
		editorCursorPosition: editorCursorPosition,
	});
}

/**
 * TinyMCE node changing handler: 
 * - on click in the editor
 * - on selection in the editor 
 */
function slcUpdateButtonsState() {
	
	var ed = tinymce.activeEditor;
	var selectedText = ed.selection.getContent();
    var isTextSelected = ! ed.selection.isCollapsed();
    var nbWords = selectedText.split(" ").length; 

    if ( nbWords > 1 && isTextSelected ) {
    	
        // we display the "link all" option only  when more than one word is selected
    	slcCompatibleSetDisabled( 'button_slc_tag_all_words', ed.selection.isCollapsed() );
    }
    
    slcCompatibleSetDisabled( 'button_slc_tag_single_word', ed.selection.isCollapsed() );
    slcCompatibleSetActive( 'button_slc_tag_single_word', false );
	
	var SINGLE_WORD_MAX_WORDS = 12;
	if ( nbWords > SINGLE_WORD_MAX_WORDS ) {
		slcCompatibleSetDisabled( 'button_slc_tag_single_word', true );
	}

    if ( !isTextSelected ) {
    	slcCompatibleSetDisabled( 'button_slc_tag_all_words', ed.selection.isCollapsed() );
    }

    if ( ed.dom.getParent( ed.selection.getStart() ).nodeName === "A" ) {                        
    	slcCompatibleSetDisabled( 'button_slc_tag_single_word', false );
    	slcCompatibleSetActive( 'button_slc_tag_single_word', true );
    }
}

/*
 * Appends custom buttons with behavior to tinymce interface
 */ 
( function() {
	
	/* Register the buttons */
	tinymce.create(			
        'tinymce.plugins.SEOLinkCreatorTinymcePlugin',        
        { 
        	init : /**
        	 * @param ed
        	 * @param pluginJsUrl
        	 */
        	function( ed, pluginJsUrl ) {
        	
	            /**
				 * Adds HTML tag to selected content
				 */        		
	            ed.addButton( 'button_slc_tag_single_word', {
	            	title    : PLUGIN_TITLE + ' - ' + TAG_SINGLE_WORD,
	            	image    : pluginJsUrl + '/../images/magiclink-20x20.png',
	            	cmd      : 'button_slc_tag_single_word_cmd',
	            	disabled : true,
	            });
	
	            ed.addCommand( 'button_slc_tag_single_word_cmd', function() {
	
	                var selectedText = ed.selection.getContent();
	                if ( ed.dom.getParent( 
	                		ed.selection.getStart() ).nodeName === "A" ) {	                	
	                    selectedText = ed.selection.getStart().textContent;
	                }
	                
	                // the following is for IE otherwise ed.selection is lost
	                var normalize = true;
	                var editorCursorPosition = ed.selection.getBookmark( normalize );
	
	                ajaxTagSingleWord( ed, editorCursorPosition, pluginJsUrl, selectedText );
	
	                // popups temporary loading dialog
	                window.slc_dialog_add_link = ed.windowManager.open({
		                file   : pluginJsUrl + '/../html/loading-spinner.html',
		                title  : PLUGIN_TITLE + ' - ' + TAG_SINGLE_WORD,
		                width  : POPUP_WIDTH,
		                height : POPUP_HEIGHT,	
		                inline : true,
	                });
	            });
	
	            ed.addButton( 'button_slc_tag_all_words', {
	                title    : PLUGIN_TITLE + ' - ' + TAG_ALL_WORDS,
	                image    : pluginJsUrl + '/../images/magiclinkall-20x20.png',
	                cmd      : 'button_slc_tag_all_words_cmd',
	                disabled : true,
	            });
	            
			    ed.addCommand( 'button_slc_tag_all_words_cmd', function() {
	                var selectedText = ed.selection.getContent();
	                
	                // the following is for IE otherwise ed.selection is lost
	                var normalize = true;
	                var editorCursorPosition = ed.selection.getBookmark( normalize );	                

	                ajaxTagAllWords( ed, editorCursorPosition, pluginJsUrl, selectedText );
	                
	                // This window will be later closed by ajaxTagAllWords success callback
	                window.slc_dialog_add_link = ed.windowManager.open({
	                    file : pluginJsUrl + '/../html/loading.html',
	                    title : PLUGIN_TITLE + ' - ' + TAG_ALL_WORDS,
	                    width : POPUP_WIDTH,
	                    height : POPUP_HEIGHT_SMALL,
	                    inline : true,
	                },
	                { 
	                	nbWords : selectedText.split( /\s+/ ).length
	                });
	
	                ed.windowManager.onClose.add( function() {
	                	
	                    // disables text replacement when canceling loading page
	                    if ( typeof xhr !== undefined ) {
	                        xhr.abort();
	                    }
	                });
	            });
	
			    // Handles editor click/selection events
				if (tinymce.majorVersion < 4) {
	                ed.onNodeChange.add( function() {
	                	slcUpdateButtonsState();	                    
	                });
				} else {
					ed.on( 'NodeChange', function( e ) {
						slcUpdateButtonsState();	     
	                });
				} 
        	}
        });
	
	/* Start the buttons */
	tinymce.PluginManager.add( 'slc_tinymce_plugin',
	        tinymce.plugins.SEOLinkCreatorTinymcePlugin );
})();
