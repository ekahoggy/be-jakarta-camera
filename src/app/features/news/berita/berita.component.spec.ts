import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeritaComponent } from './berita.component';

describe('BeritaComponent', () => {
  let component: BeritaComponent;
  let fixture: ComponentFixture<BeritaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeritaComponent]
    });
    fixture = TestBed.createComponent(BeritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
