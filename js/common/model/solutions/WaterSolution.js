// Copyright 2014-2019, University of Colorado Boulder

/**
 *  A solution of pure water, contains no solute.
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
  function WaterSolution() {
    AqueousSolution.call( this,
      SolutionType.WATER, 0, 0,
      [
        // molecules found in this solution
        { key: 'H2O', concentrationFunctionName: 'getH2OConcentration' },
        { key: 'H3O', concentrationFunctionName: 'getH3OConcentration' },
        { key: 'OH', concentrationFunctionName: 'getOHConcentration' }
      ] );
  }

  acidBaseSolutions.register( 'WaterSolution', WaterSolution );

  return inherit( AqueousSolution, WaterSolution, {

    // @override @public
    getSoluteConcentration: function() {
      return 0;
    },

    // @override @public
    getProductConcentration: function() {
      return 0;
    },

    // @override @public [H3O] = sqrt(Kw)
    getH3OConcentration: function() {
      return Math.sqrt( ABSConstants.WATER_EQUILIBRIUM_CONSTANT ); // Kw = [H30] * [OH-]
    },

    // @override @public [OH] = [H3O]
    getOHConcentration: function() {
      return this.getH3OConcentration();
    },

    // @override @public [H2O] = W
    getH2OConcentration: function() {
      return ABSConstants.WATER_CONCENTRATION;
    },

    // @override @protected Should never be setting the strength of water.
    isValidStrength: function() { return false; }
  } );
} );
