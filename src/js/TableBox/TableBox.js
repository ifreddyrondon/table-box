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
            searchValue: this.props.searchValue,
            currPage: this.props.options.page || 1,
            sizePerPage: this.props.options.sizePerPage || Const.SIZE_PER_PAGE_LIST[0]
        };

        this.getData = this.getData.bind(this);
    }

    initTable(props){
        this.store.setProps({
            isPagination: props.pagination
        });
    }

    getTableData() {
        let result = [];
        const { options, pagination } = this.props;
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

    componentWillReceiveProps(nextProps){
        this.initTable(nextProps);
        const { options } = nextProps;

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
            searchValue: nextProps.searchValue,
            currPage: page,
            sizePerPage
        });
    }

    getData(){
        this.setState({
            data: this.getTableData()
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

    handlePaginationData(page, sizePerPage) {
        const { onPageChange } = this.props.options;
        if (onPageChange) {
            onPageChange(page, sizePerPage);
        }

        const result = this.store.page(page, sizePerPage).get();
        this.setState({
            data: result,
            currPage: page,
            sizePerPage
        });
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

    renderPagination(){
        if (this.props.pagination && this.state.data.length > 0) {
            const dataSize = this.store.getDataNum();
            const { options } = this.props;
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
                        sizePerPageList={ options.sizePerPageList || Const.SIZE_PER_PAGE_LIST } />
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
    height: PropTypes.string,
    hover: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    maxHeight: PropTypes.string,
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onCollapse: PropTypes.func,
    options: PropTypes.shape({
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
    height: '100%',
    hover: false,
    isCollapsed: false,
    maxHeight: undefined,
    noDataText: undefined,
    onCollapse: undefined,
    options: {
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
        onRowClick: undefined
    },
    striped: false,
    title: ''
};

export default TableBox