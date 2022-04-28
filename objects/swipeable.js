/**
 * Swipeable interface used to allow objects to be cycled left/right in an embedded discord message.
 * @interface
 * @type {Swipeable}
 */
class Swipeable {
  /**
   * Must define the *Uppdate* Method to update the discord embed
   * @constructor
   */
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
}

module.exports = Swipeable;