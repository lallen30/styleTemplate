import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ContactConfirmationPopupPage } from "./contact-confirmation-popup.page";

describe("ContactConfirmationPopupPage", () => {
  let component: ContactConfirmationPopupPage;
  let fixture: ComponentFixture<ContactConfirmationPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactConfirmationPopupPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactConfirmationPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
