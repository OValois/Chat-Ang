import { Component, OnInit, Input } from '@angular/core';

export class Device {
  tittle:string;
  currencytotal: string;
  name: string;
  sales: string;
  porcenter: number;
  color: string;
}

@Component({
  selector: 'app-footer-chart',
  templateUrl: './footer-chart.component.html',
  styleUrls: ['./footer-chart.component.scss']
})
export class FooterChartComponent implements OnInit {
  @Input() footerData: Device[];
  constructor() { }

  ngOnInit() {
  }

}
