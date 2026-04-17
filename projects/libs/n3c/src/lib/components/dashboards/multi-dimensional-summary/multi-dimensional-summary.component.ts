import {Component, ElementRef, inject, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {RadarPlotService} from '../../../services/charts/radar-plot/radar-plot-service';
import {HiveApiService} from '../../../services/api/hive-api/hive-api.service';

@Component({
  selector: 'app-multi-dimensional-summary',
  imports: [],
  providers: [RadarPlotService],
  templateUrl: './multi-dimensional-summary.component.html',
  styleUrl: './multi-dimensional-summary.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MultiDimensionalSummaryComponent implements OnInit {
  @ViewChild('radarPlotEl', {static: true}) radarPlotEl!: ElementRef;
  private radarPlot = inject(RadarPlotService);
  private hiveApi = inject(HiveApiService);
  ngOnInit(): void {
    var age_range_all = [
      '#EADEF7',
      '#C9A8EB',
      '#A772DF',
      '#8642CE',
      '#762AC6',
      '#6512BD',
      '#4C1EA5',
      '#33298D',
      '#251a8a',
      '#a6a6a6'
    ];
    var race_range = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#a6a6a6', '#8B8B8B'];
    var ethnicity_range = ['#332380', '#B6AAF3', '#a6a6a6'];
    var severity_range = ['#EBC4E0', '#C24DA1', '#AD1181', '#820D61', '#570941', '#a6a6a6'];
    var sex_range = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6'];

    this.hiveApi.getHiveData().subscribe({
      next: (hiveData) => {
        this.radarPlot.createChart({
          // feedPath: './data/data.json',
          hiveData,
          // domName: 'radar-plot-container',
          scaling: 2,
          color: [age_range_all, severity_range, sex_range, race_range, ethnicity_range],
          domTarget: '',
          el: this.radarPlotEl.nativeElement
        });
      }
    });
  }
}
