import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import * as DataChart from './DataChart.json';
import { ChartControlsService } from '../chart-controls.service';
import { FooterChartComponent } from './footer-chart/footer-chart.component';
import { GraphCharComponent } from './graph-char/graph-char.component';
import * as d3 from 'd3';
export class DeliveryMetric {
  state: string;
  stateDisplayValue: string;
  mean: number;
  stdDev: number;

  constructor(stateIn, stateDisplayValueIn, meanIn, stdDevIn) {
    this.state = stateIn;
    this.stateDisplayValue = stateDisplayValueIn;
    this.mean = meanIn;
    this.stdDev = stdDevIn;
  }
}
export class Device {
  tittle:string;
  currencytotal: string;
  name: string;
  sales: string;
  porcenter: number;
  color: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('DeviceChart', { static: true }) chart: DonutChartComponent;
  @ViewChild('FooterChart', {static: true}) footer: FooterChartComponent;
  @ViewChild('GraphChart', {static: true}) gchart: GraphCharComponent;
  deliveryMetrics: DeliveryMetric[];
  devices: Device[];
  chartData: Device[] = [];
  refreshInterval;
  grData = [];
  dArrayM: any []
  dChart = DataChart.data[1]
  constructor(private router: Router, public chartControlsService: ChartControlsService) { 
    this.chartControlsService.fullScreen = false;
  }

  ngOnInit() {
    this.initialize(this.dChart);
    this.dArrayM =  DataChart.data
  }

  initialize(dChart) {
    console.log(dChart)
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.generateData(dChart);
    this.generateDataGr();
    this.chart.data = [...this.chartData];
    this.footer.footerData = [...this.chartData]
    this.gchart.data = [...this.grData];
    this.refreshInterval = setInterval(() => {
      if (document.hasFocus()) {
        this.chart.data = [...this.chartData];
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  generateDataGr() {
    this.grData = []
    this.deliveryMetrics = [];
    const meanTransitTime = randomInt(9, 10);
    const sigmaTransitTime = randomInt(9, 10);
    let trandomizer = d3.randomNormal(meanTransitTime, sigmaTransitTime);
    const ttimes = [];
    const totaltimes = [];
    for (let i = 0; i < 500; i++) {
      const t = Math.floor(trandomizer());
      const total =  t;
      ttimes.push(t);
      totaltimes.push(total);
    }
    this.grData.push(ttimes);
  }
  generateData(dChart) {
    this.devices = [];
    dChart.devices.forEach((state) => {
      const target = new Device();
      target.name = state.name;
      target.sales = state.sales;
      target.porcenter = state.porcenter;
      target.tittle = dChart.tittle;
      target.currencytotal = dChart.total
      target.color = state.color
      this.devices.push(target);
    });
    this.chartData = this.devices
  }
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
