import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { FriendAccessModalPage } from "./friend-access-modal.page";

describe("FriendAccessModalPage", () => {
  let component: FriendAccessModalPage;
  let fixture: ComponentFixture<FriendAccessModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendAccessModalPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendAccessModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
