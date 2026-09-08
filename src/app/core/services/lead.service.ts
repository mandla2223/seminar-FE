import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

import { Lead } from '../../models/lead';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private apiUrl = `${environment.apiUrl}/api/Leads`;

  private requestTimeoutMs = 30000;

  constructor(
    private http: HttpClient
  ) {}

  submitLead(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(
      this.apiUrl,
      lead
    ).pipe(
      timeout(this.requestTimeoutMs),
      // only retry when the request never reached the server (e.g. dropped connection under load);
      // never retry once a response (even an error one) came back, to avoid creating duplicate leads
      retry({
        count: 2,
        delay: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 0) {
            return new Promise(resolve => setTimeout(resolve, 1000));
          }
          throw error;
        }
      }),
      catchError((error) => throwError(() => error))
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