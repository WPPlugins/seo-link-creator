com = window.com || {};
com.idilia = window.com.idilia || {};
com.idilia.Word = window.com.Word || {};
com.idilia.Menu = window.com.idilia.Menu || {};
com.idilia.MenuItem = window.com.idilia.MenuItem || {};
com.idilia.Link = window.com.idilia.Link || {};

/*****************************************************************************
 * Utility Functions
 *****************************************************************************/

// Escaping javascript string 
var escapeJSString = function( input ) {
	if ( input !== undefined && input !== null ) {
		return input.replace(/'/g,"\\'");
	}
	return null;
};

/*****************************************************************************
 * Model
 *****************************************************************************/

com.idilia.Word = function( originalText, sense, extRefs, schemaOrgT, link ) {
	this.originalText = originalText;
	this.sense = sense;
	this.extRefs = extRefs;
	this.schemaOrgT = schemaOrgT;
	
	this.link = link;
	
	this.getSchemaOrgT = function() {		
		return schemaOrgT;
	};
	
	this.getExtRefs = function() {
		return extRefs;
	};
};

com.idilia.Link = function() {
	this.href = null;
	this.title = null;
	this.hasSchemaOrgT = false;
	this.target = "_blank";
};

com.idilia.MenuItem = function() {
	this.sense = null;
	this.extRefs = null;
	this.schemaOrgT = null;
};

com.idilia.Menu = function(menu) {
		
	this.menuHTML = menu;		
	
	// given a url, tries to find corresponding sense in the menu
	this.getSenseFromUrl = function ( url ) {
		
		var urlSense = null;
		
		if ( this.menuHTML === undefined || this.menuHTML === null ) {
			return null;
		}
		
		$("[data-extrefs]",this.menuHTML.menu).each(function(i,extrefsNode) {
			var sense = extrefsNode.getAttribute("data-fsk");
			$(JSON.parse(extrefsNode.getAttribute("data-extrefs"))).each(function(j, extref) {
				if ( url.replace(/\/$/, "") === extref.url.replace(/\/$/, "") ) {
					urlSense = sense;
					return false;
				}
			});
			if (urlSense !== null) {
				return false;
			}
		});
				
		return urlSense;
	};
	
	// parses a menu dom item (a meaning item)
	this.parseDomItem = function( item ) {		
		
		var menuItem = new com.idilia.MenuItem();
		
		if ( item !== undefined && item !== null && item.length > 0 ) {		
			menuItem.sense = item.attr("data-fsk");
			menuItem.extRefs = JSON.parse(item.attr("data-extrefs"));
			menuItem.schemaOrgT = item.attr("data-schemaorgt");
		}
		
		return menuItem;
	};
	
	// get first menu item - most frequent sense
	this.getFirstMenuItem = function() {		
		var item = $(this.menuHTML.menu).find(".idl-tile-container").first();		
		return this.parseDomItem( item );
	};
	
	// get menu item given an index
	this.getMenuItemFromIndex = function( idx ) {	
		var item = $( "li[data-fsk-idx='" + idx + "']", this.menuHTML ).first();
		return this.parseDomItem( item );
	};			
	
	// get menu item given a url
	this.getMenuItemFromUrl = function( url ) {
		var sense = this.getSenseFromUrl( url );
		if ( sense !== undefined && sense !== null ) {
			return this.getMenuItemFromSense( sense );
		}
		return new com.idilia.MenuItem();
	};	
	
	// get menu item given a sense
	this.getMenuItemFromSense = function( sense ) {	
		var item = $( "[data-fsk='" + escapeJSString(sense) + "']", this.menuHTML.menu ).first();
		return this.parseDomItem( item );
	};
};