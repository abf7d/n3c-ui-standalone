import {Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {RouterModule} from '@angular/router';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {forkJoin} from 'rxjs';
import {GridApi} from 'ag-grid-community';
import {CollaboratingSitesService} from '../../../services/charts/geo-map/collaborating-sites/collaborating-sites.service';
import {ContributingSitesService} from '../../../services/charts/geo-map/contributing-sites/contributing-sites.service';
import {BaseGeoMapService} from '../../../services/charts/geo-map/base-geo-map/base-geo-map.service';
import {AlbersUSATerritoriesProjectionService} from '../../../services/charts/geo-map/base-geo-map/albers-usa-territories-projection';
import {CollaboratingSitesApiService} from '../../../services/api/collaborating-sites-api/collaborating-sites-api.service';
import {saveAs} from 'file-saver';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {SimpleGridComponent} from '../../shared/simple-grid/simple-grid.component';

@Component({
  selector: 'app-n3c-composite-map',
  imports: [RouterModule, DashboardFooterComponent, HeaderViewComponent, N3cLoaderComponent, SimpleGridComponent],
  providers: [
    BaseGeoMapService,
    CollaboratingSitesService,
    ContributingSitesService,
    AlbersUSATerritoriesProjectionService
  ],
  templateUrl: './collaboration-profiles.component.html',
  styleUrl: './collaboration-profiles.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CollaborationProfilesComponent implements OnInit {
  @ViewChild('chart', {static: true}) chart!: ElementRef;
  public columnDefs: any;
  public gridData: any[] = [];
  public showImgMenu = false;
  public showError = false;
  public dataLoading = true;

  private collab = inject(CollaboratingSitesService);
  private contrib = inject(ContributingSitesService);
  private geoMap = inject(BaseGeoMapService);
  private collabApi = inject(CollaboratingSitesApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    const regions$ = this.collabApi.getRegions();
    const collaborations$ = this.collabApi.getSiteCollaborations();
    const edges$ = this.collabApi.getEdges();
    const contributing$ = this.collabApi.getContributingSiteLocations();

    forkJoin([regions$, collaborations$, edges$, contributing$]).subscribe(
      ([regions, collaborations, edges, contributing]: [any, any, any, any]) => {
        this.initColDefs();
        const geoMap = this.geoMap.draw(regions, this.chart.nativeElement);
        this.collab.draw(geoMap.svg, geoMap.projection, collaborations, edges);
        this.gridData = collaborations.sites;
        this.dataLoading = false;
      },
      (error) => {
        console.error(error);
        this.showError = true;
        this.dataLoading = false;
      }
    );
  }

  public resetZoom() {
    this.geoMap.resetZoom();
  }

  public initColDefs() {
    this.columnDefs = [
      {
        field: 'site',
        headerName: 'Site',
        width: 205,
        filter: true,
        sortable: true,
        resizable: true,
        cellRenderer: (params: any) => {
          const row = params.data;
          return (
            '<a class="site-link" style="cursor:pointer; color:#007bff; text-decoration:underline;">' +
            row.site +
            '</a>'
          );
        },
        onCellClicked: (params: any) => {
          const idRaw = params?.data?.id ?? '';
          const token = this.collabApi.encodeIdForRouteFromAny(idRaw);
          this.router.navigate(['./', token], {relativeTo: this.route});
        }
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 185,
        filter: true,
        sortable: true,
        resizable: true
      },
      {
        field: 'id',
        headerName: 'PDF',
        width: 220,
        filter: true,
        resizable: true,
        cellRenderer: (params: any) => {
          const siteName = params.data.site;
          const pdfUrl = this.collabApi.getCollaborationProfilePdfUrl(siteName);
          return `<a href="${pdfUrl}" target="_blank">
                    <i class="fas fa-solid fa-file-pdf"></i>
                  </a>`;
        }
      }
    ];
  }

  public saveVisualization(format: string, vizId: string) {
    const element = document.getElementById(vizId);
    if (!element) return;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => {
          saveAs(dataUrl, `${vizId}.jpg`);
        });
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => {
          saveAs(dataUrl, `${vizId}.png`);
        });
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => {
          saveAs(dataUrl, `${vizId}.svg`);
        });
        break;
    }
  }
}
