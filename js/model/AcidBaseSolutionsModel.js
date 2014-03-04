// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model container for the 'Acid Base Solutions' screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    PropertySet = require( 'AXON/PropertySet' ),
    WaterSolution = require( './WaterSolution' ),
    StrongAcidSolution = require( './StrongAcidSolution' ),
    WeakAcidSolution = require( './WeakAcidSolution' ),
    StrongBaseSolution = require( './StrongBaseSolution' ),
    WeakBaseSolution = require( './WeakBaseSolution' ),

  // strings
    customSolutionTitleString = require( 'string!ACID_BASE_SOLUTIONS/customSolutionTitle' ),

  // constants
    CONSTANTS = require( './Constants/Constants' );

  function AcidBaseSolutionsModel( width, height, mode ) {
    var self = this;

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    this.mode = mode;

    // possible view modes
    this.VIEW_MODES = {
      MOLECULES: 0,
      EQUILIBRIUM: 1,
      LIQUID: 2
    };

    // possible test modes
    this.TEST_MODES = {
      PH_METER: 0,
      PH_PAPER: 1,
      CONDUCTIVITY: 2
    };

    // possible test modes
    this.SOLUTIONS = [
      {type: 'WATER', constructor: WaterSolution, relations: [
        {type: 'H2O', property: 'H2OConcentration'},
        {type: 'H3O', property: 'H3OConcentration'},
        {type: 'OH', property: 'OHConcentration'}
      ]},
      {type: 'STRONG_ACID', constructor: StrongAcidSolution, relations: [
        {type: 'HA', property: 'soluteConcentration'},
        {type: 'H2O', property: 'H2OConcentration'},
        {type: 'A', property: 'productConcentration'},
        {type: 'H3O', property: 'H3OConcentration'}
      ]},
      {type: 'WEAK_ACID', constructor: WeakAcidSolution, relations: [
        {type: 'HA', property: 'soluteConcentration'},
        {type: 'H2O', property: 'H2OConcentration'},
        {type: 'A', property: 'productConcentration'},
        {type: 'H3O', property: 'H3OConcentration'}
      ]},
      {type: 'STRONG_BASE', constructor: StrongBaseSolution, relations: [
        {type: 'MOH', property: 'soluteConcentration'},
        {type: 'M', property: 'productConcentration'},
        {type: 'OH', property: 'OHConcentration'}
      ]},
      {type: 'WEAK_BASE', constructor: WeakBaseSolution, relations: [
        {type: 'B', property: 'soluteConcentration'},
        {type: 'H2O', property: 'H2OConcentration'},
        {type: 'BH', property: 'productConcentration'},
        {type: 'OH', property: 'OHConcentration'}
      ]}
    ];

    PropertySet.call( this, {
      solution: (customSolutionTitleString === mode ? self.SOLUTIONS[2].type : self.SOLUTIONS[0].type), // solution's type
      testMode: self.TEST_MODES.PH_METER, // test mode
      viewMode: self.VIEW_MODES.MOLECULES, // view mode
      solvent: false, // solvent visibility
      pH: 0, // pH level of product
      brightness: 0, // brightness value
      resetTrigger: false // reset trigger
    } );

    // add model for each type of reaction
    this.components = {};
    var setPH = function( value ) { self.pH = value; }; // observer for pH property

    for ( var i = (customSolutionTitleString === mode ? 1 : 0), solution; i < this.SOLUTIONS.length; i++ ) {
      solution = new this.SOLUTIONS[i].constructor();
      this.components[this.SOLUTIONS[i].type] = solution;
      solution.property( 'pH' ).link( setPH );
    }

    // set appropriate pH
    this.property( 'solution' ).link( function( solution ) {
      self.pH = self.components[solution].pH;
    } );

    // set brightness of light rays depend on pH value
    this.property( 'pH' ).link( function( pHValue ) {
      self.brightness = pHToBrightness( pHValue );
    } );

    // add properties for custom tab
    if ( customSolutionTitleString === mode ) {
      this.addProperty( 'isAcid', true ); // type of solution. true - acid, false - base
      this.addProperty( 'isWeak', true ); // type of strength. true - weak, false - strong
      this.addProperty( 'concentration', 0 ); // concentration of solution
      this.addProperty( 'strength', 0 ); // strength of solution

      // update solution type if it was changed by radio buttons
      var setSolution = function() {
        var map = [
          [self.SOLUTIONS[3].type, self.SOLUTIONS[4].type],
          [self.SOLUTIONS[1].type, self.SOLUTIONS[2].type]
        ];

        self.solution = map[+self.isAcid][+self.isWeak];
        self.property( 'concentration' ).notifyObserversUnsafe();
        self.property( 'strength' ).notifyObserversUnsafe();
      };
      this.property( 'isAcid' ).link( setSolution );
      this.property( 'isWeak' ).link( setSolution );

      this.property( 'concentration' ).link( function( concentration ) {
        self.components[self.solution].concentration = concentration;
      } );

      this.property( 'strength' ).link( function( strength ) {
        self.components[self.solution].strength = strength;
      } );
    }
  }

  // private methods
  var pHToBrightness = function( pH ) {
    var NEUTRAL_PH = CONSTANTS.NEUTRAL_PH,
      NEUTRAL_BRIGHTNESS = CONSTANTS.NEUTRAL_BRIGHTNESS;

    return NEUTRAL_BRIGHTNESS + ( 1 - NEUTRAL_BRIGHTNESS ) * (pH < NEUTRAL_PH ? ( NEUTRAL_PH - pH ) / ( NEUTRAL_PH - CONSTANTS.MIN_PH ) : ( pH - NEUTRAL_PH ) / ( CONSTANTS.MAX_PH - NEUTRAL_PH ) );
  };

  inherit( PropertySet, AcidBaseSolutionsModel, {
    reset: function() {
      // reset main properties
      this.property( 'solution' ).reset();
      this.property( 'testMode' ).reset();
      this.property( 'viewMode' ).reset();
      this.property( 'solvent' ).reset();

      // reset properties for custom tab
      if ( this.mode === customSolutionTitleString ) {
        // reset components properties
        for ( var solution in this.components ) {
          if ( this.components.hasOwnProperty( solution ) ) {
            this.components[solution].property( 'strength' ).reset();
            this.components[solution].property( 'concentration' ).reset();
          }
        }

        this.property( 'isAcid' ).reset();
        this.property( 'isWeak' ).reset();
      }

      // send signal to views for resetting
      this.resetTrigger = !this.resetTrigger;
    }
  } );

  return AcidBaseSolutionsModel;
} );