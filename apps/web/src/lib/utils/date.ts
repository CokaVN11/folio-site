/**
 * Date validation and formatting utilities
 */

/**
 * Validates if a date string is valid and can be parsed by Date constructor
 * @param dateString - Date string to validate (e.g., '2024-04-30')
 * @returns Boolean indicating if the date is valid
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  // Check basic YYYY-MM-DD format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);

  // Check if the date is invalid
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
}

/**
 * Validates if a date represents a date in the past or present
 * @param dateString - Date string to validate
 * @returns Boolean indicating if the date is not in the future
 */
export function isValidDateRange(dateString: string): boolean {
  if (!isValidDateString(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  const now = new Date();

  // Allow dates up to 1 month in the future (for upcoming projects)
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return date <= oneMonthFromNow;
}

/**
 * Safely creates a Date object from a string, with fallback
 * @param dateString - Date string to parse
 * @param fallbackDate - Fallback date if parsing fails (default: current date)
 * @returns Valid Date object
 */
export function safeParseDate(
  dateString: string | undefined,
  fallbackDate: Date = new Date()
): Date {
  if (!dateString) {
    return fallbackDate;
  }

  if (!isValidDateString(dateString)) {
    console.warn(`Invalid date format: "${dateString}". Using fallback date.`);
    return fallbackDate;
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.warn(`Failed to parse date: "${dateString}". Using fallback date.`);
    return fallbackDate;
  }

  return date;
}

/**
 * Formats a date string to ISO format, with validation
 * @param dateString - Date string to format
 * @returns ISO formatted date string or current date if invalid
 */
export function safeFormatDate(dateString: string | undefined): string {
  const date = safeParseDate(dateString);
  return date.toISOString();
}

/**
 * Validates metadata object for required date fields
 * @param metadata - Metadata object to validate
 * @returns Validation result with valid status and any errors
 */
export function validateMetadataDates(metadata: Record<string, any>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate primary date field
  if (!metadata.date) {
    errors.push('Missing required "date" field');
  } else if (!isValidDateString(metadata.date)) {
    errors.push(`Invalid date format: "${metadata.date}". Expected YYYY-MM-DD format.`);
  } else if (!isValidDateRange(metadata.date)) {
    errors.push(`Date "${metadata.date}" is too far in the future.`);
  }

  // Validate startDate if present
  if (metadata.startDate && !isValidDateString(metadata.startDate)) {
    errors.push(`Invalid startDate format: "${metadata.startDate}". Expected YYYY-MM-DD format.`);
  }

  // Validate endDate if present
  if (metadata.endDate && !isValidDateString(metadata.endDate)) {
    errors.push(`Invalid endDate format: "${metadata.endDate}". Expected YYYY-MM-DD format.`);
  }

  // Validate date range logic if both start and end dates are present
  if (
    metadata.startDate &&
    metadata.endDate &&
    isValidDateString(metadata.startDate) &&
    isValidDateString(metadata.endDate)
  ) {
    const start = new Date(metadata.startDate);
    const end = new Date(metadata.endDate);

    if (start > end) {
      errors.push(
        `startDate "${metadata.startDate}" cannot be after endDate "${metadata.endDate}".`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
