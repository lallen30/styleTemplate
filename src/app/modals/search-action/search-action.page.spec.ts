import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { SearchActionPage } from "./search-action.page";

describe("SearchActionPage", () => {
  let component: SearchActionPage;
  let fixture: ComponentFixture<SearchActionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchActionPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchActionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
