import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.page.html",
  styleUrls: ["./welcome.page.scss"],
})
export class WelcomePage implements OnInit {
  slideoptions = {
    effect: "slide",
    freeModeSticky: false,
    slidesPerView: 1,
    spaceBetween: 25,
  };
  constructor() {}

  ngOnInit() {}
}
