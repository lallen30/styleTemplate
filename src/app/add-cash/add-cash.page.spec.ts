import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AddCashPage } from "./add-cash.page";

describe("AddCashPage", () => {
  let component: AddCashPage;
  let fixture: ComponentFixture<AddCashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCashPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
