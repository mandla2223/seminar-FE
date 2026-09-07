import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

import { Lead } from '../../models/lead';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private apiUrl = `${environment.apiUrl}/api/Leads`;

  private requestTimeoutMs = 20000;

  constructor(
    private http: HttpClient
  ) {}

  submitLead(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(
      this.apiUrl,
      lead
    ).pipe(
      timeout(this.requestTimeoutMs)
    );
  }

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(
      this.apiUrl
    ).pipe(
      timeout(this.requestTimeoutMs),
      retry(1)
    );
  }

  getLead(id: number): Observable<Lead> {
    return this.http.get<Lead>(
      `${this.apiUrl}/${id}`
    ).pipe(
      timeout(this.requestTimeoutMs),
      retry(1)
    );
  }
}