import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  isSubmitting = false;

  successMessage = '';

  errorMessage = '';

  lead: Lead = {

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


  constructor(
    private leadService: LeadService
  ) {}


  submitForm(): void {

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


        error: (error) => {

          console.error(
            'Error submitting lead:',
            error
          );


          this.errorMessage =
            'There was a problem submitting your information. Please try again.';


          this.isSubmitting = false;

        }

      });

  }


  resetForm(): void {

    this.lead = {

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

  onMobileNumberChange(value: string): void {

    // strip any non-numeric characters and cap the length at 10 digits
    this.lead.mobileNumber = value.replace(/\D/g, '').slice(0, 10);

  }

}