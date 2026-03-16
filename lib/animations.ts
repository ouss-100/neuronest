export const fadeUp = (i?: number, baseDelay = 0.2, step = 0.1) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: i !== undefined ? { delay: baseDelay + i * step, duration: 0.6 } : { duration: 0.6 },
  viewport: { once: true, amount: 0.3 },
});

export const scaleFadeIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, delay: 0.2 },
  viewport: { once: true, amount: 0.3 },
};