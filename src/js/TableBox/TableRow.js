/**
 * Created by freddyrondon on 4/17/16.
 */

import React, { Component, PropTypes } from 'react';
import classSet from 'classnames'

import TableCell from './TableCell'
import Const from "./Const";

const isFun = function(obj) {
    return obj && (typeof obj === 'function');
};

class TableRow extends Component {

    constructor(){
        super();
    }

    componentWillMount() {
        this.setState({
            isRowOpen: this.props.shouldHide,
            isRowOn: this.props.isOn
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isRowOn: nextProps.isOn
        });
    }

    handleOpenCloseRow(){
        this.props.handleToggleParent(this.props._key);
        this.setState({
            isRowOpen: !this.state.isRowOpen
        });
    }

    handleRowActivation() {
        if(this.props.isParent){
            this.props.handleSwitchParent(this.props._key);
        } else {
            this.props.handleSwitchChildren(this.props._key);
        }

    }

    rowClick(){
        if (this.props.onRowClick){
            this.props.onRowClick(this.props._key);
        }
    }

    render() {
        const cells = this.props.columns.map(function (cell, i) {
            const fieldValue = this.props.data[cell.name];
            let columnChild = fieldValue;
            let tdClassName = cell.className;
            if (isFun(cell.className)) {
                tdClassName = cell.className(fieldValue, cell, r, i);
            }

            if (typeof cell.format !== 'undefined') {
                const formattedValue = cell.format(fieldValue, cell);
                if (!React.isValidElement(formattedValue)) {
                    columnChild = (
                        <div dangerouslySetInnerHTML={ { __html: formattedValue } }></div>
                    );
                } else {
                    columnChild = formattedValue;
                }
            }

            return (
                <TableCell
                    key={ i }
                    dataAlign={ cell.align }
                    className={ tdClassName }
                    hidden={ cell.hidden }
                    type={ cell.type }
                    isRowOpen={this.state.isRowOpen}
                    handleOpenCloseRow={this.handleOpenCloseRow.bind(this)}
                    isRowOn={this.state.isRowOn}
                    handleRowActivation={this.handleRowActivation.bind(this)}
                    renderOpenCloseSwitch={i==0 && this.props.isParent ? true : false}>
                    { columnChild }
                </TableCell>
            );
        }, this);

        const classes = classSet(this.props.className, {
            'hidden': this.props.shouldHide,
            [Const.ROW_SELECT_CLASS_NAME]: this.props.selected
        });

        return (
            <tr className={classes} onClick={ this.rowClick.bind(this) }>
                { cells }
            </tr>
        );
    }
}

TableRow.propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array,
    data: PropTypes.object,
    isParent: PropTypes.bool,
    onRowClick: PropTypes.func
};

TableRow.defaultProps = {
    className: '',
    isParent: false,
    onRowClick: undefined
};

export default TableRow;