import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AddNamePage } from "./add-name.page";

describe("AddNamePage", () => {
  let component: AddNamePage;
  let fixture: ComponentFixture<AddNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNamePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
