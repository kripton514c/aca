import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchSitesService {
  mySmartViewerEnabled() {
    return true;
  }
  constructor() { }
}
