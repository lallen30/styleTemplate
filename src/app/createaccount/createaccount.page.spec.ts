import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CreateaccountPage } from "./createaccount.page";

describe("CreateaccountPage", () => {
  let component: CreateaccountPage;
  let fixture: ComponentFixture<CreateaccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateaccountPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateaccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
