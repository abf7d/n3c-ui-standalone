import {Injectable} from '@angular/core';
import {BaseManager} from '@odp/n3c/lib/services/base-manager/base.manager';
import {
  ConfigFile,
  FilterDef,
  ISelectedFilters,
  TotalsObject
} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {PositiveCase} from '@odp/n3c/lib/models/covid-cases';

@Injectable({
  providedIn: 'root'
})
export class CovidCasesManager extends BaseManager<PositiveCase> {
  constructor() {
    super({}, []);
  }

  public updateTotalWithRecord(totals: TotalsObject, record: PositiveCase): void {}

  async loadConfigs(topic: string): Promise<{config: ConfigFile; limitations: LimitationsConfig}> {
    const [config, limitations] = await Promise.all([
      import(`./configs/${topic}.json`).then((m) => m.default),
      import('./configs/limitations.json').then((m) => m.default)
    ]);
    return {config, limitations};
  }

  updateFilterMap(filteredData: PositiveCase[], filterMap: FilterDef[][]): FilterDef[][] {
    throw new Error('updateFilterMap method not implemented.');
  }

  public newTotalsObj(): TotalsObject {
    return {};
  }

  public filterDataBasedOnSelectedFilters(data: PositiveCase[], selectedFilters: ISelectedFilters): PositiveCase[] {
    throw new Error('filterDataBasedOnSelectedFilters(dNot implemented.');
  }
}
