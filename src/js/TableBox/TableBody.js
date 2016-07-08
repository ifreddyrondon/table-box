/**
 * Created by freddyrondon on 4/16/16.
 */

import React, {Component, PropTypes} from 'react';
import classSet from 'classnames'

import TableRow from './TableRow'
import Const from './Const'


const isFun = function (obj) {
    return obj && (typeof obj === 'function');
};


class TableBody extends Component {

    constructor() {
        super();

        this.state = {
            elementsState: {}
        };

        this.getElementsState = this.getElementsState.bind(this)
    }

    componentWillMount() {
        this.store = this.props.store;
        this.store.on("change:elem", this.getElementsState);
        this.getElementsState();

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

    componentWillUnmount() {
        this.store.removeListener("change:elem", this.getElementsState);
    }

    getElementsState() {
        this.setState({
            elementsState: this.store.getElementsState()
        })
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
        totalRow[this.props.columns[0].name] = 'TOTALS';
        for (let i = 1; i < this.props.columns.length; i++) {
            const item = this.props.columns[i];
            if (item.type === "number" || item.type === "p_l" || item.type === "currency") {
                totalRow[item.name] = 0
            } else if (item.type === "plot") {
                totalRow[item.name] = []
            }
        }

        for (let i = 0; i < this.props.data.length; i++) {
            const item = this.props.data[i];
            const key = this.store.getKeyFromIndex(i);
            if (!this.store.isChild(key)) {
                for (let j = 1; j < this.props.columns.length; j++) {
                    const colItem = this.props.columns[j];
                    if (!totalRow.hasOwnProperty(colItem.name)) {
                        continue
                    }
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
            }
        }

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

    handleToggleParent(index) {
        const key = this.store.getKeyFromIndex(index);
        this.store.toggleChildrenOfParentIndex(key)
    }

    handleSwitchTotal() {
        // update total
        this.setState({
            ['row-total']: {
                isOn: !this.state['row-total'].isOn
            }
        }, () => {
            this.store.toggleSwitchTotal(this.state['row-total'].isOn)
        });
    }

    handleSwitchParent(index) {
        // check if total and if total is ON
        if ((this.props.hasTotals && !this.state['row-total'].isOn)) {
            return false;
        }
        const key = this.store.getKeyFromIndex(index);
        // if switch is not parent, don't do nothing
        if (this.store.isChild(key)) {
            return false
        }

        this.store.toggleSwitchParent(key)
    }

    handleSwitchChildren(index) {
        const key = this.store.getKeyFromIndex(index);

        if (!this.store.isChild(key)) {
            return false
        }

        // check if parent is ON
        if (!this.store.getParentState(key).isOn) {
            return false;
        }

        this.store.toggleSwitchChildren(key)
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

        let tableRows = [];
        if (!this.store.isElementsMapEmpty()) {
            tableRows = this.props.data.map((data, i) => {
                // check if parent or child
                const isChild = data['child'] || false;
                const isParent = !isChild && this.props.hasParent;

                let trClassName = this.props.trClassName;
                if (isFun(this.props.trClassName)) {
                    trClassName = this.props.trClassName(data, i);
                }

                trClassName = classSet(trClassName, {
                    'child': isChild,
                    'parent': isParent
                });

                const selected = isSelectRowDefined && this.state.rowSelected == i;
                const key = this.store.getKeyFromIndex(i);
                const elementsState = this.state.elementsState[key];

                return (
                    <TableRow
                        key={ i }
                        _key={ i }
                        className={ trClassName }
                        columns={this.props.columns}
                        data={data}
                        isParent={isParent}
                        shouldHide={elementsState.shouldHide}
                        handleToggleParent={this.handleToggleParent.bind(this)}
                        isOn={elementsState.isOn}
                        handleSwitchParent={this.handleSwitchParent.bind(this)}
                        handleSwitchChildren={this.handleSwitchChildren.bind(this)}
                        onRowClick={ this.handleRowClick.bind(this) }
                        selected={selected}/>
                )
            });
        }

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
