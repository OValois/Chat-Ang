import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCharComponent } from './graph-char.component';

describe('GraphCharComponent', () => {
  let component: GraphCharComponent;
  let fixture: ComponentFixture<GraphCharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphCharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphCharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
