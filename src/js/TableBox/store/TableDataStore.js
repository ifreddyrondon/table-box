/**
 * Created by freddyrondon on 5/2/16.
 */

import {EventEmitter} from 'events'


export default class TableDataStore extends EventEmitter {
    constructor(data){
        super();
        this.data = data;
        this.pageObj = {};
    }

    setProps(props) {
        this.enablePagination = props.isPagination;
    }

    setData(data) {
        this.data = data;
        this.emit("change");
    }

    page(page, sizePerPage) {
        this.pageObj.end = page * sizePerPage - 1;
        this.pageObj.start = this.pageObj.end - (sizePerPage - 1);
        return this;
    }

    get(){
        if (!this.enablePagination || this.data.length === 0) {
            return this.data;
        } else {
            let result = [];
            for (let i = this.pageObj.start; i <= this.pageObj.end; i++) {
                result.push(this.data[i]);
                if (i + 1 === this.data.length) break;
            }
            return result;
        }
    }

    getDataNum() {
        return this.data.length;
    }

    isChangedPage() {
        return this.pageObj.start && this.pageObj.end ? true : false;
    }
}