import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSitesComponent } from './search-sites.component';

describe('SearchSitesComponent', () => {
  let component: SearchSitesComponent;
  let fixture: ComponentFixture<SearchSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
