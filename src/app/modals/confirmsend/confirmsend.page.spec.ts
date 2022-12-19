import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ConfirmsendPage } from "./confirmsend.page";

describe("ConfirmsendPage", () => {
  let component: ConfirmsendPage;
  let fixture: ComponentFixture<ConfirmsendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmsendPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmsendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
