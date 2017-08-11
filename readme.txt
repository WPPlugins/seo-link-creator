=== Plugin Name ===
Contributors: idilia@wordpress.com
Donate link: http://www.idilia.com/
Tags: links,seo,schema.org,schema,microdata,html5,markup,wikipedia,google,semantic,sense,meaning
maps,facebook,twitter,map
Requires at least: 3.0
Tested up to: 4.2.4
Stable tag: 1.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

SEO Link Creator inserts external links in posts.
Optionally adds schema.org markup on created links.

== Description ==

**Overview**

* Suggests links to insert for one expression or for a block of text using new icons in visual editor
* Improves reader experience and SEO score by adding external links in posts
* Adds [schema.org](http://www.schema.org/) markup to reduce page bounce on ambiguous entities

**Two Modes of Operation:**

* Manual Link Addition
 * Applies to selected expression (e.g. "Lady Gaga")
 * Activated using new editor icon (see screenshots)
 * Change the meaning if necessary for ambiguous expressions (e.g., "Washington")
 * Select one of the proposed link (e.g., Wikipedia, Twitter, maps, home page, etc.)

* Automatic Links Addition 
 * Applies to selected text block (e.g. one or more paragraphs)
 * Activated using new editor icon (see screenshots)
 * Semantic analysis identifies and resolves ambiguous entities in the text selected
 * Plugin automatically inserts a link for recognized entities to home page, Wikipedia, or others (in that order)
 * Author may edit link target when default is not appropriate

**Available Link Destinations**

Link destinations are retrieved from a database containing millions of entities. New destinations
are regularly added. The current list includes:

* Official web sites
* Wikipedia
* Google Maps
* Freebase
* Social: Twitter, Facebook, MySpace
* Stock exchanges: NYSE, NASDAQ, TSX
* Media: New York Times 
* IMDB, MusicBrainz, RottenTomatoes

Brought to the community by [idilia.com](http://www.idilia.com/).


== Installation ==

1. Install SEO Link Creator either via the WordPress.org plugin directory, or by
uploading the files to your server
1. Activate the plugin

Completing these two steps enables selecting an expression, viewing its possible links
and inserting one.

To add the capability to add multiple links inside a block of text:

1. Go to <https://www.idilia.com/login/> and create an account or link with your Facebook/Google account
1. Continue to <https://www.idilia.com/developer/my-projects/> and create project credentials
1. Enter the project credentials in the plugin configuration panel

== Screenshots ==

1. New icons in visual editor
2. Manually adding link
3. Selecting a paragraph for automatic link addition 
4. Automatically adding links
5. Selecting another meaning
6. Plugin settings

== Frequently Asked Questions ==

= Is this free? =

Yes.

Adding links to the current text selection has unlimited usage; adding multiple entities in a text block is limited to 100,000 words per month. 

= What links can be created? =

We map entities to their Wikipedia, Twitter, official web site, Google Maps,
stock exchanges, etc. More destinations are added all the time.

= What if the link I want is not shown? =

Just enter the link manually.

= What if the wrong entity (i.e., not the right meaning)? =

You can edit to select another meaning. If we don't have
the correct one, fallback to enter the link manually.

= How does it work? =

Adding a link with a selected expression performs a lookup in our database to
retrieve the link candidates for this entity. You select one. We insert the markup in the
document.

Adding links with a selected block of text first analyzes the text to pick-up 
its entities. Then it adds links where possible.
Selecting an added link shows the entity found, the link added, and the link alternatives.
Keep the created link, delete it, or replace it with another.

= What is schema.org markup? =

[schema.org](http://www.schema.org/) is HTML markup supported by the major search engines to
better interpret the content of the HTML page. The SEO Link
Creator plugin add this markup to remove any ambiguity (E.g., "Washington" can refer to
many different cities, persons, etc.). Using this markup reduces the chance
that someone will bounce off your page because off topic.


== Changelog ==

= 1.2 =
* Same as 1.1.1, better to increase second number in version number
= 1.1.1 =
* Bug Fix: Mangles the text to be analyzed in "Automatic Links Addition"
* New Feature: Displays the number of links added in auto mode
= 1.1 =
* New Feature: Easier meaning selection through a more visual menu with "meaning tiles"
* Bug Fix: fixed Wikipedia link not being offered when lemma unknown in Idilia Language Graph
= 1.0.1 =
* Bug Fix: fixed WordPress 3.9 compatibility issues
* Bug Fix: fixed IE 9 compatibility issues

= 1.0 =
* Initial release

== Upgrade Notice == 

`<?php code(); // goes in backticks ?>`
