/*****************************************************************************
 * Main + Event handlers
 * Called when displaying tinymce manual link dialog
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
    
    if ( tinymce.isIE ) {	
    	editor.selection.moveToBookmark( params.editorCursorPosition );
    }
    
    var anchor = editor.selection.getStart();    
    var text = editor.selection.getContent();  
    var pluginJsUrl = params.pluginJsUrl;
    var editorCursorPosition = params.editorCursorPosition;
    var selectedSense = params.selectedSense;
    
    // Uses menu set from tinymce
    var menu = new com.idilia.Menu( params.menu );          
    
    // some view stuff
    $( "#slc-edit-sense" ).attr( "src", params.pluginJsUrl + "/../images/edit-20x20.png" );
    $( "#slc-mapping-link-view" ).attr( "src", params.pluginJsUrl + "/../images/link-16x16.png" );    
    
    // constructing the model (a word)        
    var menuItem = null;
    var link = null;
    if ( anchor && anchor.nodeName == "A" ) {  
    	
    	// Existing link => update dialog using existing link info
    	link = new com.idilia.Link();
        link.title = anchor.title;
        link.href = anchor.href;
        link.target = anchor.target;
        text = anchor.textContent;
    }
    
    if ( selectedSense !== undefined && selectedSense !== null ) {    	
    	menuItem = menu.getMenuItemFromSense( selectedSense );
    	if ( link !== undefined && link !== null ) {
    		link.href = "";
    	}
    	
    } else if ( anchor && anchor.nodeName == "A" ) {  
    	
    	// Existing link => update dialog using existing link info
        menuItem = menu.getMenuItemFromUrl( anchor.href );
            	
    } else {
    	// No predefined link take first item in menu - it's the
    	// most frequent sense    	
    	menuItem = menu.getFirstMenuItem();
    }       
      
    var word = new com.idilia.Word( 
    		text, 
    		menuItem.sense,
    		menuItem.extRefs,
    		menuItem.schemaOrgT,
    		link );
    
    com.idilia.buildView( word, menu );    
    
    var closeDialog = function() {
        top.tinymce.activeEditor.windowManager.close( window );
    };

    // function to build link given word informations and user
    // requirements
    var buildLink = function( text, schema, wikiUrl, url,
            title, openInNewTab ) {

        var link = "<";

        // decide tag: a|span
        // a span would do for those who want no link but
        // schema.org markup
        var isValidUrl = url != undefined && url.length > 0 && url != "schemaOnly";
        var tag = "a";
        if ( isValidUrl ) {
        	link += "a href=\"" + encodeURI( url ) + "\"";
        } else {
        	tag = "span";
        	link += tag;
        }

        // add up schema markup
        var isValidSchema = schema != undefined && schema.length > 0;
        if ( isValidSchema ) {
        	link += " itemscope itemtype=\"http://schema.org/" + schema + "\"";
        }
        if ( !isValidUrl || url != wikiUrl ) {
        	
            // if url is not wikiUrl => add it
        	link += " sameAs=\"" + encodeURI( wikiUrl ) + "\"";
        }

        if ( tag == "a" && title !== undefined && title !== null ) {
        	link += " title=\"" + title.replace( /"/g, "&#34" ) + "\"";
        }

        // same window or new one (only for anchor not span)
        if ( openInNewTab && isValidUrl ) {
            link += " target=\"_blank\"";
        }

        // add text and closing tag
        link += ">" + text + "</" + tag + ">";

        return link;
    };             
    
    var viewLinkOptions = function(view) {
    	$( "#slc-url-div" ).toggle(view);
    	$( "#slc-title-div" ).toggle(view);
    	$( "#slc-schema-div" ).toggle(view);
    	$( "#slc-new-tab-div" ).toggle(view);
    };
    
    var addLink = function( forceSchema ) {
    	
	    // get reference url
	    var refUrl = "wikipedia";
	    var wikipediaUrl = "";
	
	    $( "#slc-mappings option" ).each(function() {
	        // add $(this).val()
	        // to your list
	        if ( $( this ).val().indexOf( refUrl ) != -1 )
	            wikipediaUrl = $( this ).val();
	    });
	
	    var schemaOrgT  = word.getSchemaOrgT();
	    if ( ! forceSchema ) {
	    	schemaOrgT = ( document.getElementById( "slc-mapping-schema" ).checked ? 
	    		word.getSchemaOrgT() : null );
	    }
	    
	    if ( schemaOrgT || $( "#slc-mapping-link" ).val().length > 0 ) {
	        var htmlLink = buildLink(
	        		text,
	        		schemaOrgT,
	        		wikipediaUrl,
	        		$( "#slc-mapping-link" ).val(),
	        		$( "#slc-mapping-title" ).val(),
	        		document.getElementById( "slc-mapping-new-tab" ).checked );
	
	        if ( tinymce.isIE ) {
	        	editor.selection.moveToBookmark( params.editorCursorPosition );
	        }
	        
	        if ( anchor && anchor.nodeName == "A" ) {	        		  
	        	editor.dom.setOuterHTML( anchor, htmlLink );	        	
	        } else {	        		        	
	        	editor.selection.setContent( htmlLink );
	        }
	    }
	    top.slcUpdateButtonsState();
	    closeDialog();
	};
       
    // ***************
    // Event handlers
    // ***************
	
	// Opens a window containing the url corresponding to the sense
    $( "#slc-mapping-link-view" ).click(function() {
    	if ( $( "#slc-mapping-link" ).val() != "" ) {
    		window.open( $( "#slc-mapping-link" ).val(), "", "width=800,height=600,scrollbars=auto,menubar=no,status=no,titlebar=no,toolbar=no,location=no" );
    	}
    });
    
    // Opens a window to select another sense
    $( "#slc-edit-sense" ).click(function( event ) {        
                
        top.displayTaggingMenu(editor, editorCursorPosition, pluginJsUrl, menu);      
                
        // otherwise sense-menu we just opened is closed
        event.stopPropagation(); 
    });

    $( "#slc-anchor-cancel" ).click(function() {
        closeDialog();
    });

    $( "#slc-unlink" ).click(function() {
        if ( anchor && anchor.nodeName == "A" ) {
            editor.dom.setOuterHTML( anchor, anchor.innerHTML );
        }
        top.slcUpdateButtonsState();
        closeDialog();
    });
    
    $( "#slc-add-schema" ).click(function() {    	
    	var forceSchema = true;
    	addLink( forceSchema );
    });

    $( "#slc-add-link" ).click(function() {
    	var forceSchema = false;
    	addLink( forceSchema );    	
    });    

    $( "#slc-mappings" ).change(function() {
        $( "#slc-mapping-link" ).val( $( "#slc-mappings" ).val() );  
        if ( $( "#slc-mappings" ).val() == "schemaOnly" ) {
        	viewLinkOptions(false);    
        	$( "#slc-add-link" ).hide();
        	$( "#slc-add-schema" ).show();        	
        } else {
        	viewLinkOptions(true);
        	$( "#slc-add-schema" ).hide();
        	$( "#slc-add-link" ).show();        	            
        }
    });  
});
