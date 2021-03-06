// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for the pH paper in 'Acid-Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Beaker} beaker
   * @param {Property.<SolutionType>} solutionTypeProperty
   * @param {Property.<number>} pHProperty
   * @constructor
   */
  function PHPaper( beaker, solutionTypeProperty, pHProperty ) {

    const self = this;

    // @public
    this.beaker = beaker;
    this.pHProperty = pHProperty;
    this.paperSize = new Dimension2( 16, 110 );

    // @public drag bounds
    this.dragBounds = new Bounds2(
      beaker.left + this.paperSize.width / 2, beaker.top - 20,
      beaker.right - this.paperSize.width / 2, beaker.bottom );

    // @public position of the bottom-center of the paper
    this.positionProperty = new Vector2Property( new Vector2( beaker.right - 60, beaker.top - 10 ) );

    // @public
    // NOTE: Ideally, indicatorHeight should be a DerivedProperty, but that gets quite messy.
    // height of indicator, the portion of the paper that changes color when dipped in solution
    this.indicatorHeightProperty = new NumberProperty( 0 );

    // clear the indicator color from the paper and recompute its height
    const resetIndicator = function() {
      self.indicatorHeightProperty.set( 0 );
      self.updateIndicatorHeight();
    };
    solutionTypeProperty.link( resetIndicator );
    pHProperty.link( resetIndicator );

    this.positionProperty.link( function() {
      self.updateIndicatorHeight();
    } );
  }

  acidBaseSolutions.register( 'PHPaper', PHPaper );

  return inherit( Object, PHPaper, {

    // @public
    reset: function() {
      this.indicatorHeightProperty.reset();
      this.positionProperty.reset();
    },

    /**
     * Gets the y coordinate of the top of the pH paper. Origin is at bottom center.
     * @returns {number}
     */
    getTop: function() { return this.positionProperty.value.y - this.paperSize.height; },
    get top() { return this.getTop(); },

    /**
     * Updates the height of the indicator. The indicator height only increases, since we want the
     * indicator color to be shown on the paper when it is dipped into solution and pulled out.
     * @private
     */
    updateIndicatorHeight: function() {
      if ( this.beaker.bounds.containsPoint( this.positionProperty.get() ) ) {
        const height = Utils.clamp( this.positionProperty.get().y - this.beaker.top + 5, this.indicatorHeightProperty.get(), this.paperSize.height );
        this.indicatorHeightProperty.set( height );
      }
    }
  } );
} );