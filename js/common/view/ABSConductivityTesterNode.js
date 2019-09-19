// Copyright 2015-2018, University of Colorado Boulder

/**
 * Conductivity tester, adapts the model to scenery-phet.ConductivityTesterNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  const ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

  /**
   * @param {ConductivityTester} conductivityTester
   * @constructor
   */
  function ABSConductivityTesterNode( conductivityTester ) {
    ConductivityTesterNode.call( this,
      conductivityTester.brightnessProperty,
      new Property( conductivityTester.bulbLocation ),
      conductivityTester.positiveProbeLocationProperty,
      conductivityTester.negativeProbeLocationProperty, {
        probeSize: conductivityTester.probeSize,
        probeDragYRange: new Range(
          conductivityTester.probeDragYRange.min - conductivityTester.bulbLocation.y,
          conductivityTester.probeDragYRange.max - conductivityTester.bulbLocation.y
        )
      }
    );
  }

  acidBaseSolutions.register( 'ABSConductivityTesterNode', ABSConductivityTesterNode );

  return inherit( ConductivityTesterNode, ABSConductivityTesterNode );
} );
