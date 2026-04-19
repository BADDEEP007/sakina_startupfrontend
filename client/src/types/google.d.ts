/**
 * Minimal type declarations for Google Identity Services (GSI).
 * The full library is loaded via the <script> tag in index.html.
 */

interface CredentialResponse {
  credential: string;          // The Google ID token (JWT)
  select_by: string;
  clientId: string;
}

interface IdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface PromptMomentNotification {
  isDisplayed(): boolean;
  isNotDisplayed(): boolean;
  getNotDisplayedReason(): string;
  isSkippedMoment(): boolean;
  getSkippedReason(): string;
  isDismissedMoment(): boolean;
  getDismissedReason(): string;
}

interface Google {
  accounts: {
    id: {
      initialize(config: IdConfiguration): void;
      prompt(callback?: (notification: PromptMomentNotification) => void): void;
      renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
      disableAutoSelect(): void;
      revoke(hint: string, callback: () => void): void;
    };
  };
}

declare global {
  interface Window {
    google?: Google;
  }
}

export {};
