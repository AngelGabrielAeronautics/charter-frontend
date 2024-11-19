/**
 * @description Validates an email address according to the criteria specified by w3.
 * For more information visit: https://www.w3resource.com/javascript/form/email-validation.php
 * @param value : string
 * @returns :boolean
 */
export function ValidateEmail(value: string): boolean {
  const mailFormat = new RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );
  if (value.match(mailFormat)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @description Password must contain one digit from 1 to 9,
 * one lowercase letter, one uppercase letter, one special character,
 *  no space, and it must be 8-16 characters long.
 * @param value : string
 * @returns :boolean
 */
export function ValidatePassword(value: string): boolean {
  const passwordFormat = new RegExp(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  );
  if (value.match(passwordFormat)) {
    return true;
  } else {
    return false;
  }
}
