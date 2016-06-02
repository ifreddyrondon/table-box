/**
 * Created by freddyrondon on 4/15/16.
 */

import React, {Component, PropTypes} from 'react';
import classSet from 'classnames';

import Const from './Const'

class TableHeaderColumn extends Component {

    handleColumnClick() {
        if (!this.props.dataSort) return;
        const order = this.props.sort === Const.SORT_DESC ? Const.SORT_ASC : Const.SORT_DESC;
        this.props.onSort(order, this.props.dataField);
    }

    _renderReactSortCaret(order) {
        const orderClass = classSet('order', {
            'dropup': order === Const.SORT_ASC
        });
        return (
            <span className={ orderClass }>
                <span className='caret' style={ { margin: '0px 5px' } }></span>
            </span>
        );
    }

    render() {
        const thStyle = {
            textAlign: this.props.dataAlign,
            display: this.props.hidden ? 'none' : null
        };

        const defaultCaret = (!this.props.dataSort) ? null : (
            <span className='order'>
                <span className='dropdown'>
                    <span className='caret' style={ { margin: '10px 0 10px 5px', color: '#ccc' } }></span>
                </span>
                <span className='dropup'>
                    <span className='caret' style={ { margin: '10px 0', color: '#ccc' } }></span>
                </span>
            </span>
        );

        let sortCaret = this.props.sort ? this._renderReactSortCaret(this.props.sort) : defaultCaret;

        const classes = classSet(this.props.className, {
            'sort-column': this.props.dataSort
        });
        // if header has name printed
        const title = typeof this.props.children === 'string' ? {title: this.props.children} : null;

        return (
            <th ref='header-col'
                className={ classes }
                style={ thStyle }
                onClick={ this.handleColumnClick.bind(this) }
                { ...title }>
                { this.props.children }{ sortCaret }
            </th>
        )
    }
}

TableHeaderColumn.propTypes = {
    className: PropTypes.string,
    dataAlign: PropTypes.string,
    dataField: PropTypes.string,
    dataFormat: PropTypes.func,
    dataSort: PropTypes.bool,
    dataType: PropTypes.string,
    hidden: PropTypes.bool,
    isKey: PropTypes.bool,
    onSort: PropTypes.func,
    sort: PropTypes.string
};

TableHeaderColumn.defaultProps = {
    className: '',
    dataAlign: 'left',
    dataFormat: undefined,
    dataSort: false,
    dataType: 'string',
    hidden: false,
    isKey: false,
    onSort: undefined,
    sort: undefined
};

export default TableHeaderColumn