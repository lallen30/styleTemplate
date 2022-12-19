import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { RequestpayPage } from "./requestpay.page";

describe("RequestpayPage", () => {
  let component: RequestpayPage;
  let fixture: ComponentFixture<RequestpayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestpayPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestpayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
