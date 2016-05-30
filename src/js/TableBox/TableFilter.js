/**
 * Created by freddyrondon on 4/19/16.
 */

import React, {Component, PropTypes} from 'react';
import classSet from 'classnames';


class TableFilter extends Component {

    constructor() {
        super();
    }

    handleClearBtnClick() {
        this.refs.seachInput.value = '';
        this.props.onSearch('');
    }

    handleKeyUp() {
        this.props.onSearch(this.refs.seachInput.value);
    }

    handleBtnClick(evt) {
        this.refs.seachInput.value = evt.target.value;
        this.props.onSearch(evt.target.value);
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

    _renderClearBtn(){
        if (this.refs.seachInput && this.refs.seachInput.value !== ""){
            return true
        }
        return false
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
                'hidden': !this._renderClearBtn()
            });

        const clearBtn = (
            <span onClick={this.handleClearBtnClick.bind(this)} className={clearSearchFieldClass}></span>
        );

        const filterButtons = this.getFilterBtn();
        return (
            <div ref="container" className={containerClasses}>
                <div className="form-group form-group-sm">
                    <div className={filterInputClass}>
                        <input ref="seachInput"
                               type="text"
                               className="form-control"
                               placeholder={ this.props.searchPlaceholder ? this.props.searchPlaceholder : 'Search' }
                               onKeyUp={ this.handleKeyUp.bind(this) }/>
                        {clearBtn}
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