class Notifier {
    constructor() {
      this.observers = [];
    }
  
    subscribe(observer) {
      this.observers.push(observer);
    }
  
    unsubscribe(observer) {
      this.observers = this.observers.filter((obs) => obs !== observer);
    }
  
    notify(data) {
      for (const observer of this.observers) {
        observer.update(data);
      }
    }
  }
  
  module.exports = Notifier;
