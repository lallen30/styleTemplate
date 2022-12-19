import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SelectedActivityPage } from "./selected-activity.page";

describe("SelectedActivityPage", () => {
  let component: SelectedActivityPage;
  let fixture: ComponentFixture<SelectedActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedActivityPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
