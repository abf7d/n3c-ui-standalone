import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public cache: Map<string, BehaviorSubject<any>> = new Map<string, BehaviorSubject<any>>();
  public get<T>(key: string): BehaviorSubject<T> {
    if (!this.cache.has(key)) {
      const entry = new BehaviorSubject<any>(undefined);
      this.cache.set(key, entry);
      return entry;
    }
    return this.cache.get(key) as BehaviorSubject<T>;
  }

  destroy() {
    this.cache.forEach((value: BehaviorSubject<any>, key: string) => {
      if (this.cache.get(key)) {
        this.cache.delete(key);
      }
    });
  }
}
