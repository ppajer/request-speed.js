function RequestSpeed(config) {

	this.init = function(config) {

		if (typeof window.performance === 'undefined') {
			console.warn('The Navigation Timing API is not available in your browser, request-speed.js failed to initialize');
			return false;
		}

		this.reportUrl = config.reportUrl ? config.reportUrl : false;
		this.noConsole = config.noConsole ? config.noConsole : false;
		this.raw = config.raw ? config.raw : false;

		this.waitForLoadEnd();
	}

	this.waitForLoadEnd = function() {
		console.log(document.readyState)
		if (document.readyState && document.readyState === 'complete') {
			this.measureSpeed.bind(this).call();
		} else {
			console.log('listener added')
			if (window.addEventListener) {
				window.addEventListener('load', this.measureSpeed.bind(this), true);
			} else {
				window.attachEvent('onload', this.measureSpeed.bind(this));
			}
		}
	}

	this.measureSpeed = function() {

		console.log('listener called')

		var raw = config.raw,
			timings = window.performance.timing;
		
		if (!config.noConsole) {
			console.log(raw ? timings : this.createReport(timings));
		}

		if (this.reportUrl) {
			this.reportToUrl(raw ? timings : this.createReport(timings));
		}
	}

	this.createReport = function(timing) {
		return {
			requestTime: timing.requestStart,
			firstByte: timing.domLoading - timing.requestStart,
			DomReady: timing.domInteractive - timing.requestStart,
			LoadTime: timing.domComplete - timing.requestStart
		};
	}

	this.reportUrl = function(data) {
		var XHR = this.XHR();

		XHR.open('POST', this.reportUrl, true);
		XHR.onReadyStateChange(function() {
			if ((XHR.readyState === 4) && !config.noConsole) {
				console.log('Data sent to url '+reportUrl);
			}
		});

	}

	this.XHR = function() {
		if (!window.XMLHttpRequest) {
			console.warn('XMLHttpRequest is not supported, request-speed.js unable to send data to remote URL.');
			return false;
		} else {
			return new XMLHttpRequest();
		}
	}

	this.init(config);
}