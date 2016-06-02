/**
 * Created by freddyrondon on 5/2/16.
 */

import {EventEmitter} from 'events'


export default class TableDataStore extends EventEmitter {
    constructor(data) {
        super();
        this.childrenIndexList = null;
        this.colInfos = null;
        this.data = data;
        this.elemStateMap = {};
        this.filteredData = null;
        this.isOnFilter = false;
        this.pageObj = {};
        this.parentIndexList = null;
        this.searchText = null;

        if (this.data.length > 0) {
            this._buildElemStateMap();
            this.emit("change:elem");
        }
    }

    setProps(props) {
        this.colInfos = props.colInfos;
        this.enablePagination = props.isPagination;
        this.keyField = props.keyField;
        this.manageParents = props.hasParent;
    }

    setData(data) {
        if (data.length < 1) {
            return
        }
        this.data = data;
        this.emit("change");
        this._buildElemStateMap();
        this.emit("change:elem");
    }

    _buildElemStateMap() {
        this.parentIndexList = [];
        this.childrenIndexList = [];
        for (let i = 0; i < this.data.length; i++) {
            const key = this.getKeyFromIndex(i);
            const isChild = this.data[i].hasOwnProperty("child");
            if (isChild) {
                this.childrenIndexList.push(key)
            } else {
                this.parentIndexList.push(key)
            }

            if (!this.elemStateMap.hasOwnProperty(key)) {
                this.elemStateMap[key] = {
                    isOn: true,
                    isOnLastValue: true,
                    shouldHide: isChild,
                    type: isChild ? 'child' : 'parent'
                };
            }
            this.elemStateMap[key].index = i;
            this.elemStateMap[key].parentId = this.parentIndexList[this.parentIndexList.length - 1];
        }
    }

    getIndexFromKey(key) {
        return this.getElementState(key).index;
    }

    getKeyFromIndex(index) {
        return this.data[index][this.getKeyField()];
    }

    getElementState(key) {
        return this.elemStateMap[key]
    }

    getElementsState() {
        return this.elemStateMap
    }

    getParentState(key) {
        if (this.isChild(key)) {
            return this.getElementState(this.getElementState(key).parentId)
        }
        return this.getElementState(key)
    }

    isChild(key) {
        return this.elemStateMap[key].type === 'child'
    }

    showChildrenElem() {
        for (let i = 0; i < this.childrenIndexList.length; i++) {
            const key = this.childrenIndexList[i];
            this.elemStateMap[key].shouldHide = false
        }
        this.emit("change:elem");
    }

    hideChildrenElem() {
        for (let i = 0; i < this.childrenIndexList.length; i++) {
            const key = this.childrenIndexList[i];
            this.elemStateMap[key].shouldHide = true
        }
        this.emit("change:elem");
    }

    toggleChildrenOfParentIndex(key) {
        const index = this.getIndexFromKey(key);
        for (let i = +index + 1; i < this.data.length; i++) {
            const key = this.getKeyFromIndex(i);
            if (this.isChild(key)) {
                this.elemStateMap[key].shouldHide = !this.elemStateMap[key].shouldHide
            } else {
                break;
            }
        }
        this.emit("change:elem");
    }

    toggleSwitchTotal(totalRowIsOn) {
        for (let i = 0; i < this.data.length; i++) {
            const key = this.getKeyFromIndex(i);
            if (!this.isChild(key)) {
                this.elemStateMap[key].isOn = totalRowIsOn ? this.elemStateMap[key].isOnLastValue : false
            } else {
                const parent = this.getParentState(key);
                this.elemStateMap[key].isOn = !totalRowIsOn ? false : (!parent.isOnLastValue ? false : this.elemStateMap[key].isOnLastValue)
            }
        }
        this.emit("change:elem");
    }

    toggleSwitchParent(key) {
        // update parent
        this.elemStateMap[key].isOn = !this.elemStateMap[key].isOn;
        this.elemStateMap[key].isOnLastValue = this.elemStateMap[key].isOn;

        // update children
        const index = this.getIndexFromKey(key);
        for (let i = +index + 1; i < this.data.length; i++) {
            const childKey = this.getKeyFromIndex(i);
            if (this.isChild(childKey)) {
                this.elemStateMap[childKey].isOn = this.elemStateMap[key].isOn ? this.elemStateMap[childKey].isOnLastValue : false
            } else {
                break;
            }
        }
        this.emit("change:elem");
    }

    toggleSwitchChildren(key) {
        this.elemStateMap[key].isOn = !this.elemStateMap[key].isOn;
        this.elemStateMap[key].isOnLastValue = this.elemStateMap[key].isOn;
        this.emit("change:elem");
    }

    /* General search function
     * It will search for the text if the input includes that text;
     */
    search(searchText) {
        if (searchText.trim() === '') {
            this.filteredData = null;
            this.isOnFilter = false;
            this.searchText = null;
            if (this.manageParents){
                this.hideChildrenElem()
            }
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
            if (this.manageParents){
                this.showChildrenElem()
            }
        }
    }

    getCurrentDisplayData() {
        if (this.isOnFilter) {
            return this.filteredData;
        }
        return this.data;
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
        }

        let result = [];
        let start = this.pageObj.start;
        let end = this.pageObj.end;

        if (this.manageParents && !this.isOnFilter && this.parentIndexList) {
            start = this.getIndexFromKey(this.parentIndexList[start]);
            end = this.parentIndexList[end + 1] === undefined ? this.data.length - 1 : this.getIndexFromKey(this.parentIndexList[end + 1]) - 1;
        }

        for (let i = start; i <= end; i++) {
            result.push(_data[i]);
            if (i + 1 === _data.length) break;
        }
        return result;
    }

    getKeyField() {
        return this.keyField;
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