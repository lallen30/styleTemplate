import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AddZipcodePage } from "./add-zipcode.page";

describe("AddZipcodePage", () => {
  let component: AddZipcodePage;
  let fixture: ComponentFixture<AddZipcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddZipcodePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddZipcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
