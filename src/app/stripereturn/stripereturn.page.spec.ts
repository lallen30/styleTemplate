import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { StripereturnPage } from "./stripereturn.page";

describe("StripereturnPage", () => {
  let component: StripereturnPage;
  let fixture: ComponentFixture<StripereturnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StripereturnPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(StripereturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
