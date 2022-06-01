/**
 *  This File conatins a simple implementation the Memento design pattern which is behavioral pattern and one of 
 *  23 design patterns discussed by Gang of Four. Memento pattern is used to restore state of an object 
 *  to a previous state. It is also known as snapshot pattern.
 */

/**
 * A class that represents a default object that is used for SnapshotArray and SnapshotObject
 */
class StoreObject {
    data = null;
    /**
     * Constructor
     * @param {*} data 
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * a class method to create an instance of the class
     * @param {*} item 
     * @returns 
     */
    static Create(item) {
        return new StoreObject(item);
    }
}

/**
 * 
 */
 class SnapshotArray {
    history = null;
    objects = [];
    loaded = false;
    newObject = null;
    createMethod;
    sortMethod;

    /**
     * Constructor
     * @param {*} createMethod: a function that is used to create an item Object
     * @param {*} sortMethod: a default function that is used to sort array
     */
    constructor(createMethod=(item)=>(StoreObject.Create(item)), sortMethod=(item)=>(item)) {
        this.createMethod = createMethod;
        this.sortMethod = sortMethod;
    }

    /**
     * This function resets the whole object to initial state when the it was created.
     * @loaded is set to false, @objects is set to empty array, and @history is cleared.
     */
    reset() {
        this.loaded = false;
        this.objects = [];
        this.history = null;
      }

      /**
       * 
       * @param {*} items 
       */
    create(items) {
        this.objects = []
        for(let tmp of items) {
          let item = tmp;
          this.objects.push(this.createMethod(item));
        }
        this.loaded = true
    }

    /**
     * 
     */
    onChange() {
        if(this.history === null) {
          this.history = this.objects.slice(); 
        }
      }


      /**
       * 
       */
    undo() {
        if(this.history !== null) {
            this.objects = this.history.slice(); 
            this.history = null;
        }
    }

    /**
     * 
     */
    save() {
        this.history = null;
    }

    /**
     * 
     * @param {*} item 
     * @returns 
     */
    createItem(item) {
         this.newObject = this.createMethod(item);
        return this.newObject;
    }

    /**
     * 
     */
    saveAdd() {
        if(this.newObject) {
            this.objects.unshift(this.newObject);
            this.newObject = null;
        }
    }

    /**
     * 
     */
    undoAdd() {
        this.newObject = null;
    }

    /**
     * 
     * @param {*} item 
     * @returns 
     */
    add(item) {
        this.onChange();
        let newLength = this.objects.unshift(this.createMethod(item));

        return this.objects[0]
    }

    /**
     * 
     * @param {*} item 
     * @returns 
     */
    push(item) {
        this.onChange();
        let newLength = this.objects.push(this.createMethod(item));

        return this.objects[newLength-1]
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     */
    delete(key, value) {
        this.onChange();
        var filtered = this.objects.filter((item) =>  item[key] !== value); 
        this.objects = filtered;
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    getObject(key, value) {
        let item = this.objects.find((item) => item[key] === value);
        if(!item) {
            if(this.newObject && this.newObject[key] === value) {
                item = this.newObject
            }
        }
        return item
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    getObjectFromHistory(key, value) {
        return this.history.find((item) => item[key] === value);
    }

    /**
     * 
     */
    get length() {
        return this.objects.length
    }

    /**
     * 
     * @param {*} mapFunction 
     * @returns 
     */
    mapObjects(mapFunction) {
        return this.objects.map(mapFunction)
    }

    /**
     * 
     * @param {*} findFunction 
     * @returns 
     */
    findObject(findFunction) {
        return this.objects.find(findFunction);
    }

    /**
     * 
     * @param {*} findFunction 
     * @returns 
     */
    filterObjects(findFunction) {
        return this.objects.filter(findFunction);
    }

    /**
     * 
     * @param {*} sortFunction 
     */
    sortObjects(sortFunction) {
        this.objects = this.objects.slice().sort(sortFunction)
    }

    /**
     * 
     */
    reverseObjects() {
        this.objects = this.objects.slice().reverse();
    }

    /**
     * 
     */
    get all() {
        return this.sortMethod(this.objects);
    }
}

  class SnapshotObject {
    history = null;
    object;
    loaded = false;
    createMethod = (tmp) => (tmp);

    /**
     * 
     * @param {*} createMethod 
     */
    constructor(createMethod= (tmp) => (tmp)) {
        this.createMethod = createMethod
    }

    /**
     * 
     */
    reset() {
        this.loaded = false;
        this.object = null;
        this.history = null;
      }

     /**
      * 
      * @param {*} val 
      */ 
    create(val) {
        this.object = this.createMethod(val);
        this.loaded = true
    }

    /**
     * 
     * @param {*} val 
     */
    change(val) {
        this.onChange();
        this.object = this.createMethod(val)
    }

    /**
     * 
     */
    onChange() {
        if(this.history === null) {
          this.history = this.createMethod(this.object)
        }
      }

      /**
       * 
       */
    undo() {
        if(this.history !== null) {
            this.object = this.createMethod(this.history);
            this.history = null;
        }
    }

    /**
     * 
     */
    get value() {
        return this.object;
    }

    /**
     * 
     */
    save() {
        this.history = null;
    }
}


module.exports.SnapshotArray = SnapshotArray;
module.exports.SnapshotObject = SnapshotObject;
