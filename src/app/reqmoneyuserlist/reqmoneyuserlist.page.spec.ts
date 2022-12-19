import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ReqmoneyuserlistPage } from "./reqmoneyuserlist.page";

describe("ReqmoneyuserlistPage", () => {
  let component: ReqmoneyuserlistPage;
  let fixture: ComponentFixture<ReqmoneyuserlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReqmoneyuserlistPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReqmoneyuserlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
