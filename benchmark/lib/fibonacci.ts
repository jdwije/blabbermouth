const fibonacci = (limit: number) => {
  let i;
  let fib = []; // Initialize array!
  fib[0] = 0;
  fib[1] = 1;
  for (i = 2; i <= limit; i++) {
    // Next fibonacci number = previous + one before previous
    // Translated to JavaScript:
    fib[i] = fib[i - 2] + fib[i - 1];
  }
  return fib;
};

export default fibonacci;
