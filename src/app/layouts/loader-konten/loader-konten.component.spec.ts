import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderKontenComponent } from './loader-konten.component';

describe('LoaderKontenComponent', () => {
  let component: LoaderKontenComponent;
  let fixture: ComponentFixture<LoaderKontenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderKontenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderKontenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
