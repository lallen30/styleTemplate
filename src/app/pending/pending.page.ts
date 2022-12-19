import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventService } from "../event.service";

@Component({
  selector: "app-pending",
  templateUrl: "./pending.page.html",
  styleUrls: ["./pending.page.scss"],
})
export class PendingPage implements OnInit {
  message: string;
  constructor(public event: EventService, public route: ActivatedRoute) {
    this.route.queryParams.subscribe((mes) => {
      if (mes) {
        this.message = mes.message;
      }
    });
  }

  ngOnInit() {}
  updateBal() {
    this.event.publishEvent({ event: "update_bal" });
  }
}
