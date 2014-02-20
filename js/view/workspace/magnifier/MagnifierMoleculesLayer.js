// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation for single molecule type
 * within magnifier in the 'Acid Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  "use strict";

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    Node = require( 'SCENERY/nodes/Node' ),

  // molecules
    MoleculesConstructors = {
      A: require( 'ACID_BASE_SOLUTIONS/view/molecules/AMolecule' ),
      B: require( 'ACID_BASE_SOLUTIONS/view/molecules/BMolecule' ),
      BH: require( 'ACID_BASE_SOLUTIONS/view/molecules/BHMolecule' ),
      H2O: require( 'ACID_BASE_SOLUTIONS/view/molecules/H2OMolecule' ),
      H3O: require( 'ACID_BASE_SOLUTIONS/view/molecules/H3OMolecule' ),
      HA: require( 'ACID_BASE_SOLUTIONS/view/molecules/HAMolecule' ),
      M: require( 'ACID_BASE_SOLUTIONS/view/molecules/MMolecule' ),
      MOH: require( 'ACID_BASE_SOLUTIONS/view/molecules/MOHMolecule' ),
      OH: require( 'ACID_BASE_SOLUTIONS/view/molecules/OHMolecule' )
    };

  var MAX_MOLECULES = 50, // TODO: should be 200, but sim will load approximately 30 second
    BASE_DOTS = 2,
    BASE_CONCENTRATION = 1E-7; // [H3O+] and [OH-] in pure water, value chosen so that pure water shows some molecules;

  var getNumberOfMolecules = function( concentration ) {
    var raiseFactor = Math.log( concentration / BASE_CONCENTRATION ) / Math.LN10,
      baseFactor = Math.pow( ( MAX_MOLECULES / BASE_DOTS ), ( Math.LN10 / Math.log( 1 / BASE_CONCENTRATION ) ) );
    return Math.round( BASE_DOTS * Math.pow( baseFactor, raiseFactor ) );
  };

  function MagnifierMoleculesLayer( model, property, type, radius ) {
    Node.call( this );
    this.model = model;
    this.property = property;
    this.radius = radius;
    this.molecules = [];
    this.pointer = 0; // last shown molecule's index

    // add molecules
    for ( var i = 0; i < MAX_MOLECULES; i++ ) {
      this.addChild( this.molecules[i] = new MoleculesConstructors[type]( model, {visible: false}, true ) );
    }

    // update layer only when it visible
    property.link( this.setMolecules.bind( this ) );
    model.property( 'viewMode' ).link( this.setMolecules.bind( this ) );
  }

  return inherit( Node, MagnifierMoleculesLayer, {
    // update position of molecules
    update: function() {
      var r, fi, radius = this.radius;
      this.molecules.forEach( function( molecule ) {
        r = radius * Math.random();
        fi = 2 * Math.PI * Math.random();
        molecule.setTranslation( r * Math.sin( fi ), r * Math.cos( fi ) );
      } );
    },
    setMolecules: function() {
      var numberOfMolecules = getNumberOfMolecules( this.property.get() ),
        pointer = this.pointer,
        visibility,
        i;

      // show appropriate number of molecules
      if ( numberOfMolecules !== pointer && this.model.viewMode === this.model.VIEW_MODES[0] ) {
        for ( i = Math.min( pointer, numberOfMolecules ), visibility = (numberOfMolecules > pointer); i < Math.max( pointer, numberOfMolecules ); i++ ) {
          this.molecules[i].setVisible( visibility );
        }
        this.pointer = numberOfMolecules;
      }
    }
  } );
} );
