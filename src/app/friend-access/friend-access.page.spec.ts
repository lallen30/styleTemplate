import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { FriendAccessPage } from "./friend-access.page";

describe("FriendAccessPage", () => {
  let component: FriendAccessPage;
  let fixture: ComponentFixture<FriendAccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendAccessPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
