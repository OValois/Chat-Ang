export class ChartService {
    private url = 'http://localhost:3000';
    returDat: any;

    public getChartData() {
        this.returDat = {
            "tittle": "REVENUD",
            "devices": [
              {
                "name": "Tablet",
                "sales": "120,000",
                "porcenter": 60,
                "count": 10,
                "color": ""
              },
              {
                "name": "SnartPhone",
                "sales": "80,000",
                "porcenter": 40,
                "count": 10,
                "color": ""
              }
            ]
          }         
       console.log('Connect')
    }
}