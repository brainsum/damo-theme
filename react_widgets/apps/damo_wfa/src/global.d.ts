interface Window {
  drupalSettings?: {
    damopenWfa?: {
      canReview: boolean;
      // Set only when the optional consent module is enabled: assets that
      // cannot be approved yet, keyed by media UUID.
      consent?: Record<string, { problem: string; url?: string }>;
    };
  };
}
