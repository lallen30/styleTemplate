import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { CardkycPage } from "./cardkyc.page";

describe("CardkycPage", () => {
  let component: CardkycPage;
  let fixture: ComponentFixture<CardkycPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardkycPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardkycPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
