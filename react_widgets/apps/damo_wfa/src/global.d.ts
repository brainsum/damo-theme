interface Window {
  drupalSettings?: {
    damopenWfa?: {
      canReview: boolean;
      // Set only when the optional consent module is enabled: assets that
      // cannot be approved yet or were marked "consent not needed", keyed by
      // media UUID.
      consent?: Record<
        string,
        {
          problem: string | null;
          notNeeded?: boolean;
          url?: string;
          toggleUrl?: string;
        }
      >;
    };
  };
}
