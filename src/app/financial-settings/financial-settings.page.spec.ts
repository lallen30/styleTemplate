import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { FinancialSettingsPage } from "./financial-settings.page";

describe("FinancialSettingsPage", () => {
  let component: FinancialSettingsPage;
  let fixture: ComponentFixture<FinancialSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialSettingsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
