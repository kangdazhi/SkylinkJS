/**
 * HTTP Utils.
 * @constructor
 * @since 0.6.x
 */
var HTTP = {

    /**
     * It executes a post request.
     *
     * @method doPost
     * @since 0.6.x
     */
    doPost: function(url, params, successCb, errorCb) {
        this._doHttpRequest('POST', url, params, successCb, errorCb);
    },

    /**
     * It executes an HTTP request call.
     *
     * @method _doHttpRequest
     * @private
     * @since 0.6.x
     * @param {String} method POST/GET/etc
     * @param {String} url Example: /api/stats
     * @param {JSON} params Any object to be sent in the request as parameter
     * @param {Function} successCb Function to be executed when the request succeed
     * @param {Function} errorCb Function to be executed when there is an error in the request
     */
    _doHttpRequest: function(method, url, params, successCb, errorCb) {
        this.http.onabort = this.http.onerror = function(error) {
            console.log([null, 'XMLHttpRequest', 'Failed XMLHttpRequest.'], error);

            if(errorCb === 'function')
                errorCb(error);
        };

        this.http.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log("Statistics posted.", this.responseText);

                if(successCb === 'function')
                    successCb(this.responseText);
            }
        };

        this.http.open(method, url, true);
        this.http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

        try {
            var statistic = JSON.stringify(params);
            console.log('Sending statistics', statistic);
            this.http.send(statistic);
        } catch(e) {
            console.log([null, 'XMLHttpRequest', method, 'Failed XMLHttpRequest.'], e);
        }
    },

    /**
     * It creates the XMLHttpRequest or XDomainRequest object.
     *
     * @method _createXMLHttpRequest
     * @private
     * @since 0.6.x
     * @return {Boolean}
     */
    _createXMLHttpRequest: function() {
        if(this._isXDomainRequestSupported())
            return this._createXDomainRequest();
        else
            return new XMLHttpRequest();
    },

    /**
     * It checks if XDomainRequest is supported in IE8 - 9 for CORS connection.
     *
     * @method _isXDomainRequestSupported
     * @private
     * @since 0.6.x
     * @return {Boolean}
     */
    _isXDomainRequestSupported: function() {
        return typeof window.XDomainRequest === 'function' || typeof window.XDomainRequest === 'object';
    },

    /**
     * It creates the XDomainRequest object.
     *
     * @method _createXDomainRequest
     * @private
     * @since 0.6.x
     * @return {Boolean}
     */
    _createXDomainRequest: function() {
        console.log('Creating XDomainRequest.');

        var xDomainRequest = new XDomainRequest();
        xDomainRequest.setContentType = function (contentType) {
            xDomainRequest.contentType = contentType;
        };

        return xDomainRequest;
    }

};
