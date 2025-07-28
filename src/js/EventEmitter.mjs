/**
 * A custom EventEmitter class for managing application-wide events.
 * Implements a simplified version of the Observer pattern.
 */
class EventEmitter {
    constructor() {
        /**
         * @private
         * @type {Object.<string, Array<function(...any): void>>}
         * Stores listeners for each event name.
         */
        this.events = {};
    }

    /**
     * Registers a listener function for a specific event.
     * @param {string} eventName - The name of the event to listen for.
     * @param {function(...any): void} listener - The function to call when the event is emitted.
     */
    on(eventName, listener) {
        if (typeof listener !== 'function') {
            console.error(`Listener for event "${eventName}" must be a function.`);
            return;
        }
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    /**
     * Removes a registered listener function for a specific event.
     * The listener must be the exact same function reference passed to `on()`.
     * @param {string} eventName - The name of the event.
     * @param {function(...any): void} listener - The listener function to remove.
     */
    off(eventName, listener) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(l => l !== listener);
    }

    /**
     * Emits an event, calling all registered listeners for that event.
     * @param {string} eventName - The name of the event to emit.
     * @param {...any} args - Arguments to pass to the listener functions.
     */
    emit(eventName, ...args) {
        if (!this.events[eventName]) {
            return;
        }
        // Create a copy of the listeners array to prevent issues if a listener removes itself
        // during iteration.
        [...this.events[eventName]].forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in listener for event "${eventName}":`, error);
                // Depending on severity, you might want to rethrow or log more aggressively
            }
        });
    }

    /**
     * Registers a listener function that will be called only once for a specific event.
     * @param {string} eventName - The name of the event to listen for.
     * @param {function(...any): void} listener - The function to call.
     */
    once(eventName, listener) {
        const wrapper = (...args) => {
            listener(...args);
            this.off(eventName, wrapper); // Remove itself after first call
        };
        this.on(eventName, wrapper);
    }

    /**
     * Returns an array of listeners for a given event.
     * @param {string} eventName - The name of the event.
     * @returns {Array<function(...any): void>} An array of listener functions.
     */
    listeners(eventName) {
        return this.events[eventName] ? [...this.events[eventName]] : [];
    }

    /**
     * Removes all listeners for a given event, or all listeners if no eventName is specified.
     * @param {string} [eventName] - The name of the event to remove listeners from.
     */
    removeAllListeners(eventName) {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }
}

// Export a singleton instance of the EventEmitter for application-wide use
// This ensures all parts of your app interact with the same event bus.
export const appEvents = new EventEmitter();