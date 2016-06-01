/**
 * Created by freddyrondon on 4/16/16.
 */

import React, {Component, PropTypes} from 'react';
import classSet from 'classnames'

import TableRow from './TableRow'
import Const from './Const'

class TableBody extends Component {

    constructor() {
        super();
    }

    _setRowState(rows) {
        // set the state for each row
        var parentId = null;
        rows.forEach((data, i) => {
            const isChild = data['child'] || false;
            if (!isChild) {
                parentId = i;
            }

            this.setState({
                ['row-' + i]: {
                    type: isChild ? 'child' : 'parent',
                    parentId: parentId,
                    shouldHide: isChild,
                    isOn: true,
                    isOnLastValue: true
                }
            });
        });
    }

    componentWillMount() {
        this._setRowState(this.props.data);

        // set total row state
        if (this.props.hasTotals) {
            this.setState({
                'row-total': {
                    isOn: true
                }
            });
        }

        // set the selected row
        if (this._isSelectRowDefined()) {
            this.setState({
                rowSelected: this.props.selectRow.selected
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data.length !== nextProps.data.length) {
            this._setRowState(nextProps.data);
        }

        if (this._isSelectRowDefined()) {
            return
        }

        if (nextProps.isDataOnFilter) {
            this._showAllRows()
        } else {
            this._hideChildren()
        }
    }

    _showAllRows() {
        for (let i = 0; i < this.props.data.length; i++) {
            this.setState({
                ['row-' + i]: {
                    type: this.state['row-' + i].type,
                    shouldHide: false,
                    isOn: this.state['row-' + i].isOn,
                    isOnLastValue: this.state['row-' + i].isOnLastValue,
                    parentId: this.state['row-' + i].parentId
                }
            });
        }
    }

    _hideChildren() {
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.state['row-' + i].type === "child") {
                this.setState({
                    ['row-' + i]: {
                        type: this.state['row-' + i].type,
                        shouldHide: true,
                        isOn: this.state['row-' + i].isOn,
                        isOnLastValue: this.state['row-' + i].isOnLastValue,
                        parentId: this.state['row-' + i].parentId
                    }
                });
            }
        }
    }

    renderTableHeader() {
        const tableHeader = this.props.columns.map((column, i) => {
            const style = {
                display: column.hidden ? 'none' : null
            };
            return (<col style={ style } key={ i } className={ column.className }></col>);
        });

        return (
            <colgroup ref='header'>
                { tableHeader }
            </colgroup>
        );
    }

    _getTotals() {
        let totalRow = {};
        this.props.columns.forEach((item, i) => {
            if (i === 0) {
                totalRow[item.name] = 'TOTALS'
            } else {
                if (item.type === "number" || item.type === "p_l" || item.type === "currency") {
                    totalRow[item.name] = 0
                } else if (item.type === "plot") {
                    totalRow[item.name] = []
                }
            }
        });

        this.props.data.forEach((item) => {
            if (item['child'] === undefined || item['child'] === false) {
                this.props.columns.forEach((colItem, i) => {
                    if (i > 0 && totalRow.hasOwnProperty(colItem.name)) {
                        if (typeof item[colItem.name] === "number") {
                            totalRow[colItem.name] += item[colItem.name];
                        } else if (typeof item[colItem.name] === "object") {
                            if (totalRow[colItem.name].length === 0) {
                                totalRow[colItem.name] = item[colItem.name]
                            } else {
                                totalRow[colItem.name] = totalRow[colItem.name].map(function (num, idx) {
                                    return num + item[colItem.name][idx];
                                });
                            }
                        }
                    }
                });
            }
        });

        return totalRow
    }

    renderTableTotals() {
        if (this.props.hasTotals) {
            const isSelectRowDefined = this._isSelectRowDefined();
            const selected = isSelectRowDefined && this.state.rowSelected == 'total';
            const totalClass = classSet('totals', {
                'total-underline': this.props.hasTotalsOptions.underline
            });

            return (
                <TableRow
                    key="##table-totals##"
                    className={totalClass}
                    columns={this.props.columns}
                    data={this._getTotals()}
                    isParent={false}
                    isOn={this.state['row-total'].isOn}
                    handleSwitchChildren={this.handleSwitchTotal.bind(this)}
                    onRowClick={ this.handleTotalRowClick.bind(this) }
                    selected={selected}/>
            );
        }

        return ''
    }

    handleToggleParent(key) {
        for (let i = +key + 1; i < this.props.data.length; i++) {
            if (this.state['row-' + i].type === 'child') {
                this.setState({
                    ['row-' + i]: {
                        type: this.state['row-' + i].type,
                        shouldHide: !this.state['row-' + i].shouldHide,
                        isOn: this.state['row-' + i].isOn,
                        isOnLastValue: this.state['row-' + i].isOnLastValue,
                        parentId: this.state['row-' + i].parentId
                    }
                });
            } else {
                break;
            }
        }
    }

    handleSwitchTotal() {
        // update total
        this.setState({
            ['row-total']: {
                isOn: !this.state['row-total'].isOn
            }
        }, () => {
            // update children
            for (let i = 0; i < this.props.data.length; i++) {
                if (this.state['row-' + i].type === 'parent') {
                    this.setState({
                        ['row-' + i]: {
                            type: this.state['row-' + i].type,
                            shouldHide: this.state['row-' + i].shouldHide,
                            isOn: this.state['row-total'].isOn ? this.state['row-' + i].isOnLastValue : false,
                            isOnLastValue: this.state['row-' + i].isOnLastValue,
                            parentId: this.state['row-' + i].parentId
                        }
                    });
                }
                else if (this.state['row-' + i].type === 'child') {
                    const parent = this.state['row-' + this.state['row-' + i].parentId];
                    this.setState({
                        ['row-' + i]: {
                            type: this.state['row-' + i].type,
                            shouldHide: this.state['row-' + i].shouldHide,
                            isOn: !this.state['row-total'].isOn ? false : (!parent.isOnLastValue ? false : this.state['row-' + i].isOnLastValue),
                            isOnLastValue: this.state['row-' + i].isOnLastValue,
                            parentId: this.state['row-' + i].parentId
                        }
                    });
                }
            }
        });
    }

    _toggleParentSwitch(key) {
        const isTotalOn = this.props.hasTotals ? this.state['row-total'].isOn : true;

        // update parent
        this.setState({
            ['row-' + key]: {
                type: this.state['row-' + key].type,
                shouldHide: this.state['row-' + key].shouldHide,
                isOn: isTotalOn ? !this.state['row-' + key].isOn : false,
                isOnLastValue: isTotalOn ? !this.state['row-' + key].isOn : this.state['row-' + key].isOnLastValue,
                parentId: this.state['row-' + key].parentId
            }
        });

        // update children
        for (let i = +key + 1; i < this.props.data.length; i++) {
            if (this.state['row-' + i].type === 'child') {
                this.setState({
                    ['row-' + i]: {
                        type: this.state['row-' + i].type,
                        shouldHide: this.state['row-' + i].shouldHide,
                        isOn: !this.state['row-' + key].isOn ? this.state['row-' + i].isOnLastValue : false,
                        isOnLastValue: this.state['row-' + i].isOnLastValue,
                        parentId: this.state['row-' + i].parentId
                    }
                });
            } else {
                break;
            }
        }
    }

    handleSwitchParent(key) {
        // check if total and if total is ON
        if ((this.props.hasTotals && !this.state['row-total'].isOn)) {
            return false;
        }

        // if switch is not parent, don't do nothing
        if (this.state['row-' + key].type === 'child') {
            return false
        }

        this._toggleParentSwitch(key)
    }

    handleSwitchChildren(key) {
        const row = this.state['row-' + key];
        if (row.type !== 'child') {
            return false;
        }

        // check if parent is ON
        if (!this.state['row-' + row.parentId].isOn) {
            return false;
        }

        this.setState({
            ['row-' + key]: {
                type: this.state['row-' + key].type,
                shouldHide: this.state['row-' + key].shouldHide,
                isOn: !this.state['row-' + key].isOn,
                isOnLastValue: !this.state['row-' + key].isOn,
                parentId: this.state['row-' + key].parentId
            }
        });
    }

    _attachClearSortCaretFunc() {
        const {children} = this.props;
        for (let i = 0; i < this.props.children.length; i++) {
            // const sort = (dataSort && dataField === sortName) ? sortOrder : undefined;
            const sort = undefined;
            this.props.children[i] = React.cloneElement(
                children[i], {key: i, sort, onSort: this.handleSort.bind(this)});
        }
    }

    handleSort(order, sortField) {
        console.log(order);
        console.log(sortField);
        // if (this.props.options.onSortChange) {
        //     this.props.options.onSortChange(sortField, order, this.props);
        // }
        //
        // const result = this.store.sort(order, sortField).get();
        // this.setState({
        //     data: result
        // });
    }

    handleRowClick(rowIndex) {
        if (this._isSelectRowDefined()) {
            this.setState({
                rowSelected: rowIndex
            });
            const {data, onRowClick} = this.props;
            const selectedRow = data.filter((row, i) => {
                return i === rowIndex
            });
            onRowClick(selectedRow[0]);
        }
    }

    handleTotalRowClick() {
        if (this._isSelectRowDefined()) {
            this.setState({
                rowSelected: 'total'
            });
            this.props.onTotalRowClick();
        }
    }

    render() {
        const tableClasses = classSet('table', {
            'hidden': this.props.hidden,
            'table-striped': this.props.striped,
            'table-bordered': this.props.bordered,
            'table-hover': this.props.hover,
            'table-condensed': this.props.condensed
        });
        const isSelectRowDefined = this._isSelectRowDefined();
        this._attachClearSortCaretFunc();
        const tableHeader = this.renderTableHeader();
        const tableTotals = this.renderTableTotals();

        const tableRows = this.props.data.map((data, i) => {
            // check if parent or child
            const isChild = data['child'] || false;
            const isParent = !isChild && this.props.hasParent;
            const trClassName = classSet({
                'child': isChild,
                'parent': isParent
            });

            const selected = isSelectRowDefined && this.state.rowSelected == i;

            return (
                <TableRow
                    key={ i }
                    _key={ i }
                    className={ trClassName }
                    columns={this.props.columns}
                    data={data}
                    isParent={isParent}
                    shouldHide={this.state['row-' + i].shouldHide}
                    handleToggleParent={this.handleToggleParent.bind(this)}
                    isOn={this.state['row-' + i].isOn}
                    handleSwitchParent={this.handleSwitchParent.bind(this)}
                    handleSwitchChildren={this.handleSwitchChildren.bind(this)}
                    onRowClick={ this.handleRowClick.bind(this) }
                    selected={selected}/>
            )
        });

        if (tableRows.length === 0) {
            tableRows.push(
                <tr key="##tr--table-empty##" className="text-center">
                    <td colSpan={ this.props.columns.length }
                        className='react-bs-table-no-data'>
                        <h4>{ this.props.noDataText || Const.NO_DATA_TEXT }</h4>
                    </td>
                </tr>
            );
        }

        return (
            <div ref='container' className='table-body-wrapper' style={ this.props.style }>
                <table className={ tableClasses }>
                    <thead>
                    <tr ref='header'>
                        { this.props.children }
                    </tr>
                    </thead>
                    { tableHeader }
                    <tbody ref='tbody'>
                    { tableTotals }
                    { tableRows }
                    </tbody>
                </table>
            </div>
        )
    }

    _isSelectRowDefined() {
        return this.props.selectRow.hasOwnProperty('selected');
    }
}

TableBody.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    striped: PropTypes.bool,
    bordered: PropTypes.bool,
    hasParent: PropTypes.bool,
    hover: PropTypes.bool,
    isDataOnFilter: PropTypes.bool,
    condensed: PropTypes.bool,
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onSelectRow: PropTypes.func,
    style: PropTypes.object
};

export default TableBody;
