import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CashMarkePage } from "./cash-marke.page";

describe("CashMarkePage", () => {
  let component: CashMarkePage;
  let fixture: ComponentFixture<CashMarkePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CashMarkePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CashMarkePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
