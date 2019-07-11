// Copyright 2014-2019, University of Colorado Boulder

/**
 * Visual representation for pH paper in the 'Acid-Base Solutions' sim.
 * Origin is at the bottom-center of the paper.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSColors = require( 'ACID_BASE_SOLUTIONS/common/ABSColors' );
  var acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SHOW_ORIGIN = false; // draws a red circle at the origin, for debugging
  var PAPER_STROKE = 'rgb(100, 100, 100)';

  /**
   * @param {PHPaper} pHPaper
   * @constructor
   */
  function PHPaperNode( pHPaper ) {

    var self = this;
    Node.call( this, { cursor: 'pointer' } );

    // blank paper
    var paperNode = new Rectangle( 0, 0, pHPaper.paperSize.width, pHPaper.paperSize.height,
      { fill: ABSColors.PH_PAPER, stroke: PAPER_STROKE, lineWidth: 0.5 } );

    // portion of the paper that changes color
    var indicatorNode = new Rectangle( 0, 0, pHPaper.paperSize.width, 0, { stroke: PAPER_STROKE, lineWidth: 0.5 } );
    indicatorNode.rotate( Math.PI ); // so that indicator rectangle expands upward

    // rendering order
    this.addChild( paperNode );
    this.addChild( indicatorNode );
    if ( SHOW_ORIGIN ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // origin at bottom-center of paper
    paperNode.centerX = 0;
    paperNode.bottom = 0;
    indicatorNode.centerX = 0;
    indicatorNode.top = 0;

    // expand touch area
    this.touchArea = this.localBounds.dilatedXY( 10, 10 );

    // @private Constrained dragging
    var clickOffset = null;
    this.dragHandler = new SimpleDragHandler( {

      start: function( e ) {
        clickOffset = self.globalToParentPoint( e.pointer.point ).subtract( e.currentTarget.translation );
      },

      drag: function( e ) {
        var v = self.globalToParentPoint( e.pointer.point ).subtract( clickOffset );
        pHPaper.locationProperty.set( new Vector2(
          Util.clamp( v.x, pHPaper.dragBounds.minX, pHPaper.dragBounds.maxX ),
          Util.clamp( v.y, pHPaper.dragBounds.minY, pHPaper.dragBounds.maxY ) ) );
      }
    } );
    this.addInputListener( this.dragHandler );

    // add observers
    pHPaper.locationProperty.link( function( location ) {
      self.translation = location;
    } );

    pHPaper.indicatorHeightProperty.link( function( height ) {
      indicatorNode.setRectHeight( height );
    } );

    // @private
    this.updateColor = function() {
      if ( self.visible ) {
        indicatorNode.fill = pHToColor( pHPaper.pHProperty.get() );
      }
    };
    pHPaper.pHProperty.link( this.updateColor );

    // @private is the paper animating?
    this.animating = false;

    // @private needed by methods
    this.pHPaper = pHPaper;
  }

  acidBaseSolutions.register( 'PHPaperNode', PHPaperNode );

  // Creates a {Color} color for a given {number} pH.
  var pHToColor = function( pH ) {
    assert && assert( pH >= 0 && pH <= ABSColors.PH.length );
    var color;
    if ( Util.isInteger( pH ) ) {
      // pH value is an integer, look up color
      color = ABSColors.PH[ pH ];
    }
    else {
      // pH value is not an integer, interpolate between 2 closest colors
      var lowerPH = Math.floor( pH );
      var upperPH = lowerPH + 1;
      color = Color.interpolateRGBA( ABSColors.PH[ lowerPH ], ABSColors.PH[ upperPH ], ( pH - lowerPH ) );
    }
    return color;
  };

  return inherit( Node, PHPaperNode, {

    // @public
    step: function( dt ) {
      if ( !this.dragHandler.dragging ) {

        var location = this.pHPaper.locationProperty.value;
        var minY = this.pHPaper.beaker.top + ( 0.6 * this.pHPaper.paperSize.height );

        // if the paper is fully submerged in the solution ...
        if ( ( this.animating && location.y > minY ) || ( this.pHPaper.top > this.pHPaper.beaker.top ) ) {

          // float to the top of the beaker, with part of the paper above the surface
          this.animating = true;
          var dy = dt * 250; // move at a constant speed of 250 pixels per second
          var y = Math.max( minY, location.y - dy );
          this.pHPaper.locationProperty.value = new Vector2( location.x, y );
        }
      }
      else {
        this.animating = false;
      }
    },

    /**
     * Update paper color when this node becomes visible.
     * @param visible
     * @public
     * @override
     */
    setVisible: function( visible ) {
      var wasVisible = this.visible;
      Node.prototype.setVisible.call( this, visible );
      if ( !wasVisible && visible ) {
        this.updateColor();
      }
    }
  }, {

    /**
     * Creates an icon that represents the pH paper.
     * @public
     * @static
     * @param width
     * @param height
     * @returns {Node}
     */
    createIcon: function( width, height ) {
      return new Node( {
        children: [
          // full paper
          new Rectangle( 0, 0, width, height, { fill: ABSColors.PH_PAPER, stroke: PAPER_STROKE, lineWidth: 0.5 } ),
          // portion of paper that's colored
          new Rectangle( 0, 0.6 * height, width, 0.4 * height, { fill: ABSColors.PH[ 2 ], stroke: PAPER_STROKE, lineWidth: 0.5 } )
        ]
      } );
    }
  } );
} );
