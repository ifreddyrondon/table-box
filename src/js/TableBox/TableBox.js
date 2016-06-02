/**
 * Created by freddyrondon on 4/15/16.
 */

import React, {Component, PropTypes} from 'react';

import './../../css/table-box.css';

import Const from './Const'
import TableDataStore from './store/TableDataStore'
import TableBody from './TableBody'
import TableFilter from './TableFilter'
import TableHeader from './TableHeader'
import PaginationList from './pagination/PaginationList'

class TableBox extends Component {

    constructor(props) {
        super(props);
        this.store = new TableDataStore(this.props.data.slice());

        this.initTable(this.props);

        this.state = {
            data: this.getTableData(),
            isCollapsed: this.props.isCollapsed,
            currPage: this.props.options.page || 1,
            sizePerPage: this.props.options.sizePerPage || Const.SIZE_PER_PAGE_LIST[0]
        };

        this.getData = this.getData.bind(this);
    }

    initTable(props) {
        let keyField = null;
        React.Children.forEach(props.children, column => {
            if (column.props.isKey) {
                if (keyField) {
                    throw 'Error. Multiple key column be detected in TableHeaderColumn.';
                }
                keyField = column.props.dataField;
            }
        });

        const colInfos = this.getColumnsDescription(props).reduce(( prev, curr ) => {
            prev[curr.name] = curr;
            return prev;
        }, {});

        if (!keyField) {
            throw `Error. No any key column defined in TableHeaderColumn.
            Use 'isKey={true}' to specify a unique column`;
        }

        this.store.setProps({
            colInfos: colInfos,
            hasParent: props.hasParent,
            isPagination: props.pagination,
            keyField: keyField
        });
    }

    getTableData() {
        let result = [];
        const {options, pagination} = this.props;
        if (pagination) {
            let page;
            let sizePerPage;
            if (this.store.isChangedPage()) {
                sizePerPage = this.state.sizePerPage;
                page = this.state.currPage;
            } else {
                sizePerPage = options.sizePerPage || Const.SIZE_PER_PAGE_LIST[0];
                page = options.page || 1;
            }
            result = this.store.page(page, sizePerPage).get();
        } else {
            result = this.store.get();
        }
        return result;
    }

    componentWillMount() {
        this.store.on("change", this.getData);
    }

    componentWillUnmount() {
        this.store.removeListener("change", this.getData);
    }

    componentWillReceiveProps(nextProps) {
        this.initTable(nextProps);
        const {options} = nextProps;

        this.store.setData(nextProps.data.slice());
        let page = options.page || this.state.currPage;
        const sizePerPage = options.sizePerPage || this.state.sizePerPage;

        if (!options.page &&
            page >= Math.ceil(nextProps.data.length / sizePerPage)) {
            page = 1;
        }

        const data = this.store.page(page, sizePerPage).get();
        this.setState({
            data,
            isCollapsed: nextProps.isCollapsed,
            currPage: page,
            sizePerPage
        });
    }

    getData() {
        this.setState({
            data: this.getTableData()
        })
    }

    collapseBody() {
        if (this.props.onCollapse) {
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

    handleSearch(searchText) {
        this.store.search(searchText);
        let result;
        if (this.props.pagination) {
            const {sizePerPage} = this.state;
            result = this.store.page(1, sizePerPage).get();

            const {onPageChange} = this.props.options;
            if (onPageChange) {
                onPageChange(1, sizePerPage);
            }

        } else {
            result = this.store.get();
        }
        if (this.props.options.afterSearch) {
            this.props.options.afterSearch(searchText,
                this.store.getDataIgnoringPagination());
        }
        this.setState({
            data: result,
            currPage: 1
        });
    }

    handleRowClick(row) {
        if (this.props.selectRow.onRowClick) {
            this.props.selectRow.onRowClick(row);
        }
    }

    handleTotalRowClick() {
        if (this.props.selectRow.onTotalRowClick) {
            this.props.selectRow.onTotalRowClick();
        }
    }

    handlePaginationData(page, sizePerPage) {
        const {onPageChange} = this.props.options;
        if (onPageChange) {
            onPageChange(page, sizePerPage);
        } else {
            const result = this.store.page(page, sizePerPage).get();
            this.setState({
                data: result,
                currPage: page,
                sizePerPage
            });
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

    renderPagination() {
        const {options} = this.props;
        const sizePerPageList = options.sizePerPageList || Const.SIZE_PER_PAGE_LIST;
        const dataSize = this.store.getDataNum();
        if (this.props.pagination && dataSize > sizePerPageList[0]) {
            return (
                <div className='table-pagination-wrapper'>
                    <PaginationList
                        ref='pagination'
                        changePage={ this.handlePaginationData.bind(this) }
                        currPage={ this.state.currPage }
                        dataSize={ dataSize }
                        firstPage={ options.firstPage || Const.FIRST_PAGE }
                        lastPage={ options.lastPage || Const.LAST_PAGE }
                        nextPage={ options.nextPage || Const.NEXT_PAGE}
                        onSizePerPageList={ options.onSizePerPageList }
                        paginationSize={ options.paginationSize || Const.PAGINATION_SIZE }
                        prePage={ options.prePage || Const.PRE_PAGE }
                        sizePerPage={ this.state.sizePerPage }
                        sizePerPageList={ sizePerPageList }/>
                </div>
            );
        }

        return null;
    }

    render() {
        const columns = this.getColumnsDescription(this.props);
        const pagination = this.renderPagination();
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
                    onSearch={this.handleSearch.bind(this)}
                    hasFilter={this.props.filter}
                    hidden={this.state.isCollapsed}/>
                <TableBody
                    bordered={ this.props.bordered }
                    columns={ columns }
                    condensed={ this.props.condensed }
                    data={ this.state.data }
                    hasParent={ this.props.hasParent }
                    hasTotals={ this.props.hasTotals }
                    hasTotalsOptions={ this.props.hasTotalsOptions }
                    hidden={this.state.isCollapsed}
                    hover={ this.props.hover }
                    noDataText={ this.props.noDataText }
                    onRowClick={ this.handleRowClick.bind(this) }
                    onTotalRowClick={ this.handleTotalRowClick.bind(this) }
                    store={ this.store }
                    selectRow={ this.props.selectRow }
                    striped={ this.props.striped }
                    style={ style }>
                    { this.props.children }
                </TableBody>
                { pagination }
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
    hasTotalsOptions: PropTypes.shape({
        underline: PropTypes.bool
    }),
    height: PropTypes.string,
    hover: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    maxHeight: PropTypes.string,
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onCollapse: PropTypes.func,
    options: PropTypes.shape({
        afterSearch: PropTypes.func,
        firstPage: PropTypes.string,
        lastPage: PropTypes.string,
        nextPage: PropTypes.string,
        onPageChange: PropTypes.func,
        onSizePerPageList: PropTypes.func,
        page: PropTypes.number,
        paginationSize: PropTypes.number,
        prePage: PropTypes.string,
        sizePerPage: PropTypes.number,
        sizePerPageList: PropTypes.array
    }),
    pagination: PropTypes.bool,
    renderCollapse: PropTypes.bool,
    renderMaximize: PropTypes.bool,
    searchValue: PropTypes.string,
    selectRow: PropTypes.shape({
        onRowClick: PropTypes.func,
        onTotalRowClick: PropTypes.func,
        selected: PropTypes.number
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
    hasTotalsOptions: {
        underline: false
    },
    height: '100%',
    hover: false,
    isCollapsed: false,
    maxHeight: undefined,
    noDataText: undefined,
    onCollapse: undefined,
    options: {
        afterSearch: undefined,
        firstPage: Const.FIRST_PAGE,
        lastPage: Const.LAST_PAGE,
        nextPage: Const.NEXT_PAGE,
        onPageChange: undefined,
        onSizePerPageList: undefined,
        page: undefined,
        paginationSize: Const.PAGINATION_SIZE,
        prePage: Const.PRE_PAGE,
        sizePerPage: undefined,
        sizePerPageList: Const.SIZE_PER_PAGE_LIST
    },
    pagination: false,
    renderCollapse: true,
    renderMaximize: true,
    searchValue: "",
    selectRow: {
        onRowClick: undefined,
        onTotalRowClick: undefined
    },
    striped: false,
    title: ''
};

export default TableBox