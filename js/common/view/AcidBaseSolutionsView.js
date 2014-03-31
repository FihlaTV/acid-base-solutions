// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for views in 'Acid-Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerNode = require( 'ACID_BASE_SOLUTIONS/common/view/BeakerNode' );
  var ConductivityTesterNode = require( 'ACID_BASE_SOLUTIONS/common/view/conductivity/ConductivityTesterNode' );
  var EquilibriumConcentrationBarChart = require( 'ACID_BASE_SOLUTIONS/view/workspace/equilibrium-concentration-graph/EquilibriumConcentrationBarChart' );
  var Formula = require( 'ACID_BASE_SOLUTIONS/common/view/formulas/Formula' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Magnifier = require( 'ACID_BASE_SOLUTIONS/view/workspace/magnifier/Magnifier' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHColorKeyNode = require( 'ACID_BASE_SOLUTIONS/common/view/PHColorKeyNode' );
  var PHMeterNode = require( 'ACID_BASE_SOLUTIONS/common/view/PHMeterNode' );
  var PHPaperNode = require( 'ACID_BASE_SOLUTIONS/common/view/PHPaperNode' );
  var ScreenView = require( 'JOIST/ScreenView' );

  function AcidBaseSolutionsView( model ) {

    ScreenView.call( this, { renderer: 'svg' } );

    var beakerNode = new BeakerNode( model.beaker );
    var formulaNode = new Formula( model.beaker, model.property( 'solutionType' ) );
    var magnifierNode = new Magnifier( model.magnifier );
    var graphNode = new EquilibriumConcentrationBarChart( model.barChart );
    var pHMeterNode = new PHMeterNode( model.pHMeter );
    var pHPaperNode = new PHPaperNode( model.pHPaper );
    var pHColorKeyNode = new PHColorKeyNode( model.pHPaper.visibleProperty, model.pHPaper.paperSize, { left: beakerNode.left + 30, bottom: beakerNode.top - 50 } );
    var conductivityTesterNode = new ConductivityTesterNode( model.conductivityTester );

    var rootNode = new Node( {
      children: [
        pHMeterNode,
        pHColorKeyNode,
        pHPaperNode,
        conductivityTesterNode,
        beakerNode,
        formulaNode,
        magnifierNode,
        graphNode
      ]
    } );
    this.addChild( rootNode );
  }

  return inherit( ScreenView, AcidBaseSolutionsView );
} );
