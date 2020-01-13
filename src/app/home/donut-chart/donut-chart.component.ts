import { Component, OnInit, ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';

export class Device {
    tittle:string;
    currencytotal: string;
    name: string;
    sales: string;
    porcenter: number;
  }


@Component({
    selector: 'app-donut-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, OnChanges {

    @Input() data: Device[];
             porcenData: number[];
             chartColor: string[];
    hostElement; // Native element hosting the SVG container
    svg; // Top level SVG element
    g; // SVG Group element
    arc; // D3 Arc generator
    innerRadius; // Inner radius of donut chart
    slices; // Donut chart slice elements
    labels; // SVG data label elements
    totalLabel; // SVG label for total
    rawData; // Raw chart values array
    total: number; // Total of chart values
    colorScale; // D3 color provider
    pieData: any; // Arc segment parameters for current data set
    pieDataPrevious: any; // Arc segment parameters for previous data set - used for transitions
    colors = d3.scaleOrdinal(d3.schemeCategory10);
    width = 200
    height = 190
    thickness = 10
    duration = 750
    radius = Math.min(this.width, this.height) / 2

    pie = d3.pie()
    .value(function(d:number) { return d; })
    .sort(null);

    constructor(private elRef: ElementRef) {
        this.hostElement = this.elRef.nativeElement;
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            this.updateChart(changes.data.currentValue);
        }
    }

    private createChart(data: number[]) {
        this.processPieData(data);
        this.removeExistingChartFromParent();
        this.setChartDimensions();
        this.setColorScale();
        this.addGraphicsElement();
        this.setupArcGenerator();
        this.addSlicesToTheDonut();
        this.addLabelsToTheDonut();
        this.addDonutTotalLabel();
    }

    private setChartDimensions() {
        this.svg =
            d3.select(this.hostElement)
                .append('svg')
                .attr('class', 'pie')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class','donutchart');
    }

    private addGraphicsElement() {
        this.g = this.svg.append("g")
            .attr("transform", "translate(100,105)");
    }

    private setColorScale() {
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10).range(this.chartColor);
    }

    private processPieData(data, initial = true) {
        this.rawData = data;
        this.porcenData = []
        this.chartColor = []
        data.forEach((cdata) => {
            this.porcenData.push(cdata.porcenter)
            this.chartColor.push(cdata.color)
        });
        this.pieData = this.pie(this.porcenData);
        if (initial) {
            this.pieDataPrevious = this.pieData;
        }
    }

    private setupArcGenerator() {
        this.innerRadius = 100;
        this.radius = 80;
        this.arc = d3.arc()
        .innerRadius(this.radius - this.thickness)
        .outerRadius(this.radius);
    }

    private addSlicesToTheDonut() {
        this.slices = this.g.selectAll('path')
            .data(this.pieData)
            .enter()
            .append('g')
            .append('path')
            .attr('d', this.arc)
            .attr('fill', (d, index) => {
                return this.colorScale(`${index}`);
            })
            .style('opacity', 1);
    }

    private addDonutTotalLabel() {
        this.totalLabel = this.svg
            .append('text')
            .text(this.rawData[0].tittle)
            .attr('id', 'total')
            .attr('x', 100)
            .attr('y', 90)
            .attr('class','chart-tittle')
            .style('text-anchor', 'middle');
    }

    arcTween = (datum, index) => {
        const interpolation = d3.interpolate(this.pieDataPrevious[index], datum);
        this.pieDataPrevious[index] = interpolation(0);
        return (t) => {
            return this.arc(interpolation(t));
        }
    }

    labelTween = (datum, index) => {
        const interpolation = d3.interpolate(this.pieDataPrevious[index], datum);
        this.pieDataPrevious[index] = interpolation(0);
        return (t) => {
            return 'translate(' + this.arc.centroid(interpolation(t)) + ')';
        }
    }

    public updateChart(data: number[]) {
        if (!this.svg) {
            this.createChart(data);
            return;
        }
        this.processPieData(data, false);
        this.updateSlices();
        this.updateLabels();
    }

    private updateSlices() {
        this.slices = this.slices.data(this.pieData);
        this.slices.transition().duration(750).attrTween("d", this.arcTween);
    }

    private updateLabels() {
        this.totalLabel.text(this.total);
        this.labels.data(this.pieData);
        this.labels.each((datum, index, n) => {
            d3.select(n[index]).text(this.labelValueFn(this.rawData[index]));
        });
        this.labels.transition().duration(750).attrTween("transform", this.labelTween);
    }

    private removeExistingChartFromParent() {
        d3.select(this.hostElement).select('svg').remove();
    }

    //TEXT CHART
    private addLabelsToTheDonut() {
        this.labels = this.g
            .selectAll('allLabels')
            .data(this.pieData)
            .enter()
            .append('text')
            .text(this.labelValueGetter)
            .attr('x', 0)
            .attr('y', 5)
            .attr('class','chart-total')
            .style('text-anchor', 'middle');
    }

    private labelValueGetter = () => {
        return this.labelValueFn(this.rawData[0].currencytotal);
    }

    private labelValueFn(val) {
        const pct = Math.floor(val * 100 / this.total);
        return (pct < 4) ? '' : '' + val;
    }
}
