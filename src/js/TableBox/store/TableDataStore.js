/**
 * Created by freddyrondon on 5/2/16.
 */

import {EventEmitter} from 'events'


export default class TableDataStore extends EventEmitter {
    constructor(data) {
        super();
        this.data = data;
        this._calculateParentIndex();
        this.pageObj = {};
    }

    setProps(props) {
        this.enablePagination = props.isPagination;
        this.manageParents = props.hasParent;
    }

    setData(data) {
        this.data = data;
        this._calculateParentIndex();
        this.emit("change");
    }

    _calculateParentIndex() {
        this.parentIndexList = [];
        for (let i = 0; i < this.data.length; i++) {
            if (!this.data[i].hasOwnProperty("child")) {
                this.parentIndexList.push(i);
            }
        }
    }

    page(page, sizePerPage) {
        this.pageObj.end = page * sizePerPage - 1;
        this.pageObj.start = this.pageObj.end - (sizePerPage - 1);
        return this;
    }

    get() {
        if (!this.enablePagination || this.data.length === 0) {
            return this.data;
        } else {
            let result = [];

            let start = this.pageObj.start;
            let end = this.pageObj.end;

            if (this.manageParents) {
                start = this.parentIndexList[this.pageObj.start];
                end = this.parentIndexList[this.pageObj.end + 1] === undefined ? this.data.length - 1 : this.parentIndexList[this.pageObj.end + 1] - 1;
            }

            for (let i = start; i <= end; i++) {
                result.push(this.data[i]);
                if (i + 1 === this.data.length) break;
            }
            return result;
        }
    }

    getDataNum() {
        if (this.manageParents) {
            const parents = this.data.filter((item) => {
                return !item.hasOwnProperty("child")
            });
            return parents.length;
        }
        return this.data.length;
    }

    isChangedPage() {
        return this.pageObj.start && this.pageObj.end ? true : false;
    }
}