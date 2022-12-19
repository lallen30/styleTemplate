import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { NumberpadPage } from "./numberpad.page";

describe("NumberpadPage", () => {
  let component: NumberpadPage;
  let fixture: ComponentFixture<NumberpadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumberpadPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberpadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
