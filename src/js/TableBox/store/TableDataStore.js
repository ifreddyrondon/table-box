/**
 * Created by freddyrondon on 5/2/16.
 */

import {EventEmitter} from 'events'
import _ from 'lodash'


export default class TableDataStore extends EventEmitter {
    constructor(data) {
        super();
        this.data = data;
        this.filteredData = null;
        this.isOnFilter = false;
        this.searchText = null;
        this._calculateParentIndex();
        this.pageObj = {};
    }

    setProps(props) {
        this.enablePagination = props.isPagination;
        this.manageParents = props.hasParent;
    }

    setData(data) {
        if (!_.isEqual(this.data, data)) {
            this.data = data;
            this._calculateParentIndex();
            this.emit("change");
        }
    }

    _calculateParentIndex() {
        this.parentIndexList = [];
        for (let i = 0; i < this.data.length; i++) {
            if (!this.data[i].hasOwnProperty("child")) {
                this.parentIndexList.push(i);
            }
        }
    }

    /* General search function
     * It will search for the text if the input includes that text;
     */
    search(searchText) {
        if (searchText.trim() === '') {
            this.filteredData = null;
            this.isOnFilter = false;
            this.searchText = null;
        } else {
            this.searchText = searchText;
            let searchTextArray = [];

            searchTextArray.push(searchText);

            this.filteredData = this.data.filter(row => {
                const keys = Object.keys(row);
                let valid = false;
                // for loops are ugly, but performance matters here.
                // And you cant break from a forEach.
                // http://jsperf.com/for-vs-foreach/66
                for (let i = 0, keysLength = keys.length; i < keysLength; i++) {
                    const key = keys[i];
                    if (!row[key]) {
                        continue
                    }
                    let targetVal = row[key];
                    for (let j = 0, textLength = searchTextArray.length; j < textLength; j++) {
                        const filterVal = searchTextArray[j].toLowerCase();
                        if (targetVal.toString().toLowerCase().indexOf(filterVal) !== -1) {
                            valid = true;
                            break;
                        }
                    }
                }
                return valid;
            });
            this.isOnFilter = true;
        }
    }

    getCurrentDisplayData() {
        if (this.isOnFilter) return this.filteredData;
        else return this.data;
    }

    page(page, sizePerPage) {
        this.pageObj.end = page * sizePerPage - 1;
        this.pageObj.start = this.pageObj.end - (sizePerPage - 1);
        return this;
    }

    getDataIgnoringPagination() {
        return this.getCurrentDisplayData();
    }

    get() {
        const _data = this.getCurrentDisplayData();

        if (_data.length === 0) return _data;

        if (!this.enablePagination) {
            return _data;
        } else {
            let result = [];

            let start = this.pageObj.start;
            let end = this.pageObj.end;

            if (this.manageParents && !this.isOnFilter) {
                start = this.parentIndexList[this.pageObj.start];
                end = this.parentIndexList[this.pageObj.end + 1] === undefined ? this.data.length - 1 : this.parentIndexList[this.pageObj.end + 1] - 1;
            }

            for (let i = start; i <= end; i++) {
                result.push(_data[i]);
                if (i + 1 === _data.length) break;
            }
            return result;
        }
    }

    getDataNum() {
        if (this.manageParents && !this.isOnFilter) {
            const parents = this.data.filter((item) => {
                return !item.hasOwnProperty("child")
            });
            return parents.length;
        }
        return this.getCurrentDisplayData().length;
    }

    isChangedPage() {
        return this.pageObj.start && this.pageObj.end ? true : false;
    }
}