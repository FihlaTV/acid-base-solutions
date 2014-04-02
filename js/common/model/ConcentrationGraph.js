// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the concentration graph in 'Acid-Base Solutions' sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function() {
  'use strict';

  /**
   * @param {Beaker} beaker
   * @param {Array<AqueousSolution>} solutions
   * @param {Property<SolutionType>} solutionTypeProperty
   * @param {Property<Number>} concentrationProperty optional, provided for custom solutions
   * @param {Property<Number>} strengthProperty optional, provided for custom solutions
   * @constructor
   */
  function ConcentrationGraph( beaker, solutions, solutionTypeProperty, concentrationProperty, strengthProperty ) {

    this.solutions = solutions;
    this.solutionTypeProperty = solutionTypeProperty;
    this.concentrationProperty = concentrationProperty;
    this.strengthProperty = strengthProperty;

    // dimensions of the graph's background
    this.width = 0.5 * beaker.size.width;
    this.height = 0.9 * beaker.size.height;

    // location, origin at upper-left corner
    this.location = beaker.location.plusXY( (this.width - beaker.size.width) / 2, -(beaker.size.height + this.height) / 2 );
  }

  return ConcentrationGraph;
} );