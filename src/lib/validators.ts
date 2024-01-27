export class Validators {
  static validateEmail(email: string) {
    // tslint:disable-next-line:max-line-length
    const expression =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return expression.test(email);
  }
  static validateMobilePhone(phone: string) {
    const expression = /^([+]\d{2})?\d{10}$/;
    return expression.test(phone);
  }
}
