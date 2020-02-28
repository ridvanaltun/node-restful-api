const maxAttemptsByIPperDay = 100;

module.exports = {
  bruteForce: {
    keyPrefix: 'global_rate_limit',
    points: 10, // Number of points
    duration: 1, // Per second(s)
  },
  slowBruteByIP: {
    keyPrefix: 'login_ip_per_day',
    points: maxAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 attempts per day
  },
};
