// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for single atom.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' ),
    RadialGradient = require( 'SCENERY/util/RadialGradient' ),
    Circle = require( 'SCENERY/nodes/Circle' );

  var gradients = {};

  function Atom( coords, radius, color ) {
    if ( !(radius in gradients) ) {
      gradients[radius] = {};
    }

    // cache gradients for next executions
    if ( !(color in gradients[radius]) ) {
      gradients[radius][color] = new RadialGradient( -radius * 0.2, -radius * 0.3, 0.25, -radius * 0.2, -radius * 0.3, radius * 2 )
        .addColorStop( 0, 'white' )
        .addColorStop( 0.33, color )
        .addColorStop( 1, 'black' );
    }

    Circle.call( this, radius, {x: coords.x, y: coords.y, fill: gradients[radius][color]} );
  }

  return inherit( Circle, Atom );
} );