import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TermconditionPage } from "./termcondition.page";

describe("TermconditionPage", () => {
  let component: TermconditionPage;
  let fixture: ComponentFixture<TermconditionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TermconditionPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TermconditionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
