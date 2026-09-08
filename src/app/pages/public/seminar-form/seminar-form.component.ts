import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

import { LeadService } from '../../../core/services/lead.service';
import { Lead } from '../../../models/lead';

@Component({
  selector: 'app-seminar-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './seminar-form.component.html',
  styleUrl: './seminar-form.component.css'
})
export class SeminarFormComponent {

  @ViewChild('leadForm') leadFormRef?: NgForm;

  isSubmitting = false;

  successMessage = '';

  errorMessage = '';

  lead: Lead = this.getEmptyLead();


  constructor(
    private leadService: LeadService
  ) {}


  submitForm(): void {

    if (this.isSubmitting) {
      return;
    }

    this.successMessage = '';

    this.errorMessage = '';


    if (!this.lead.consentToBeContacted) {

      this.errorMessage =
        'Please provide consent to be contacted before submitting the form.';

      return;

    }


    this.isSubmitting = true;


    this.leadService
      .submitLead(this.lead)
      .subscribe({

        next: () => {

          console.log(
            'Lead successfully submitted'
          );


          this.successMessage =
            'Thank you! Your information has been successfully submitted.';


          this.resetForm();


          this.isSubmitting = false;

        },


        error: (error: unknown) => {

          console.error(
            'Error submitting lead:',
            error
          );


          this.errorMessage = this.getErrorMessage(error);


          this.isSubmitting = false;

        }

      });

  }


  resetForm(): void {

    const emptyLead = this.getEmptyLead();

    // resetForm() clears values and also resets pristine/untouched/submitted state,
    // which is what prevents fields from re-rendering as invalid/red after a successful submit
    if (this.leadFormRef) {
      this.leadFormRef.resetForm(emptyLead);
    }

    this.lead = emptyLead;

  }

  onMobileNumberChange(value: string): void {

    // strip any non-numeric characters and cap the length at 10 digits
    this.lead.mobileNumber = value.replace(/\D/g, '').slice(0, 10);

  }

  private getEmptyLead(): Lead {

    return {

      fullName: '',

      companyOrganisation: '',

      position: '',

      mobileNumber: '',

      emailAddress: '',

      productServiceRequired: '',

      interestedInQuotation: false,

      interestedInPartnership: false,

      interestedInMeeting: false,

      consentToBeContacted: false

    };

  }

  private getErrorMessage(error: unknown): string {

    if (error instanceof TimeoutError) {
      return 'The server is taking longer than usual to respond. Please try again in a moment.';
    }

    if (!(error instanceof HttpErrorResponse)) {
      return 'There was a problem submitting your information. Please try again.';
    }

    if (error.status === 0) {
      return 'Unable to reach the server. Please check your internet connection and try again.';
    }

    if (error.status === 400) {
      return 'Some of the information provided is invalid. Please review the form and try again.';
    }

    if (error.status === 409) {
      return 'It looks like this information has already been submitted.';
    }

    if (error.status >= 500) {
      return 'Our server is currently experiencing high demand. Please try again in a few moments.';
    }

    return 'There was a problem submitting your information. Please try again.';

  }

}