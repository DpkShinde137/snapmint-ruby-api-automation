export class DataGenerator {
  /**
   * Generates a random Indian mobile number.
   * Indian mobile numbers start with 6, 7, 8, or 9 followed by 9 digits.
   */
  static generateMobile(): string {
    const prefixes = ['6', '7', '8'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let remainingDigits = '';
    for (let i = 0; i < 9; i++) {
      remainingDigits += Math.floor(Math.random() * 10).toString();
    }
    return randomPrefix + remainingDigits;
  }

  /**
   * Generates a dynamic email using a timestamp and a random string.
   */
  static generateEmail(prefix: string = 'qa'): string {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${timestamp}${randomSuffix}@snapmint.com`;
  }

  /**
   * Generates a random full name.
   */
  static generateName(): string {
    const firstNames = ['John', 'Jane', 'Amit', 'Raj', 'Priya', 'Sneha', 'Rahul', 'Neha', 'Test'];
    const lastNames = ['Doe', 'Smith', 'Sharma', 'Kumar', 'Patel', 'Singh', 'Joshi', 'Verma', 'User'];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
  }
}
