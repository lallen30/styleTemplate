import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { UserlistPage } from "./userlist.page";

describe("UserlistPage", () => {
  let component: UserlistPage;
  let fixture: ComponentFixture<UserlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserlistPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
