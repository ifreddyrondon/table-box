/**
 * Created by freddyrondon on 5/18/16.
 */

import React, {Component, PropTypes} from 'react'
import {DropdownButton, MenuItem} from 'react-bootstrap'

import Const from './../Const'
import PageButton from './PageButton.js'


class PaginationList extends Component {

    constructor() {
        super();
    }

    changePage(page) {
        const {prePage, currPage, nextPage, lastPage, firstPage, sizePerPage} = this.props;
        if (page === prePage) {
            page = currPage - 1 < 1 ? 1 : currPage - 1;
        } else if (page === nextPage) {
            page = currPage + 1 > this.totalPages ? this.totalPages : currPage + 1;
        } else if (page === lastPage) {
            page = this.totalPages;
        } else if (page === firstPage) {
            page = 1;
        } else {
            page = parseInt(page, 10);
        }

        if (page !== currPage) {
            this.props.changePage(page, sizePerPage);
        }
    }

    changeSizePerPage(evt) {
        evt.preventDefault();

        const selectSize = parseInt(evt.currentTarget.text, 10);
        let {currPage} = this.props;
        if (selectSize !== this.props.sizePerPage) {
            this.totalPages = Math.ceil(this.props.dataSize / selectSize);
            if (currPage > this.totalPages) currPage = this.totalPages;

            this.props.changePage(currPage, selectSize);
            if (this.props.onSizePerPageList) {
                this.props.onSizePerPageList(selectSize);
            }
        }
    }

    render() {
        const {dataSize, sizePerPage, sizePerPageList} = this.props;
        this.totalPages = Math.ceil(dataSize / sizePerPage);
        const pageButtons = this.makePage();

        const pageListStyle = {
            float: 'right',
            // override the margin-top defined in .pagination class in bootstrap.
            marginTop: '0px'
        };

        let paginationWrapper;
        if (sizePerPageList.length > 1) {
            const sizePerPageOptions = sizePerPageList.map((_sizePerPage) => {
                return (
                    <MenuItem key={_sizePerPage} eventKey={ _sizePerPage }
                              onClick={ this.changeSizePerPage.bind(this) }>{ _sizePerPage }</MenuItem>
                );
            });

            paginationWrapper = (
                <div>
                    <div className='col-md-6'>
                        <DropdownButton id="pagination-size" bsSize="xsmall" title={ sizePerPage } dropup>
                            { sizePerPageOptions }
                        </DropdownButton>
                    </div>
                    <div className='col-md-6'>
                        <ul className='pagination pagination-xs' style={ pageListStyle }>
                            { pageButtons }
                        </ul>
                    </div>
                </div>
            )
        } else {
            paginationWrapper = (
                <div className='col-md-12'>
                    <ul className='pagination pagination-xs' style={ pageListStyle }>
                        { pageButtons }
                    </ul>
                </div>
            )
        }

        return (
            <div className='row'>
                {paginationWrapper}
            </div>
        )
    }

    makePage() {
        const pages = this.getPages();
        return pages.map(function (page) {
            const isActive = page === this.props.currPage;
            let disabled = false;
            let hidden = false;
            if (this.props.currPage === 1 &&
                (page === this.props.firstPage || page === this.props.prePage)) {
                disabled = true;
                hidden = true;
            }
            if (this.props.currPage === this.totalPages &&
                (page === this.props.nextPage || page === this.props.lastPage)) {
                disabled = true;
                hidden = true;
            }
            return (
                <PageButton key={ page }
                            changePage={ this.changePage.bind(this) }
                            active={ isActive }
                            disable={ disabled }
                            hidden={ hidden }>
                    { page }
                </PageButton>
            );
        }, this);
    }

    getPages() {
        let pages;

        let startPage = Math.max(this.props.currPage - Math.floor(this.props.paginationSize / 2), 1);
        let endPage = startPage + this.props.paginationSize - 1;

        if (endPage > this.totalPages) {
            endPage = this.totalPages;
            startPage = endPage - this.props.paginationSize + 1;
        }

        if (startPage !== 1 && this.totalPages > this.props.paginationSize) {
            pages = [this.props.firstPage, this.props.prePage];
        } else if (this.totalPages > 1) {
            pages = [this.props.prePage];
        } else {
            pages = [];
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i > 0) pages.push(i);
        }

        if (endPage !== this.totalPages) {
            pages.push(this.props.nextPage);
            pages.push(this.props.lastPage);
        } else if (this.totalPages > 1) {
            pages.push(this.props.nextPage);
        }
        return pages;
    }
}

PaginationList.propTypes = {
    changePage: PropTypes.func,
    currPage: PropTypes.number,
    dataSize: PropTypes.number,
    onSizePerPageList: PropTypes.func,
    paginationSize: PropTypes.number,
    prePage: PropTypes.string,
    sizePerPage: PropTypes.number,
    sizePerPageList: PropTypes.array
};

PaginationList.defaultProps = {
    sizePerPage: Const.SIZE_PER_PAGE
};

export default PaginationList;
