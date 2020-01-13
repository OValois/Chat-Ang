import { Component, OnInit, Input, ElementRef, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-graph-char',
  templateUrl: './graph-char.component.html',
  styleUrls: ['./graph-char.component.scss']
})
export class GraphCharComponent implements OnInit {

  @Input() transitionTime = 1000;
  @Input() xmax = 35;
  @Input() ymax = 70;
  @Input() hticks = 30;
  @Input() data: number[];
  @Input() showLabel = 1;
  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  g; // SVG Group element
  colorScale; // D3 color provider
  x; // X-axis graphical coordinates
  y; // Y-axis graphical coordinates
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  bins; // Array of frequency distributions - one for each area chaer
  paths; // Path elements for each area chart
  area; // For D3 area function
  histogram; // For D3 histogram function

  constructor(private elRef: ElementRef) {
      this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.data) {
          this.updateChart(changes.data.currentValue);
      }
  }

  private createChart(data: number[]) {

      this.removeExistingChartFromParent();

      this.setChartDimensions();

      this.setColorScale();

      this.addGraphicsElement();

      this.createXAxis();

      this.createYAxis();

      // d3 area and histogram functions  has to be declared after x and y functions are defined
      this.area = d3.area()
          .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
          .y0(this.y(0))
          .y1((datum: any) => this.y(datum.length));


      this.histogram = d3.histogram()
          .value((datum) => datum)
          .domain([0, this.xmax])
          .thresholds(this.x.ticks(this.hticks));

      // data has to be processed after area and histogram functions are defined
      this.processData(data);

      this.createAreaCharts();

  }

  private processData(data) {
      this.bins = [];
      console.log(this.data)
      data.forEach((row) => {
          this.bins.push(this.histogram(row))
      });
  }

  private setChartDimensions() {
      let viewBoxHeight = 100;
      let viewBoxWidth = 200;
      this.svg = d3.select(this.hostElement).append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
  }

  private addGraphicsElement() {
      this.g = this.svg.append("g")
          .attr("transform", "translate(0,0)");
  }

  private setColorScale() {
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10).range(['#B1DC83']);
  }

  private createXAxis() {
      this.x = d3.scaleLinear()
          .domain([0, this.xmax])
          .range([30, 170]);
  }

  private createYAxis() {
      this.y = d3.scaleLinear()
          .domain([0, this.ymax])
          .range([90, 10]);
  }
  private createAreaCharts() {
      this.paths = [];
      this.bins.forEach((row, index) => {
          this.paths.push(this.g.append('path')
              .datum(row)
              .attr('fill', this.colorScale('' + index))
              .attr("stroke", "#36660E")
              .attr("stroke-width", 1.5)
              .attr('opacity', 0.7)
              .attr('d', (datum: any) => this.area(datum))
          );
      });
  }

  public updateChart(data: number[]) {
      if (!this.svg) {
          this.createChart(data);
          return;
      }

      this.processData(data);

      this.updateAreaCharts();

  }

  private updateAreaCharts() {
      this.paths.forEach((path, index) => {
          path.datum(this.bins[index])
              .transition().duration(this.transitionTime)
              .attr('d', d3.area()
                  .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
                  .y0(this.y(0))
                  .y1((datum: any) => this.y(datum.length)));

      });
  }

  private removeExistingChartFromParent() {
      // !!!!Caution!!!
      // Make sure not to do;
      //     d3.select('svg').remove();
      // That will clear all other SVG elements in the DOM
      d3.select(this.hostElement).select('svg').remove();
  }
}