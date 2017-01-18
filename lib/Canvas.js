'use strict';

var React = require('react');
var {
    WebView
} = require('react-native');

var Canvas = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        context: React.PropTypes.object,
        render: React.PropTypes.func.isRequired
    },

    render() {
        let props = this.props;
        var contextString = JSON.stringify(props.context);
        var renderString = props.render.toString();
        return (
            <WebView
                automaticallyAdjustContentInsets={false}
                contentInset={{top: 0, right: 0, bottom: 0, left: 0}}
                source={{html: "<style>*{margin:0;padding:0;}canvas{transform:translateZ(0);}</style><canvas></canvas><script>var canvas = document.querySelector('canvas');(" + renderString + ").call(" + contextString + ", canvas);</script>"}}
                opaque={false}
                underlayColor={'transparent'}
                javaScriptEnabled={true}
                scrollEnabled={false}
                {...props}
            />
        );
    }
});

module.exports = Canvas;
