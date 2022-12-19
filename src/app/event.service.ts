import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Subject, Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class EventService {

    constructor(
        private http: HttpClient
    ) { }

  private eventSubject = new Subject<any>();

  publishEvent(data:any){
    this.eventSubject.next(data);
  }
  
  getEvent(): Subject <any> {
    return this.eventSubject

  }

  public get_states(): Observable<any> {
    return this.http.get("./assets/custom_usa_states.json");
}
}
