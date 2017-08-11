<?php
// A Generic REST helper
function make_rest_call( $url, $params = null, $verb = 'GET', $format= 'json', 
    $content_type = 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' ) {

  $curl = curl_init( $url );

  switch( $verb ) {
    case 'GET':
      break;
    case 'POST':
      curl_setopt( $curl, CURLOPT_POST, true );
      curl_setopt( $curl, CURLOPT_POSTFIELDS, $params );
      break;
    case 'PUT':
      curl_setopt( $curl, CURLOPT_CUSTOMREQUEST, 'PUT' );
      curl_setopt( $curl, CURLOPT_POSTFIELDS, $params );
      break;
    case 'DELETE':
      curl_setopt( $curl, CURLOPT_CUSTOMREQUEST, 'DELETE' );
      break;
  }
  curl_setopt( $curl, CURLOPT_HTTPHEADER, array( $content_type ) );  
  curl_setopt( $curl, CURLOPT_VERBOSE, false );
  curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
  $curl_response = curl_exec( $curl );

  if ( false === $curl_response ) {
    throw new Exception( "$verb $url failed: $php_errormsg" );
  }

  switch ( $format ) {
    case 'json':
      $r = json_decode( $curl_response, true );
      if ( null === $r ) {
        throw new Exception( "failed to decode $curl_response as json" );
      }
      return $r;

    case 'xml':
      $r = simplexml_load_string( $curl_response );
      if ( null === $r ) {
        throw new Exception( "failed to decode $curl_response as xml" );
      }
      return $r;
      
    default:
    	return $r;
  }
  curl_close( $curl );
  return $curl_response;
}

?>
