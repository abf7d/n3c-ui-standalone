import {Component, ElementRef, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {HeatmapService} from '../../../services/charts/heatmap/heatmap.service';
import {SubstanceUseApiService} from '../../../services/api/substance-use-api/substance-use-api.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-substance-use',
  imports: [],
  providers: [HeatmapService],
  templateUrl: './substance-use.component.html',
  styleUrl: './substance-use.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SubstanceUseComponent implements OnInit {
  @ViewChild('heatmapAllChart', {static: true}) heatmapAllEl!: ElementRef;
  @ViewChild('heatmapAllLegend', {static: true}) heatmapAllLegendEl!: ElementRef;
  @ViewChild('heatmapCovidChart', {static: true}) heatmapCovidEl!: ElementRef;
  @ViewChild('heatmapCovidLegend', {static: true}) heatmapCovidLegendEl!: ElementRef;
  constructor(
    private heatmpService: HeatmapService,
    private substanceApi: SubstanceUseApiService
  ) {}
  ngOnInit(): void {
    const covidData$ = this.substanceApi.getAlcoholOpioidDataClusteredCount();
    const allData$ = this.substanceApi.getAlcoholOpioidDataClustered();
    forkJoin([covidData$, allData$]).subscribe(([covidData, allData]) => {
      this.heatmpService.initChart();
      this.heatmpService.drawChart(
        {
          chartEl: this.heatmapAllEl.nativeElement,
          legendEl: this.heatmapAllLegendEl.nativeElement,
          cell_size: 15,
          margin: {top: 100, right: 0, bottom: 10, left: 200},
          source_label: 'alcohol',
          target_label: 'opioid',
          source_tooltip_label: 'Alcohol Condition',
          target_tooltip_label: 'Opioid',
          sub20hack: 1,
          xaxis_label: 'All Patient'
        },
        allData
      );
      this.heatmpService.drawChart(
        {
          chartEl: this.heatmapCovidEl.nativeElement,
          legendEl: this.heatmapCovidLegendEl.nativeElement,
          cell_size: 15,
          margin: {top: 100, right: 0, bottom: 10, left: 200},
          source_label: 'alcohol',
          target_label: 'opioid',
          source_tooltip_label: 'Alcohol Condition',
          target_tooltip_label: 'Opioid',
          sub20hack: 1,
          xaxis_label: 'COVID+ Patient'
        },
        covidData
      );
    });
  }
}
