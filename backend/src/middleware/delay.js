const delay = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 1000);
};

export default delay;
