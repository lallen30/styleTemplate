import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SendmoneyPage } from "./sendmoney.page";

describe("SendmoneyPage", () => {
  let component: SendmoneyPage;
  let fixture: ComponentFixture<SendmoneyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendmoneyPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SendmoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
