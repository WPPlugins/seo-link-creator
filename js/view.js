/*****************************************************************************
 * View
 * Uses model (word & menu) and fills html with relevant information
 *****************************************************************************/

com.idilia.buildWordView = function( word, menu ) {
	
	// put the html menu
	$( "#slc-selected-sense" ).html(menu.menuHTML.menu);
	
	// hide everything then show only the sense we are interested in
	$( "#slc-selected-sense [data-fsk]" ).hide();
	
	if ( word.sense !== null ) {
		$( "#slc-selected-sense [data-fsk='" + escapeJSString(word.sense) + "']" ).show();
	}
	
	var sm = $(document).find( "#slc-selected-sense .idl-sensemenu" ).senseMenu({
	  view: "grid",
	  sensesel: function (event) {
	    /* Sense tile in event.$selTile was selected */
	    //sm.close();
	  }
	}).data( "senseMenu" );
	sm.open();   
	
	// Word change meaning button
    $( "#slc-sense-menu" ).hide();        
	$( "#slc-edit-sense" ).show();	
};

com.idilia.buildMenuView = function( word, menu ) {	
	if ( menu.menuHTML ) {
		$( "#slc-sense-menu" ).html( menu.menuHTML );    	
	}
	
	// Takes into account other sense in the menu
	var nbMeanings = $("[data-fsk]",menu.menuHTML.menu).length;
	if ( ( ! menu.menuHTML || nbMeanings <=2 )
		&& !( nbMeanings > 0 && word.sense === null ) ) {
		$( "#slc-edit-sense" ).attr( "disabled", true );
		$( "#slc-edit-sense" ).attr( "title", "No other sense available.");
	}	
};

com.idilia.buildSelectView = function( word, menu ) {
	// link
	var url = "";
	if ( word.link && word.link.href ) {
		url = word.link.href;				
	} else if ( extRefs = word.getExtRefs() ) {
		url = extRefs[0].url;	 
	} 
	$( "#slc-mapping-link" ).val( url );		
	
	// link title
	if ( word.link && word.link.title ) {
		$( "#slc-mapping-title" ).val( word.link.title );		
	} else {
		$( "#slc-mapping-title" ).val( word.lemma );
	}
		
	// open in new window
	if ( word.link ) {
		$( "#slc-mapping-new-tab" ).prop( "checked", word.link.target != "" );
	}

	// Submit button (either Add Link or Update)
    if ( word.link ) {
        $( "#slc-add-link" ).val( "Update" );
        $( "#slc-unlink" ).show();
    }

    // Link Select Box    
    $( "#slc-mappings" ).find( "option" ).remove(); // Reset select options    
    var extRefs = word.getExtRefs();
    if ( menu && extRefs ) {
        var max = extRefs.length;
        var selectionDone = false;
        var i = 0;
        for ( ; i < max; i = i + 1 ) {        	
        	
        	selected = url.indexOf( extRefs[i].url ) != -1;
        	if ( selected ) {
        		selectionDone = true;
        	}
        	
            var option = $( "<option></option>" )
            		.attr( "value", extRefs[i].url )
            		.prop( "selected", selected )
                    .text( extRefs[i].dmName );
            
            $( "#slc-mappings" ).append( option );
        }
        
        // the schema only option        
        var option = $( "<option></option>" )
				.attr( "value", "schemaOnly" )	
				.prop( "disabled", word.getSchemaOrgT() == undefined )
				.text( "-- schema only --" );
        $( "#slc-mappings" ).append( option );
		        
        // the other option 
        option = $( "<option></option>" )
        		.attr( "value", "" )
        		.prop( "selected", ! selectionDone )
        		.text( "-- other --" );
        $( "#slc-mappings" ).append( option );
        $( "#slc-mappings" ).show();
        
    } else {
        $( "#slc-mappings" ).hide();
    }
    
    // Schema.org check box
    if ( ! word.getSchemaOrgT() ) {
        $( "#slc-mapping-schema" ).prop( "checked", false );
        $( "#slc-mapping-schema" ).prop( "disabled", true );
        $( "#slc-mapping-schema" ).attr( "title", "No schema.org markup available for this text." );
    } else {
    	$( "#slc-mapping-schema" ).prop( "checked", true );
        $( "#slc-mapping-schema" ).prop( "disabled", false );
        $( "#slc-mapping-schema" ).attr( "title", "Schema.org markup available for this text." );
    }    
};

com.idilia.buildView = function( word, menu ) {
	com.idilia.buildWordView( word, menu );
	com.idilia.buildMenuView( word, menu );
	com.idilia.buildSelectView( word, menu );		
};
