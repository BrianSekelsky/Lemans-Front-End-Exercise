import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  dataUrl = 'assets/data/red_helmets.json';

  constructor( private http: HttpClient) { }

  public getItems(): Observable<any>{
    return this.http.get(this.dataUrl);
  }
}
