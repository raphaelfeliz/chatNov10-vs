/* *file-summary*
PATH: src/helpers/mergeNonEmptyContact.ts

PURPOSE: Updates an existing ContactInfo object only with non-empty values from another.

SUMMARY: Skips null or empty strings.
*/

export interface ContactInfo {
  userName: string;
  userPhone: string;
  userEmail: string;
}

export default function mergeNonEmptyContact(
  base: ContactInfo,
  patch: Partial<ContactInfo>
): ContactInfo {
  const result = { ...base };
  
  if (patch.userName && patch.userName.trim() !== '') {
    result.userName = patch.userName;
  }
  
  if (patch.userPhone && patch.userPhone.trim() !== '') {
    result.userPhone = patch.userPhone;
  }
  
  if (patch.userEmail && patch.userEmail.trim() !== '') {
    result.userEmail = patch.userEmail;
  }
  
  return result;
}
