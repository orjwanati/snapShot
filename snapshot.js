/*!
 * snapshot <>
*  This File conatins a simple implementation the Memento design pattern which is behavioral pattern and one of 
 *  23 design patterns discussed by Gang of Four. Memento pattern is used to restore state of an object 
 *  to a previous state. It is also known as snapshot pattern.
 * Copyright (c) 2022, Orjuwan Al-Wadeai.
 * Released under the MIT License.
 */


/**
 * A class that represents a default object that is used for SnapshotArray and SnapshotObject
 */
class StoreObject {
    
    /**
     * data to store in the object
     * data
     * @type {Any}
     */
    data = null;

    /**
     * Constructor
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * initiate an instance of the class
     * @param {*} data: Object that holds required data 
     * @returns {StoreObject} - the object created
     */
    static Create(data) {
        return new StoreObject(data);
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
     * This function resets the snapshot list.
     * @loaded is set to false, @objects is set to empty array, and @history is cleared.
     */
    reset() {
        this.loaded = false;
        this.objects = [];
        this.history = null;
      }

      /**
       * Creates a snapshot list from a list of items 
       * @param {*} items list of objects
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
     * Stores current state in history
     */
    onChange() {
        if(this.history === null) {
          this.history = this.objects.slice(); 
        }
      }


      /**
       * Undo any changes since the last save
       */
    undo() {
        if(this.history !== null) {
            this.objects = this.history.slice(); 
            this.history = null;
        }
    }

    /**
     * Commits changes and Clears History
     */
    save() {
        this.history = null;
    }

    /**
     * Create a new item, doesnot add it to snapshot list
     * @param {*} item object to create a new entry from 
     * @returns the created new object
     */
    createItem(item) {
         this.newObject = this.createMethod(item);
        return this.newObject;
    }

    /**
     * Adds the last created object using {createItem} to snapshot list
     */
    saveAdd() {
        if(this.newObject) {
            this.objects.unshift(this.newObject);
            this.newObject = null;
        }
    }

    /**
     * Undo action performed by {createItem, esaveAdd}
     */
    undoAdd() {
        this.newObject = null;
    }

    /**
     * Create a new object and adds it to the start of the snapshot list
     * needs to call {save} to commit the delete
     * @param {*} item data of the new item
     * @returns the new object created and added
     */
    add(item) {
        this.onChange();
        let newLength = this.objects.unshift(this.createMethod(item));

        return this.objects[0]
    }

    /**
     * Create a new object and adds it to the end of the snapshot list
     * needs to call {save} to commit the delete
     * @param {*} item data of the new item
     * @returns the new object created and added
     */
    push(item) {
        this.onChange();
        let newLength = this.objects.push(this.createMethod(item));

        return this.objects[newLength-1]
    }

    /**
     * delete an object in the snapshot list that has the paramater 'key' with 'value'
     * needs to call {save} to commit the delete
     * @param {*} key name of a paramater 
     * @param {*} value value of the parameter
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
     * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
     * @param {*} findFunction the filter function that is applied to each element in the list until one matches the condition
     */
    findObject(findFunction) {
        return this.objects.find(findFunction);
    }

    /**
     * Returns the elements of snapshot list that meet the condition specified in {filterFunction}.
     * @param {*} filterFunction the filter function that is applied to each element in the list 
     */
    filterObjects(filterFunction) {
        return this.objects.filter(filterFunction);
    }

    /**
     * Sorts an array in place. 
     * @param {*} sortFunction Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    sortObjects(sortFunction) {
        this.objects = this.objects.slice().sort(sortFunction)
    }

    /**
     * Reverses the elements in an array in place. 
     */
    reverseObjects() {
        this.objects = this.objects.slice().reverse();
    }

    /**
     * returns snapshot list 
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
     * Constructor
     * @param {*} createMethod: a function that is used to create a snapshot Object
     */
    constructor(createMethod= (tmp) => (tmp)) {
        this.createMethod = createMethod
    }

    /**
    * This function resets the snapshot object.
    * @loaded is set to false, @object is set to null, and @history is cleared.
     */
    reset() {
        this.loaded = false;
        this.object = null;
        this.history = null;
      }

     /**
       * Creates a snapshot object from an item 
       * @param {*} val the value of the object
      */ 
    create(val) {
        this.object = this.createMethod(val);
        this.loaded = true
    }

    /**
     * Changes the value of the snapshot object.
     * needs to call {save} to commit the delete
     * @param {*} val the new value
     */
    change(val) {
        this.onChange();
        this.object = this.createMethod(val)
    }

    /**
     * Stores current state in history
     */
    onChange() {
        if(this.history === null) {
          this.history = this.createMethod(this.object)
        }
      }

    /**
     * Undo any changes since the last save
     */
    undo() {
        if(this.history !== null) {
            this.object = this.createMethod(this.history);
            this.history = null;
        }
    }

    /**
     * get the value of the saved snapshot object
     */
    get value() {
        return this.object;
    }

    /**
     * Commits changes and Clears History
     */
    save() {
        this.history = null;
    }
}


module.exports.SnapshotArray = SnapshotArray;
module.exports.SnapshotObject = SnapshotObject;
