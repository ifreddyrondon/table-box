/**
 * Created by freddyrondon on 4/17/16.
 */

import React, {Component, PropTypes} from 'react';
import {Sparklines, SparklinesLine, SparklinesSpots} from 'react-sparklines';
import ReactHighstock from 'react-highcharts';
import {Modal} from 'react-bootstrap';
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

    renderCellValue(value, type) {
        if (type === "number" || type === "currency") {
            value = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
        if (type === "currency") {
            value = '<i class="fa fa-usd"></i>' + value;
            value = <div dangerouslySetInnerHTML={ { __html: value } }></div>
        }
        if (type === "p_l") {
            let classes = '';
            if (!isNaN(value)) {
                value = value.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                classes = classSet('fa', {
                    'winning': value >= 0,
                    'losing': value < 0
                });
                value = (value >= 0 ? '+' : '') + value;
            }
            value = <span className={classes}>{value}</span>;
        }
        if (type === "switch") {
            const classes = classSet('fa', {
                'fa-toggle-on': this.props.isRowOn,
                'fa-toggle-off': !this.props.isRowOn
            });
            const classesLink = classSet('switch-link', {
                'on': this.props.isRowOn
            });
            value = <a className={classesLink} onClick={this.changeSwitch.bind(this)}>
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

            value =
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
        }

        if (this.props.renderOpenCloseSwitch) {
            const classes = classSet('fa', {
                'fa-chevron-down': this.props.isRowOpen,
                'fa-chevron-right': !this.props.isRowOpen
            });
            const classesLink = classSet('open-close-parent', {
                'open': this.props.isRowOpen
            });
            value = <a className={classesLink} onClick={this.changeChevron.bind(this)}>
                <i className={classes}></i> {value}
            </a>
        }
        return value;
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