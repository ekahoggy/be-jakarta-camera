import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokComponent } from './stok.component';

describe('StokComponent', () => {
  let component: StokComponent;
  let fixture: ComponentFixture<StokComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StokComponent]
    });
    fixture = TestBed.createComponent(StokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
