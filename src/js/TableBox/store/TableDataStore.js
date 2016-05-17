/**
 * Created by freddyrondon on 5/2/16.
 */

import {EventEmitter} from 'events'


export default class TableDataStore extends EventEmitter {
    constructor(data){
        super();
        this.data = data;
    }

    setData(data) {
        this.data = data;
        this.emit("change");
    }

    getAll(){
        return this.data;
    }
}