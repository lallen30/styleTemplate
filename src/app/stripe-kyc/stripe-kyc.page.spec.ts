import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { StripeKycPage } from "./stripe-kyc.page";

describe("StripeKycPage", () => {
  let component: StripeKycPage;
  let fixture: ComponentFixture<StripeKycPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StripeKycPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(StripeKycPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
