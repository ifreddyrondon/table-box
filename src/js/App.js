/**
 * Created by freddyrondon on 4/8/16.
 */

import React from 'react'
import ReactDOM from 'react-dom';

import TableBox from './TableBox/TableBox'
import TableHeaderColumn from './TableBox/TableHeaderColumn'

import './../css/bootstrap.css';
import './../css/font-awesome.css';
import './../css/base.css';


const generateRandomNumber = function () {
    return Math.round(Math.random() * 100);
};

const generatePlotData = function () {
    let data = [];
    for (let i = 0; i < 30; i++) {
        data.push(generateRandomNumber())
    }
    return data;
};

const accountsData = [
    {
        id: 0,
        account: 'US Equity',
        p_l: generateRandomNumber() * -1,
        gmv: generateRandomNumber() * 10,
        nmv: generateRandomNumber(),
        shares: generateRandomNumber() * 100000,
        notional: generateRandomNumber() * 100,
        plot: generatePlotData()
    },
    {
        id: 1,
        child: true,
        account: 'US Equity A',
        p_l: generateRandomNumber() * -1,
        gmv: generateRandomNumber() * 10,
        nmv: generateRandomNumber(),
        shares: generateRandomNumber() * 100000,
        notional: generateRandomNumber() * 100,
        plot: generatePlotData()
    },
    {
        id: 2,
        child: true,
        account: 'US Equity B',
        p_l: generateRandomNumber(),
        gmv: generateRandomNumber() * 10,
        nmv: generateRandomNumber(),
        shares: generateRandomNumber() * 100000,
        notional: generateRandomNumber() * 100,
        plot: generatePlotData()
    },
    {
        id: 3,
        account: 'Canada Equity',
        p_l: generateRandomNumber(),
        gmv: generateRandomNumber() * 10,
        nmv: generateRandomNumber(),
        shares: generateRandomNumber() * 100000,
        notional: generateRandomNumber() * 100,
        plot: generatePlotData()
    },
    {
        id: 4,
        child: true,
        account: 'Canada Equity A',
        p_l: generateRandomNumber(),
        gmv: generateRandomNumber() * 10,
        nmv: generateRandomNumber(),
        shares: generateRandomNumber() * 100000,
        notional: generateRandomNumber() * 100,
        plot: generatePlotData()
    },
    {
        id: 5,
        child: true,
        account: 'Canada Equity B',
        p_l: generateRandomNumber(),
        gmv: generateRandomNumber() * 10,
        nmv: generateRandomNumber(),
        shares: generateRandomNumber() * 100000,
        notional: generateRandomNumber() * 100,
        plot: generatePlotData()
    }
];

const ordersData = [
    {
        timer: `3:46.10pm`,
        ticker: 'GOOG',
        open_qty: 3103,
        side: 101.34,
        col5: generateRandomNumber(),
        col6: generateRandomNumber(),
        col7: generateRandomNumber(),
        col8: generateRandomNumber(),
        col9: generateRandomNumber(),
        col10: generateRandomNumber(),
        col11: generateRandomNumber(),
        col12: generateRandomNumber()
    },
    {
        timer: '3:46.50pm',
        ticker: 'YHOO',
        open_qty: 2222,
        side: 54.33,
        col5: generateRandomNumber(),
        col6: generateRandomNumber(),
        col7: generateRandomNumber(),
        col8: generateRandomNumber(),
        col9: generateRandomNumber(),
        col10: generateRandomNumber(),
        col11: generateRandomNumber(),
        col12: generateRandomNumber()
    },
    {
        timer: '3:47.08pm',
        ticker: 'AAPL',
        open_qty: 2222,
        side: 54.33,
        col5: generateRandomNumber(),
        col6: generateRandomNumber(),
        col7: generateRandomNumber(),
        col8: generateRandomNumber(),
        col9: generateRandomNumber(),
        col10: generateRandomNumber(),
        col11: generateRandomNumber(),
        col12: generateRandomNumber()
    }
];

export class App extends React.Component {

    changeStrategy() {

    }

    render() {
        const accountsSelectRow = {
            selected: 0,
            onRowClick: this.changeStrategy.bind(this)
        };

        return (
            <div className="col-lg-12">
                <h2>Table box example</h2>
                <TableBox data={accountsData} hover={true} bordered={false} condensed={true}
                          hasParent={true} hasTotals={true} selectRow={accountsSelectRow}>
                    <TableHeaderColumn dataField="account">ACCOUNT</TableHeaderColumn>
                    <TableHeaderColumn dataField="p_l" dataType="p_l">P/L</TableHeaderColumn>
                    <TableHeaderColumn dataField="gmv" dataType="currency">GMV</TableHeaderColumn>
                    <TableHeaderColumn dataField="nmv" dataType="number">NMV</TableHeaderColumn>
                    <TableHeaderColumn dataField="shares" dataType="number">SHARES</TableHeaderColumn>
                    <TableHeaderColumn dataField="notional"
                                       dataType="number">NOTIONAL</TableHeaderColumn>
                    <TableHeaderColumn dataField="action" dataAlign="center"
                                       dataType="switch">ACTION</TableHeaderColumn>
                    <TableHeaderColumn dataField="plot" dataAlign="center"
                                       dataType="plot">PLOT</TableHeaderColumn>
                </TableBox>

                <TableBox title="ORDERS" data={ordersData} hover={true} bordered={false}
                          condensed={true} filter={true} renderMaximize={false}>
                    <TableHeaderColumn dataField="timer">Timer</TableHeaderColumn>
                    <TableHeaderColumn dataField="ticker">Ticker</TableHeaderColumn>
                    <TableHeaderColumn dataField="open_qty" dataType="number">Open Qty</TableHeaderColumn>
                    <TableHeaderColumn dataField="side" dataType="number">Side</TableHeaderColumn>
                    <TableHeaderColumn dataField="col5" dataType="number">col5</TableHeaderColumn>
                    <TableHeaderColumn dataField="col6" dataType="number">col6</TableHeaderColumn>
                    <TableHeaderColumn dataField="col7" dataType="number">col7</TableHeaderColumn>
                    <TableHeaderColumn dataField="col8" dataType="number">col8</TableHeaderColumn>
                    <TableHeaderColumn dataField="col9" dataType="number">col9</TableHeaderColumn>
                    <TableHeaderColumn dataField="col10" dataType="number">col10</TableHeaderColumn>
                    <TableHeaderColumn dataField="col11" dataType="number">col11</TableHeaderColumn>
                    <TableHeaderColumn dataField="col12" dataType="number">col12</TableHeaderColumn>
                </TableBox>
            </div>
        );
    }
}

const app = document.getElementById("app");

ReactDOM.render(<App/>, app);