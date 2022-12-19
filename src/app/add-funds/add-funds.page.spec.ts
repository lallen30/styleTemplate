import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AddFundsPage } from "./add-funds.page";

describe("AddFundsPage", () => {
  let component: AddFundsPage;
  let fixture: ComponentFixture<AddFundsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFundsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFundsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
