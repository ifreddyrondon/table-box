/**
 * Created by freddyrondon on 4/17/16.
 */

import React, {Component, PropTypes} from 'react'
import {Sparklines, SparklinesLine, SparklinesSpots} from 'react-sparklines'
import ReactHighstock from 'react-highcharts'
import {Modal} from 'react-bootstrap'
import _ from 'lodash'
import Moment from 'moment'
import classSet from 'classnames'


class TableCell extends Component {

    constructor() {
        super();
        this.state = {
            showChartModal: false
        }
    }

    closeChartModal() {
        this.setState({showChartModal: false});
    }

    openChartModal() {
        this.setState({showChartModal: true});
    }

    changeChevron() {
        this.props.handleOpenCloseRow();
    }

    changeSwitch() {
        this.props.handleRowActivation();
    }

    /**
     *
     * @param value
     * @param decimals
     * @returns {number}
     */
    getFixedDecimals(value, decimals = 2) {
        value = +value;
        return Number(value.toFixed(decimals))
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    getNumberWithSeparators(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     *
     * @param value
     * @returns {string}
     */
    getOnlyDecimalPartFormat(value) {
        value = +value;
        return "." + (value + "").split(".")[1]
    }

    /**
     *
     * @param value
     * @returns {*}
     */
    getGreenOrRedNumbersFormat(value) {
        if (isNaN(value)) {
            return ''
        }
        if (!_.isInteger(value)) {
            value = this.getFixedDecimals(value);
        }
        const formattedValue = this.getNumberWithSeparators(value);
        const classes = classSet('fa', {
            'winning': value >= 0,
            'losing': value < 0
        });
        return <span className={classes}>{formattedValue}</span>
    }

    renderCellValue(value, type) {
        if (type === "number") {
            if (Number.isNaN(value) || value === undefined) {
                return ""
            }
            if (!_.isInteger(value)) {
                value = this.getFixedDecimals(value);
                if (value < 1 && value > 0) {
                    value = this.getOnlyDecimalPartFormat(value);
                }
            }
            return this.getNumberWithSeparators(value);
        }

        if (type === "date") {
            return Moment(value).format()
        }

        if (type === "currency") {
            if (Number.isNaN(value) || value === undefined) {
                return ""
            }
            if (!_.isInteger(value)) {
                value = this.getFixedDecimals(value);
                if (value < 1 && value > 0) {
                    value = this.getOnlyDecimalPartFormat(value);
                }
            }

            value = '<i class="fa fa-usd"></i>' + this.getNumberWithSeparators(value);
            return <div dangerouslySetInnerHTML={ { __html: value } }></div>
        }

        if (type === "p_l") {
            return this.getGreenOrRedNumbersFormat(value)
        }

        if (type === "switch") {
            const classes = classSet('fa', {
                'fa-toggle-on': this.props.isRowOn,
                'fa-toggle-off': !this.props.isRowOn
            });
            const classesLink = classSet('switch-link', {
                'on': this.props.isRowOn
            });
            return <a className={classesLink} onClick={this.changeSwitch.bind(this)}>
                <i className={classes}></i>
            </a>
        }

        if (type === "plot") {
            const config = {
                rangeSelector: {
                    selected: 1
                },
                title: {text: ''},
                yAxis: {
                    title: {text: ''}
                },
                plotOptions: {
                    line: {
                        animation: false
                    }
                },
                series: [{
                    name: 'AAPL',
                    data: value,
                    tooltip: {
                        valueDecimals: 2
                    },
                    showInLegend: false
                }]
            };

            return (
                <a onClick={this.openChartModal.bind(this)}>
                    <Sparklines data={value} width={100} height={20} limit={20}>
                        <SparklinesLine style={{ strokeWidth: 1, stroke: "#336aff", fill: "none" }}/>
                        <SparklinesSpots size={1} style={{ stroke: "#336aff", strokeWidth: 1, fill: "white" }}/>
                    </Sparklines>

                    <Modal show={this.state.showChartModal} onHide={this.closeChartModal.bind(this)} bsSize="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Plot</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ReactHighstock config={config}></ReactHighstock>
                        </Modal.Body>
                    </Modal>
                </a>
            )
        }

        if (this.props.renderOpenCloseSwitch) {
            const classes = classSet('fa', {
                'fa-chevron-down': this.props.isRowOpen,
                'fa-chevron-right': !this.props.isRowOpen
            });
            const classesLink = classSet('open-close-parent', {
                'open': this.props.isRowOpen
            });
            return (
                <a className={classesLink} onClick={this.changeChevron.bind(this)}>
                    <i className={classes}></i> {value}
                </a>
            )
        }

        return value
    }

    render() {
        const cellValue = this.renderCellValue(this.props.children, this.props.type);
        const tdStyle = {
            textAlign: this.props.dataAlign,
            display: this.props.hidden ? 'none' : null
        };

        return (
            <td style={ tdStyle } className={ this.props.className }>
                {cellValue}
            </td>
        );
    }
}

TableCell.propTypes = {
    dataAlign: PropTypes.string,
    hidden: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.string
};

TableCell.defaultProps = {
    dataAlign: 'left',
    hidden: false,
    className: ''
};

export default TableCell;