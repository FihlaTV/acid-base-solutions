// Copyright 2014-2019, University of Colorado Boulder

/**
 * Background of concentration graph.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const concentrationGraphYAxisString = require( 'string!ACID_BASE_SOLUTIONS/concentrationGraph.yAxis' );

  // constants
  const TICK_FONT = new PhetFont( 11 );

  /**
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  function ConcentrationGraphBackgroundNode( width, height ) {

    Node.call( this );

    // rectangular background
    this.addChild( new Rectangle( 0, 0, width, height, { fill: 'white', stroke: 'black', lineWidth: 0.5 } ) );

    // tick marks and horizontal dashed lines. This reuses one tick and one dashed line.
    const dh = ( height / 10 ) - 1;
    const tickNode = new Line( -2, 0, 2, 0, { stroke: 'black', lineWidth: 0.5 } );
    const dashedLineNode = new Line( 0, 0, width, 0, { stroke: 'gray', lineWidth: 0.5, lineDash: [ 2, 1 ] } );
    for ( var i = 0, y; i < 11; i++ ) {

      y = height - ( dh * i );

      // tick mark and dashed line (no dash on bottom tick)
      this.addChild( new Node( { y: y, children: ( i > 0 ) ? [ tickNode, dashedLineNode ] : [ tickNode ] } ) );

      // add text
      this.addChild( new RichText( '10<sup>' + (i - 8) + '</sup>', { centerY: y, centerX: -16, font: TICK_FONT } ) );
    }

    // y-axis label
    const yLabel = new Text( concentrationGraphYAxisString, { font: new PhetFont( 13 ), maxWidth: height } );
    yLabel.rotate( -Math.PI / 2 );
    yLabel.centerY = height / 2;
    yLabel.centerX = -50;
    this.addChild( yLabel );
  }

  acidBaseSolutions.register( 'ConcentrationGraphBackgroundNode', ConcentrationGraphBackgroundNode );

  return inherit( Node, ConcentrationGraphBackgroundNode );
} );
