'use strict';

const React = require('react');
const Canvas = require('./Canvas.js');
const qr = require('qr.js');

function renderCanvas(canvas) {
    let ctx = canvas.getContext('2d');
    let {size, fgColor, bgColor} = this;
    canvas.width = size;
    canvas.height = size;
    canvas.style.left = (window.innerWidth - size) / 2 + 'px';
    if(window.innerHeight > size) canvas.style.top = (window.innerHeight - size) / 2 + 'px';
    ctx.fillRect(0, 0, size, size);
    let cells = this.cells;
    let cellWidth = this.size / cells.length;
    let cellHeight = this.size / cells.length;
    let nRoundedWidth = Math.round(cellWidth);
    let nRoundedHeight = Math.round(cellHeight);
    cells.forEach(function(row, rowIndex) {
        row.forEach(function(column, columnIndex) {
            let nLeft = columnIndex * cellWidth;
            let nTop = rowIndex * cellHeight;
            ctx.fillStyle = ctx.strokeStyle = column ? bgColor : fgColor;
            ctx.lineWidth = 1;
            ctx.fillRect(nLeft, nTop, cellWidth, cellHeight);
            ctx.strokeRect(
                Math.floor(nLeft) + 0.5,
                Math.floor(nTop) + 0.5,
                nRoundedWidth,
                nRoundedHeight
            );
            ctx.strokeRect(
                Math.ceil(nLeft) - 0.5,
                Math.ceil(nTop) - 0.5,
                nRoundedWidth,
                nRoundedHeight
            );
        });
    });
}

module.exports = React.createClass({
    PropTypes: {
        value: React.PropTypes.string,
        size: React.PropTypes.number,
        bgColor: React.PropTypes.string,
        fgColor: React.PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            value: 'https://github.com/cssivision',
            fgColor: 'white',
            bgColor: 'black',
            size: 128,
        }
    },

    utf16to8: function(str) {
        let out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    },

    render: function() {
        let props = this.props;
        let code = this.utf16to8(props.value);
        return (
            <Canvas
                context={{cells: qr(code).modules}}
                render={renderCanvas}
                {...props}
            />
        );
    }
});
