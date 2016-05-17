/**
 * Created by freddyrondon on 4/15/16.
 */

import React, {Component, PropTypes} from 'react';

import './../../css/table-box.css';

import TableDataStore from './store/TableDataStore'
import TableBody from './TableBody'
import TableFilter from './TableFilter'
import TableHeader from './TableHeader'

class TableBox extends Component {

    constructor(props) {
        super(props);
        this.store = new TableDataStore(this.props.data);
        this.state = {
            data: this.store.getAll(),
            isCollapsed: this.props.isCollapsed,
            searchValue: this.props.searchValue
        };

        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        this.store.on("change", this.getData);
    }

    componentWillUnmount() {
        this.store.removeListener("change", this.getData);
    }

    getData(){
        this.setState({
            data: this.store.getAll()
        })
    }

    componentWillReceiveProps(nextProps){
        this.store.setData(nextProps.data);
        this.setState({
            isCollapsed: nextProps.isCollapsed,
            searchValue: nextProps.searchValue
        })
    }

    collapseBody() {
        if (this.props.onCollapse){
            this.props.onCollapse()
        } else {
            this.setState({
                isCollapsed: !this.state.isCollapsed
            })
        }
    }

    handleMaximizeTable() {
        this.props.onMaximize()
    }

    handleUpdateSearchFilter(value) {
        this.setState({
            searchValue: value
        })
    }

    handleClearSearchField() {
        this.setState({
            searchValue: ""
        })
    }

    handleRowClick(row){
        if (this.props.selectRow.onRowClick) {
            this.props.selectRow.onRowClick(row);
        }
    }

    getColumnsDescription({children}) {
        return React.Children.map(children, (column, i) => {
            return {
                align: column.props.dataAlign,
                format: column.props.dataFormat,
                hidden: column.props.hidden,
                index: i,
                name: column.props.dataField,
                text: column.props.children,
                type: column.props.dataType
            };
        });
    }

    render() {
        const columns = this.getColumnsDescription(this.props);
        const style = {
            height: this.props.height,
            maxHeight: this.props.maxHeight
        };

        return (
            <div className="table-box">
                <TableHeader
                    title={ this.props.title }
                    handleCollapse={this.collapseBody.bind(this)}
                    handleMaximizeTable={this.handleMaximizeTable.bind(this)}
                    isCollapsed={this.state.isCollapsed}
                    renderCollapse={this.props.renderCollapse}
                    renderMaximize={this.props.renderMaximize}/>
                <TableFilter
                    btn={this.props.filterBtn}
                    handleUpdateSearchFilter={this.handleUpdateSearchFilter.bind(this)}
                    handleBtnClick={this.handleUpdateSearchFilter.bind(this)}
                    handleClearSearchField={this.handleClearSearchField.bind(this)}
                    hasFilter={this.props.filter}
                    hidden={this.state.isCollapsed}
                    searchValue={this.state.searchValue}/>
                <TableBody
                    bordered={ this.props.bordered }
                    columns={ columns }
                    condensed={ this.props.condensed }
                    data={ this.state.data }
                    hasFilter={this.props.filter}
                    hasParent={ this.props.hasParent }
                    hasTotals={ this.props.hasTotals }
                    hidden={this.state.isCollapsed}
                    hover={ this.props.hover }
                    noDataText={ this.props.noDataText }
                    onRowClick={ this.handleRowClick.bind(this) }
                    searchValue={this.state.searchValue}
                    selectRow={ this.props.selectRow }
                    striped={ this.props.striped }
                    style={ style }>
                    { this.props.children }
                </TableBody>
            </div>
        )
    }
}

TableBox.propTypes = {
    bordered: PropTypes.bool,
    condensed: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    filter: PropTypes.bool,
    filterBtn: PropTypes.array,
    hasParent: PropTypes.bool,
    hasTotals: PropTypes.bool,
    height: PropTypes.string,
    hover: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maxHeight: PropTypes.string,
    renderCollapse: PropTypes.bool,
    renderMaximize: PropTypes.bool,
    searchValue: PropTypes.string,
    selectRow: PropTypes.shape({
        selected: PropTypes.number,
        onRowClick: PropTypes.func
    }),
    striped: PropTypes.bool,
    title: PropTypes.string
};

TableBox.defaultProps = {
    bordered: true,
    condensed: false,
    filter: false,
    filterBtn: [],
    hasParent: false,
    hasTotals: false,
    height: '100%',
    hover: false,
    isCollapsed: false,
    onCollapse: undefined,
    noDataText: undefined,
    maxHeight: undefined,
    renderCollapse: true,
    renderMaximize: true,
    searchValue: "",
    selectRow: {
        onRowClick: undefined
    },
    striped: false,
    title: ''
};

export default TableBox