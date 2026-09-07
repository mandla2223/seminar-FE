import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

import { Lead } from '../../models/lead';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private apiUrl = 'https://localhost:7077/api/Leads';

  // keeps the UI from hanging indefinitely if the API is slow or overloaded
  private requestTimeoutMs = 20000;

  constructor(
    private http: HttpClient
  ) {}

  submitLead(lead: Lead): Observable<Lead> {

    return this.http.post<Lead>(
      this.apiUrl,
      lead
    ).pipe(
      // no retry here: a POST is not idempotent, retrying could create duplicate leads
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