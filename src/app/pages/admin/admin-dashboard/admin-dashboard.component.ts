import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { LeadService } from '../../../core/services/lead.service';
import { AuthService } from '../../../core/services/auth.service';
import { Lead } from '../../../models/lead';

@Component({
  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-dashboard.component.html',

  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent
  implements OnInit {


  leads: Lead[] = [];

  isLoading = false;

  errorMessage = '';

  // client-side pagination keeps large result sets from freezing the table on low-powered devices
  pageSize = 10;

  currentPage = 1;


  constructor(
    private leadService: LeadService,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadLeads();

  }


  // leaving the dashboard via the browser back button must end the session, otherwise
  // pressing forward would land back on the dashboard without logging in again
  @HostListener('window:popstate')
  onBrowserBack(): void {

    this.authService.logout();

    this.router.navigate([
      '/admin/login'
    ]);

  }


  loadLeads(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.leadService
      .getLeads()
      .subscribe({

        next: (data) => {

          console.log(
            'Leads received:',
            data
          );

          this.leads = data;

          this.currentPage = 1;

          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'Error loading leads:',
            error
          );

          this.errorMessage =
            'Unable to load the seminar submissions. Please try again shortly.';

          this.isLoading = false;

        }

      });

  }


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/admin/login'
    ]);

  }


  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(this.leads.length / this.pageSize)
    );

  }


  get pagedLeads(): Lead[] {

    const start = (this.currentPage - 1) * this.pageSize;

    return this.leads.slice(start, start + this.pageSize);

  }


  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) {

      return;

    }

    this.currentPage = page;

  }


  trackByLeadId(index: number, lead: Lead): number | string {

    return lead.id ?? index;

  }


  private formatRow(lead: Lead): string[] {

    return [
      lead.fullName,
      lead.companyOrganisation,
      lead.position,
      lead.mobileNumber,
      lead.emailAddress,
      lead.productServiceRequired,
      lead.interestedInQuotation ? 'Yes' : 'No',
      lead.interestedInPartnership ? 'Yes' : 'No',
      lead.interestedInMeeting ? 'Yes' : 'No',
      lead.consentToBeContacted ? 'Yes' : 'No',
      lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : ''
    ];

  }


  private get reportHeaders(): string[] {

    return [
      'Full Name',
      'Company / Organisation',
      'Position',
      'Mobile',
      'Email',
      'Product / Service',
      'Quotation',
      'Partnership',
      'Meeting',
      'Consent',
      'Submitted'
    ];

  }


  private getReportFilename(extension: string): string {

    const timestamp = new Date().toISOString().slice(0, 10);

    return `infini-innovation-seminar-leads-${timestamp}.${extension}`;

  }


  exportToCsv(): void {

    if (!this.leads.length) {

      return;

    }

    const escapeCsvValue = (value: string): string => {

      const stringValue = value ?? '';

      if (/[",\n]/.test(stringValue)) {

        return `"${stringValue.replace(/"/g, '""')}"`;

      }

      return stringValue;

    };

    const rows = [
      this.reportHeaders,
      ...this.leads.map(lead => this.formatRow(lead))
    ];

    const csvContent = rows
      .map(row => row.map(value => escapeCsvValue(String(value))).join(','))
      .join('\r\n');

    // BOM ensures Excel opens the file with correct UTF-8 characters
    const blob = new Blob(
      ['\ufeff' + csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    this.downloadBlob(blob, this.getReportFilename('csv'));

  }


  exportToPdf(): void {

    if (!this.leads.length) {

      return;

    }

    const doc = new jsPDF({ orientation: 'landscape' });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(123, 45, 142);
    doc.rect(0, 0, pageWidth, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Infini Innovation (PTY) LTD', 14, 14);

    doc.setFontSize(10);
    doc.text(
      `Seminar Leads Report - Generated ${new Date().toLocaleString()}`,
      14,
      21
    );

    autoTable(doc, {
      startY: 30,
      head: [this.reportHeaders],
      body: this.leads.map(lead => this.formatRow(lead)),
      headStyles: {
        fillColor: [123, 45, 142],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 243, 251]
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(this.getReportFilename('pdf'));

  }


  private downloadBlob(blob: Blob, filename: string): void {

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);

  }

}