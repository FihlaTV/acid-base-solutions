// Copyright 2014-2019, University of Colorado Boulder

/**
 *  An aqueous solution whose solute is a weak acid.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ABSConstants = require( 'ACID_BASE_SOLUTIONS/common/ABSConstants' );
  const acidBaseSolutions = require( 'ACID_BASE_SOLUTIONS/acidBaseSolutions' );
  const AqueousSolution = require( 'ACID_BASE_SOLUTIONS/common/model/solutions/AqueousSolution' );
  const inherit = require( 'PHET_CORE/inherit' );
  const SolutionType = require( 'ACID_BASE_SOLUTIONS/common/enum/SolutionType' );

  /**
   * @constructor
   */
  function WeakAcidSolution() {
    AqueousSolution.call( this,
      SolutionType.WEAK_ACID, ABSConstants.WEAK_STRENGTH_RANGE.defaultValue, ABSConstants.CONCENTRATION_RANGE.defaultValue,
      [
        // molecules found in this solution
        { key: 'HA', concentrationFunctionName: 'getSoluteConcentration' },
        { key: 'H2O', concentrationFunctionName: 'getH2OConcentration' },
        { key: 'A', concentrationFunctionName: 'getProductConcentration' },
        { key: 'H3O', concentrationFunctionName: 'getH3OConcentration' }
      ] );
  }

  acidBaseSolutions.register( 'WeakAcidSolution', WeakAcidSolution );

  return inherit( AqueousSolution, WeakAcidSolution, {

    // @override @public [HA] = c - [H3O+]
    getSoluteConcentration: function() {
      return ( this.getConcentration() - this.getH3OConcentration() );
    },

    // @override @public [A-] = [H3O+]
    getProductConcentration: function() {
      return this.getH3OConcentration();
    },

    // @override @public [H3O+] = ( -Ka + sqrt( Ka*Ka + 4*Ka*c ) ) / 2
    getH3OConcentration: function() {
      const Ka = this.getStrength();
      const c = this.getConcentration();
      return ( -Ka + Math.sqrt( ( Ka * Ka ) + ( 4 * Ka * c ) ) ) / 2;
    },

    // @override @public [OH-] = Kw / [H3O+]
    getOHConcentration: function() {
      return ABSConstants.WATER_EQUILIBRIUM_CONSTANT / this.getH3OConcentration();
    },

    // @override @public [H2O] = W - [A-]
    getH2OConcentration: function() {
      return ( ABSConstants.WATER_CONCENTRATION - this.getProductConcentration() );
    },

    // @override @protected Is strength in the weak range?
    isValidStrength: function( strength ) {
      return ABSConstants.WEAK_STRENGTH_RANGE.contains( strength );
    }
  } );
} );
