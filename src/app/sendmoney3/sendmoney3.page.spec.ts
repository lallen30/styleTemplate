import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { Sendmoney3Page } from "./sendmoney3.page";

describe("Sendmoney3Page", () => {
  let component: Sendmoney3Page;
  let fixture: ComponentFixture<Sendmoney3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Sendmoney3Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Sendmoney3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
