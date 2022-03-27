module.exports = class Swipeable {
  constructor() {
    //Cannot instantiate abstract class
    if (new.target === Swipeable) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
    //Must define update function for view
    if (this.update === undefined) {
      throw new TypeError("Must override update method");
    }
  }
};