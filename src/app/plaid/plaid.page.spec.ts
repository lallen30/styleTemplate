import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { PlaidPage } from "./plaid.page";

describe("PlaidPage", () => {
  let component: PlaidPage;
  let fixture: ComponentFixture<PlaidPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlaidPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
