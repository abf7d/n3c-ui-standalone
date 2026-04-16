import {Observable} from 'rxjs';

export interface NetworkTab {
  value: string;
  viewValue: string;
  api: Observable<any>;
}
