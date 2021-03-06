// Copyright 2014-2019, University of Colorado Boulder

/**
 * The 'Introduction' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ABSColors = require( 'ACID_BASE_SOLUTIONS/common/ABSColors' );
  const acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const IntroductionModel = require( 'ACID_BASE_SOLUTIONS/introduction/model/IntroductionModel' );
  const IntroductionScreenView = require( 'ACID_BASE_SOLUTIONS/introduction/view/IntroductionScreenView' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Screen = require( 'JOIST/Screen' );
  const Shape = require( 'KITE/Shape' );

  // strings
  const screenIntroductionString = require( 'string!ACID_BASE_SOLUTIONS/screen.introduction' );

  /**
   * @constructor
   */
  function IntroductionScreen( tandem ) {

    const options = {
      name: screenIntroductionString,
      backgroundColorProperty: new Property( ABSColors.SCREEN_BACKGROUND ),
      homeScreenIcon: createScreenIcon(),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new IntroductionModel(); },
      function( model ) { return new IntroductionScreenView( model ); },
      options );
  }

  acidBaseSolutions.register( 'IntroductionScreen', IntroductionScreen );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
    const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;

    const background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    const beakerWidth = 0.6 * width;
    const beakerHeight = 0.75 * height;
    const lipOffset = 0.05 * width;

    const beakerNode = new Path( new Shape()
        .moveTo( -lipOffset, -lipOffset )
        .lineTo( 0, 0 )
        .lineTo( 0, beakerHeight )
        .lineTo( beakerWidth, beakerHeight )
        .lineTo( beakerWidth, 0 )
        .lineTo( beakerWidth + lipOffset, -lipOffset ),
      { stroke: 'black', lineWidth: Math.max( 1, beakerHeight / 40 ), center: background.center } );

    const waterNode = new Rectangle( 0, 0, beakerWidth, beakerHeight,
      { fill: 'rgb(213,231,233)', translation: beakerNode.translation } );

    const lensRadius = 0.4 * beakerHeight;
    const lensNode = new Circle( lensRadius,
      { stroke: 'black', lineWidth: lensRadius / 6, center: waterNode.center } );

    const handleNode = new Rectangle( lensRadius + 2, -lensRadius / 7, lensRadius, lensRadius / 3, 8, 8,
      { fill: 'rgb(85,55,33)', stroke: 'black', lineWidth: 1, translation: lensNode.translation } );
    handleNode.rotate( Math.PI / 6 );

    return new Node( { children: [ background, waterNode, beakerNode, handleNode, lensNode ] } );
  };

  return inherit( Screen, IntroductionScreen );
} );
