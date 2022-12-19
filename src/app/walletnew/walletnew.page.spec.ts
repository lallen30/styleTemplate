import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { WalletnewPage } from "./walletnew.page";

describe("WalletnewPage", () => {
  let component: WalletnewPage;
  let fixture: ComponentFixture<WalletnewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletnewPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletnewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
