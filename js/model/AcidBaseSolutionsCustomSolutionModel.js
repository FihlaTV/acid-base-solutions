// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Custom solution' screen in 'Acid Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    AcidBaseSolutionsAbstractModel = require( 'ACID_BASE_SOLUTIONS/model/AcidBaseSolutionsAbstractModel' ),
    Solutions = require( 'model/Constants/Solutions' ),
    GameModes = require( 'model/Constants/GameModes' ),
    StrongAcidSolution = require( 'model/AqueousSolutions/StrongAcidSolution' ),
    WeakAcidSolution = require( 'model/AqueousSolutions/WeakAcidSolution' ),
    StrongBaseSolution = require( 'model/AqueousSolutions/StrongBaseSolution' ),
    WeakBaseSolution = require( 'model/AqueousSolutions/WeakBaseSolution' ),

    SolutionMenuModel = require( './SolutionMenuModel' ),
    ViewModesMenuModel = require( './ViewModesMenuModel' ),
    TestModesMenuModel = require( './TestModesMenuModel' ),

  // constants
    DEFAULT_SOLUTION = Solutions.WEAK_ACID;

  function AcidBaseSolutionsCustomSolutionModel() {
    var self = this,
      setStrength = function( value ) { self.strength = value; }, // observer for strength property
      setConcentration = function( value ) { self.concentration = value; }; // observer for strength property

    AcidBaseSolutionsAbstractModel.call( this,
      GameModes.CUSTOM_SOLUTION,
      [
        new StrongAcidSolution(),
        new WeakAcidSolution(),
        new StrongBaseSolution(),
        new WeakBaseSolution()
      ],
      DEFAULT_SOLUTION );

    this.addProperty( 'isAcid', true ); // type of solution. true - acid, false - base
    this.addProperty( 'isWeak', true ); // type of strength. true - weak, false - strong
    this.addProperty( 'concentration', this.components[DEFAULT_SOLUTION].concentration ); // concentration of solution
    this.addProperty( 'strength', this.components[DEFAULT_SOLUTION].strength ); // strength of solution

    // models for control panel
    this.controlPanel = [
      new SolutionMenuModel( this.property( 'solution' ), this.property( 'concentration' ), this.property( 'strength' ), this.property( 'isAcid' ), this.property( 'isWeak' ) ),
      new ViewModesMenuModel( this.property( 'viewMode' ), this.property( 'testMode' ), this.property( 'solvent' ) ),
      new TestModesMenuModel( this.property( 'testMode' ) )
    ];

    this.property( 'solution' ).link( function( newSolution, prevSolution ) {
      // unsubscribe from previous solution strength and concentration property
      if ( prevSolution ) {
        self.components[prevSolution].property( 'strength' ).unlink( setStrength );
        self.components[prevSolution].property( 'concentration' ).unlink( setConcentration );

        // we need set concentration and strength values of new solution
        // equal to values from previous solution
        self.components[newSolution].strength = self.components[prevSolution].strength;
        self.components[newSolution].concentration = self.components[prevSolution].concentration;
      }

      // subscribe to new solution strength and concentration property
      self.components[newSolution].property( 'strength' ).link( setStrength );
      self.components[newSolution].property( 'concentration' ).link( setConcentration );
    } );

    this.property( 'concentration' ).link( function( concentration ) {
      self.components[self.solution].concentration = concentration;
    } );

    this.property( 'strength' ).link( function( strength ) {
      self.components[self.solution].strength = strength;
    } );
  }

  return inherit( AcidBaseSolutionsAbstractModel, AcidBaseSolutionsCustomSolutionModel, {
    reset: function() {
      // reset main properties
      AcidBaseSolutionsAbstractModel.prototype.reset.call( this );

      // reset control panels
      this.controlPanel.forEach( function( panel ) {
        panel.reset();
      } );
    }
  } );

} );