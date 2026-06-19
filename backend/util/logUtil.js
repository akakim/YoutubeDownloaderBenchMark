// LogUtil.js

const env = {
  verbose: process.env.VERBOSE === 'true' || process.env.NODE_ENV === 'development',
};

const getCallerFileName = () => {
  const stack = new Error().stack;

  if (!stack) {
    return 'unknown';
  }

  const stackLines = stack.split('\n');

  // stackLines 예시:
  // 0: Error
  // 1: at getCallerFileName (.../LogUtil.js:...)
  // 2: at logging (.../LogUtil.js:...)
  // 3: at 실제 호출한 함수 (.../SSulFactoryController.js:...)
  const callerLine = stackLines[3] || '';
  const match = callerLine.match(/\((.*?):\d+:\d+\)$/) || callerLine.match(/at (.*?):\d+:\d+$/);

  if (!match || !match[1]) {
    return 'unknown';
  }

  return match[1].split(/[\\/]/).pop();
};

export const v_logging = (logContent, isShowing = false) => {
  if (!env.verbose && !isShowing) {
    return;
  }

  const fileName = getCallerFileName();

  console.log({
    [fileName]: logContent,
  });
};

export default v_logging;