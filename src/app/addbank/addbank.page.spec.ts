import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AddbankPage } from "./addbank.page";

describe("AddbankPage", () => {
  let component: AddbankPage;
  let fixture: ComponentFixture<AddbankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddbankPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddbankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
