export const track = (eventName: string) => {
  if (typeof (window as unknown as any).umami?.trackEvent !== "function")
    return;

  if (location.hostname === "localhost") {
    console.log(`Track: ${eventName}`);
    return;
  }
  (window as unknown as any).umami.trackEvent(eventName);
};
