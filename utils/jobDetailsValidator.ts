// Valid values for each field
export const VALID_TIMEZONES = ["IST", "UTC", "GMT", "EST", "PST"] as const;
export const VALID_JOB_FREQUENCIES = ["24hrs", "12hrs", "6hrs"] as const;
export const VALID_JOB_START_TIMES = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", 
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
] as const; // Example hourly intervals

type Timezone = typeof VALID_TIMEZONES[number];
type JobFrequency = typeof VALID_JOB_FREQUENCIES[number];
type JobStartTime = typeof VALID_JOB_START_TIMES[number];

/**
 * Check if a timezone is valid.
 * @param timezone The timezone to validate.
 * @returns True if valid, otherwise false.
 */
export const isValidTimezone = (timezone: string | undefined | null): timezone is Timezone => {
  return VALID_TIMEZONES.includes(timezone as Timezone);
};

/**
 * Check if a job frequency is valid.
 * @param jobFrequency The job frequency to validate.
 * @returns True if valid, otherwise false.
 */
export const isValidJobFrequency = (
  jobFrequency: string | undefined | null
): jobFrequency is JobFrequency => {
  return VALID_JOB_FREQUENCIES.includes(jobFrequency as JobFrequency);
};

/**
 * Check if a job start time is valid.
 * @param jobStartTime The job start time to validate.
 * @returns True if valid, otherwise false.
 */
export const isValidJobStartTime = (
  jobStartTime: string | undefined | null
): jobStartTime is JobStartTime => {
  return VALID_JOB_START_TIMES.includes(jobStartTime as JobStartTime);
};


export const CRON_PATTERNS = new Map<string, string>([
  ["6hrs", "0 */6 * * *"],   // Every 6 hours
  ["12hrs", "0 */12 * * *"], // Every 12 hours
  ["24hrs", "0 0 * * *"],    // Every 24 hours
]);


/**
 * Get the cron pattern based on the interval string.
 * @param interval The interval string ("6hrs", "12hrs", or "24hrs").
 * @returns The corresponding cron pattern or an error if invalid.
 */
export const getCronPattern = (interval: string): string => {
  const pattern = CRON_PATTERNS.get(interval);
  if (!pattern) {
    throw new Error(`Invalid interval: ${interval}. Valid options are "6hrs", "12hrs", "24hrs".`);
  }
  return pattern;
};


// Map of time zone abbreviations to full time zone identifiers
const TIMEZONE_MAP = new Map<string, string>([
  ["IST", "Asia/Kolkata"],  // Indian Standard Time
  ["UTC", "Etc/UTC"],       // Coordinated Universal Time
  ["GMT", "Etc/GMT"],       // Greenwich Mean Time
  ["EST", "America/New_York"], // Eastern Standard Time
  ["PST", "America/Los_Angeles"], // Pacific Standard Time
]);

/**
 * Get the full time zone identifier based on the abbreviation.
 * @param abbreviation The time zone abbreviation (e.g., "IST", "UTC").
 * @returns The full time zone identifier or an error if invalid.
 */
export const getTimezoneIdentifier = (abbreviation: string): string => {
  const timezone = TIMEZONE_MAP.get(abbreviation);
  if (!timezone) {
    throw new Error(`Invalid time zone abbreviation: ${abbreviation}. Valid options are ${Array.from(TIMEZONE_MAP.keys()).join(", ")}.`);
  }
  return timezone;
};
