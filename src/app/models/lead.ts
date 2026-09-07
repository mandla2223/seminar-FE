export interface Lead {
  id?: number;

  fullName: string;

  companyOrganisation: string;

  position: string;

  mobileNumber: string;

  emailAddress: string;

  productServiceRequired: string;

  interestedInQuotation: boolean;

  interestedInPartnership: boolean;

  interestedInMeeting: boolean;

  consentToBeContacted: boolean;

  submittedAt?: string;
}