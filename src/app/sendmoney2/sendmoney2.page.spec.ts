import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { Sendmoney2Page } from "./sendmoney2.page";

describe("Sendmoney2Page", () => {
  let component: Sendmoney2Page;
  let fixture: ComponentFixture<Sendmoney2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Sendmoney2Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Sendmoney2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
