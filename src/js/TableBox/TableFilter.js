/**
 * Created by freddyrondon on 4/19/16.
 */

import React, {Component, PropTypes} from 'react';
import classSet from 'classnames';


class TableFilter extends Component {

    constructor() {
        super();
        this.state = {
            showSearchClear: false
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.searchValue === ""){
            this.setState({
                showSearchClear: false
            })
        } else {
            this.setState({
                showSearchClear: true
            })
        }
    }

    handleClearSearchField() {
        this.props.handleClearSearchField()
    }

    handleBtnClick(evt) {
        this.props.handleBtnClick(evt.target.value);
    }

    updateSearchInput(evt) {
        this.props.handleUpdateSearchFilter(evt.target.value);
    }

    getFilterBtn() {
        if (this.props.btn.length > 0) {
            const btns = this.props.btn.map((item, i) => {
                return (
                    <label key={i} className="btn btn-default">
                        <input type="radio" name="options" autocomplete="off"
                               onChange={this.handleBtnClick.bind(this)} value={item}/> {item}
                    </label>
                )
            });

            return (
                <div className="btn-group btn-group-justified btn-group-xs" data-toggle="buttons">
                    { btns }
                </div>
            )
        }

        return ''
    }

    render() {
        const containerClasses = classSet('table-filter-wrapper', {
            'hidden': !this.props.hasFilter || this.props.hidden
        });

        const hasFilterBtn = this.props.btn.length > 0;
        const filterInputClass = classSet({
            'col-xs-12': !hasFilterBtn,
            'col-xs-8': hasFilterBtn
        });
        const filterBtnClass = classSet({
            'hidden': !hasFilterBtn,
            'col-xs-4': hasFilterBtn
        });

        const clearSearchFieldClass = classSet(
            'search-clear', 'glyphicon', 'glyphicon-remove-circle', {
            'hidden': !this.state.showSearchClear
        });

        const filterButtons = this.getFilterBtn();
        return (
            <div ref="container" className={containerClasses}>
                <div className="form-group form-group-sm">
                    <div className={filterInputClass}>
                        <input type="text" className="form-control" placeholder="filter" ref="search-input"
                               onChange={this.updateSearchInput.bind(this)} value={this.props.searchValue}/>
                        <span onClick={this.handleClearSearchField.bind(this)} className={clearSearchFieldClass}></span>
                    </div>
                    <div className={filterBtnClass}>
                        {filterButtons}
                    </div>
                </div>
            </div>
        )
    }

}

TableFilter.propTypes = {
    hasFilter: PropTypes.bool.isRequired
};

export default TableFilter;