// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for models in the 'Acid-Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var Beaker = require( 'ACID_BASE_SOLUTIONS/common/model/Beaker' );
  var ConductivityTester = require( 'ACID_BASE_SOLUTIONS/common/model/ConductivityTester' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Magnifier = require( 'ACID_BASE_SOLUTIONS/common/model/Magnifier' );
  var PHMeter = require( 'ACID_BASE_SOLUTIONS/common/model/PHMeter' );
  var PHPaper = require( 'ACID_BASE_SOLUTIONS/common/model/PHPaper' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Array<AqueousSolution>} solutions
   * @param {SolutionType} defaultSolutionType
   * @constructor
   */
  function AcidBaseSolutionsModel( solutions, defaultSolutionType ) {

    var self = this;

    // convert to an associative array, so we can look up solutions by solutionType
    this.solutions = {};
    solutions.forEach( function( solution ) {
      self.solutions[solution.type] = solution;
    } );

    PropertySet.call( this, {
      solutionType: defaultSolutionType, // type of solution that is currently selected
      pH: this.solutions[defaultSolutionType].pH // pH level of product
    } );

    // beaker model (all elements in workspace have position relative to beaker)
    this.beaker = new Beaker();

    // magnifier model
    this.magnifier = new Magnifier( this.beaker, this.solutions, this.property( 'solutionType' ) );

    // pH meter model
    this.pHMeter = new PHMeter( this.beaker, this.property( 'pH' ) );

    // pH paper model
    this.pHPaper = new PHPaper( this.beaker, this.property( 'solutionType' ), this.property( 'pH' ) );

    // conductivity tester model
    this.conductivityTester = new ConductivityTester( this.beaker, this.property( 'pH' ) );

    // set appropriate pH
    var setPH = function( value ) { self.pH = value; };
    this.property( 'solutionType' ).link( function( newSolutionType, prevSolutionType ) {
      // unsubscribe from previous solution pH property
      if ( prevSolutionType ) {
        self.solutions[prevSolutionType].property( 'pH' ).unlink( setPH );
      }
      // subscribe to new solution pH property
      self.solutions[newSolutionType].property( 'pH' ).link( setPH );
    } );
  }

  return inherit( PropertySet, AcidBaseSolutionsModel, {
    reset: function() {
      // reset supertype properties
      PropertySet.prototype.reset.call( this );

      // reset solutions
      for ( var solutionType in this.solutions ) {
        this.solutions[solutionType].reset();
      }

      this.pHMeter.reset();
      this.pHPaper.reset();
      this.conductivityTester.reset();
    }
  } );
} );