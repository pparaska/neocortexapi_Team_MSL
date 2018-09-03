import { Component, OnInit, AfterViewInit } from '@angular/core';
//import * as Plotly from 'plotly.js';
import * as Plotlyjs from 'plotly.js/dist/plotly';
import { neoCortexUtils } from '../neocortexutils';

@Component({
  selector: 'app-ainet',
  templateUrl: './ainet.component.html',
  styleUrls: ['./ainet.component.css']
})
export class AinetComponent implements OnInit, AfterViewInit {

  layout: any;
  xCoordinate = [];
  yCoordinate = [];
  zCoordinate = [];
 

  constructor() {

  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.fillChart();
    this.createChart();
  }
  createChart() {
    //let graph = document.getElementById('graph');
    // to make the chart responsive 
    let d3 = Plotlyjs.d3;
    let WIDTH_IN_PERCENT_OF_PARENT = 90;
    let HEIGHT_IN_PERCENT_OF_PARENT = 90;
    let gd3 = d3.select('body').append('div').style({
      width: WIDTH_IN_PERCENT_OF_PARENT + '%',
      'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

      height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
      'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
    });
    let gd = gd3.node();

    const trace1 = {
      x: this.xCoordinate,
      y: this.yCoordinate,
      z: this.zCoordinate,
      name: 'Artificial neural network',
      mode: 'markers',
      //connectgaps: true,
     /*  visible: true,
      legendgroup: true, */
      line: {
        width: 4,
        colorscale: 'Viridis',
        color: '#7CFC00'
      },
      marker: {
        size: 18,
        color: '#00BFFF',
        symbol: 'circle',
        line: {
          color: '#7B68EE',
          width: 2
        },
        opacity: 10
      },
      type: 'scatter3d',
      //scene: "scene1",

    };
    const synapses = {
      type: 'scatter3d',
      mode: 'lines',
      name: 'Synapses',
      x: this.xCoordinate,
      y:this.yCoordinate,
      z: this.zCoordinate,
      opacity: 1.0,
      line: {
        width: 4,
        color: '#7CFC00',
        colorscale: 'Viridis'
      }
    };
    const trace2 = {

      /* x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      y: [0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2],
      z: [0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2], */
      x: this.xCoordinate,
      y: this.yCoordinate,
      z: this.zCoordinate,

      name: 'Data 2',
      mode: 'lines+markers',
      symbol: 'circle',
      line: {
        width: 4,
        color: '#7CFC00'
      },
      marker: {
        size: 18,
        color: '#00BFFF',
        symbol: 'circle',
        line: {
          color: '#7B68EE',
          width: 2
        },
        opacity: 10
      },
      type: 'scatter3d',
      scene: "scene2",

    };
    const trace3 = {
      /*       x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            y: [0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 1, 2, 1, 2, 1, 2],
            z: [0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 2, 2], */
      x: this.xCoordinate,
      y: this.yCoordinate,
      z: this.zCoordinate,

      name: 'Data 3',
      mode: 'lines+markers',
      symbol: 'circle',
      line: {
        width: 4,
        color: '#7CFC00'
      },
      marker: {
        size: 18,
        color: '#00BFFF',
        symbol: 'circle',
        line: {
          color: '#7B68EE',
          width: 2
        },
        opacity: 10
      },
      type: 'scatter3d',
      scene: "scene3",

    };
    this.layout = {
      displayModeBar: false,
      //showlegend: false, Thgis option is to show the name of legend/DataSeries 
      scene: {
        aspectmode: "manual",
        aspectratio: {
          x: 7, y: 1, z: 0.5,
        }
      },
      title: '3D Chart',
      legend: {
        x: 0.5,
        y: 1
      },
      //width: 1800,
      // height: 800,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 4

      }
    };

    const config = {
      displaylogo: false,
      showLink: false,
      showlegend: false

    };

    Plotlyjs.newPlot(gd, [trace1, synapses ], this.layout, config);
 
    window.onresize = function () {
      Plotlyjs.Plots.resize(gd);
    };
  }
  fillChart() {
    let model = neoCortexUtils.createModel(2, [100, 4], 6); // createModel (numberOfAreas, [xAxis, zAxis], yAxis)
    let x; let y; let z;
    for (x = 0; x < model.settings.minicolumnDims[0]; x++) {
      for (y = 0; y < model.settings.numLayers; y++) {
        for (z = 0; z < model.settings.minicolumnDims[1]; z++) {
          this.xCoordinate.push(x);
          this.yCoordinate.push(y);
          this.zCoordinate.push(z);

        }

      }

    }
  }

}