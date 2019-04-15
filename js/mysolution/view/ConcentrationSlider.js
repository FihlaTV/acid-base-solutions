// Copyright 2014-2018, University of Colorado Boulder

/**
 * Concentration slider.
 * Adapts a linear slider to a logarithmic concentration range.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} concentrationProperty
   * @param {Range} concentrationRange
   * @constructor
   */
  function ConcentrationSlider( concentrationProperty, concentrationRange ) {

    var model = new SliderModel( concentrationProperty, concentrationRange );

    HSlider.call( this, model.sliderValueProperty, model.sliderValueRange, {
      trackSize: new Dimension2( 125, 4 ),
      thumbSize: new Dimension2( 12, 24 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 6,
      majorTickLength: 12,
      tickLabelSpacing: 2
    } );

    // add labels tick marks
    var numberOfTicks = 4;
    for ( var i = 0, step = model.sliderValueRange.getLength() / ( numberOfTicks - 1 ); i < numberOfTicks; i++ ) {
      this.addMajorTick( model.sliderValueRange.min + step * i, new Text( concentrationRange.min * Math.pow( 10, i ), { font: new PhetFont( 10 ) } ) );
    }
  }

  acidBaseSolutions.register( 'ConcentrationSlider', ConcentrationSlider );

  /**
   * Model for the concentration slider.
   * Maps between the linear slider and the logarithmic range of concentration.
   * Implemented as an inner type because this is internal to the slider.
   *
   * @param {Property.<number>} concentrationProperty
   * @param {RangeWithValue} concentrationRange
   * @constructor
   */
  function SliderModel( concentrationProperty, concentrationRange ) {
    var self = this;

    this.concentrationProperty = concentrationProperty; // @private

    // @public range of slider
    this.sliderValueRange = new RangeWithValue(
      Util.log10( concentrationRange.min ),
      Util.log10( concentrationRange.max ),
      Util.log10( concentrationRange.defaultValue ) );

    // @public property for slider value
    this.sliderValueProperty = new NumberProperty( Util.log10( concentrationProperty.get() ), {
      reentrant: true
    } );

    this.sliderValueProperty.link( function( sliderValue ) {
      self.concentrationProperty.set( Util.toFixedNumber( Math.pow( 10, sliderValue ), 10 ) ); // see issue#73
    } );
    concentrationProperty.link( function( concentration ) {
      self.sliderValueProperty.set( Util.log10( concentration ) );
    } );
  }

  return inherit( HSlider, ConcentrationSlider );
} );