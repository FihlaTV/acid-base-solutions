// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation for lightbulb, battery and wires in the conductivity test in the 'Acid Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),
    Property = require( 'AXON/Property' ),
    Image = require( 'SCENERY/nodes/Image' ),
    Path = require( 'SCENERY/nodes/Path' ),
    Shape = require( 'KITE/Shape' ),
    LinearFunction = require( 'DOT/LinearFunction' ),

    ConductivityTestWire = require( './ConductivityTestWire' ),
    ConductivityTestProbe = require( './ConductivityTestProbe' ),
    ConductivityTestLightRays = require( './ConductivityTestLightRays' ),

    batteryImage = require( 'image!ACID_BASE_SOLUTIONS/battery.png' ),
    lightBulbBaseImage = require( 'image!ACID_BASE_SOLUTIONS/light-bulb-base.png' ),
    lightBulbGlassImage = require( 'image!ACID_BASE_SOLUTIONS/light-bulb-glass.png' ),
    lightBulbGlassMaskImage = require( 'image!ACID_BASE_SOLUTIONS/light-bulb-glass-mask.png' );

  var BULB_TO_BATTERY_WIRE_LENGTH = 40,
    OPACITY_MAX = 0.15,
  // alpha of the bulb when used against a dark background.  This is clamped after evaluation to keep it within the range [0,1]
    BRIGHTNESS_TO_ALPHA_FUNCTION_AGAINST_DARK_BACKGROUND = new LinearFunction( 0, 1, OPACITY_MAX, 0 );

  var initYLevel = 60,
    wireOptions = {
      positive: {
        start: {x: 125, y: 84},
        end: {x: 163, y: initYLevel}
      },
      negative: {
        start: {x: 16, y: 75},
        end: {x: -22, y: initYLevel}
      }
    };

  function ConductivityTest( model, options ) {
    var self = this,
      lightBulbDarkMask = new Node( {opacity: OPACITY_MAX, children: [new Image( lightBulbGlassMaskImage, {scale: 0.33} )]} ),
      positiveProbeY = new Property( wireOptions.positive.end.y ),
      negativeProbeY = new Property( wireOptions.negative.end.y ),
      isClose = new Property( false ),
      bulbEndX = 23,
      bulbEndY = 84,
      waterSurface = 75,
      negativeWire,
      positiveWire;
    Node.call( this, options );

    // add light rays
    this.addChild( new ConductivityTestLightRays( model.property( 'brightness' ), isClose, lightBulbDarkMask.getGlobalBounds().width / 2, {x: lightBulbDarkMask.getGlobalBounds().width / 2, y: lightBulbDarkMask.getGlobalBounds().height / 2.75} ) );

    this.addChild( new Node( {children: [
      // add light bulb image
      new Node( {children: [
        new Image( lightBulbBaseImage, {scale: 0.33, x: 15.5, y: 66} ),
        new Image( lightBulbGlassImage, {scale: 0.33} ),
        lightBulbDarkMask
      ]} ),
      // add wire from battery to light bulb
      new Path( new Shape().moveTo( bulbEndX, bulbEndY ).lineTo( bulbEndX + BULB_TO_BATTERY_WIRE_LENGTH, bulbEndY ), {stroke: 'black', lineWidth: 1.5} ),
      // add battery image
      new Image( batteryImage, {scale: 0.6, x: bulbEndX + BULB_TO_BATTERY_WIRE_LENGTH, y: 67} )
    ]} ) );

    // add wires
    this.addChild( negativeWire = new ConductivityTestWire( 'negative', wireOptions.negative.start.x, wireOptions.negative.start.y, wireOptions.negative.end.x, wireOptions.negative.end.y ) );
    this.addChild( positiveWire = new ConductivityTestWire( 'positive', wireOptions.positive.start.x, wireOptions.positive.start.y, wireOptions.positive.end.x, wireOptions.positive.end.y ) );

    // add probes
    this.addChild( new ConductivityTestProbe( 'red', '+', positiveProbeY, {x: 155, y: initYLevel} ) );
    this.addChild( new ConductivityTestProbe( 'black', '-', negativeProbeY, {x: -30, y: initYLevel} ) );

    // if both probes in water: isContact === true
    var checkContact = function() {
      isClose.value = ( positiveProbeY.value > waterSurface && negativeProbeY.value > waterSurface );
    };
    positiveProbeY.link( checkContact );
    negativeProbeY.link( checkContact );

    // update wires if end point was changed
    positiveProbeY.link( function( y ) {
      positiveWire.setEndPoint( wireOptions.positive.end.x, y );
    } );
    negativeProbeY.link( function( y ) {
      negativeWire.setEndPoint( wireOptions.negative.end.x, y );
    } );

    // set brightness of light bulb
    var setBrightness = function() {
      lightBulbDarkMask.setOpacity( (isClose.value ? BRIGHTNESS_TO_ALPHA_FUNCTION_AGAINST_DARK_BACKGROUND( model.brightness ) : OPACITY_MAX) );
    };
    model.property( 'brightness' ).link( setBrightness );
    isClose.link( setBrightness );

    // visibility observer
    model.property( 'testMode' ).link( function( mode ) {
      self.setVisible( mode === model.TEST_MODES.CONDUCTIVITY );
    } );

    model.property( 'resetTrigger' ).link( function() {
      positiveProbeY.reset();
      negativeProbeY.reset();
    } );
  }

  return inherit( Node, ConductivityTest );
} );
