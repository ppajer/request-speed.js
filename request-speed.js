function RequestSpeed(config) {

	this.init = function(config) {
		if (typeof window.performance === 'undefined') {
			console.warn('The Navigation Timing API is not available in your browser, request-speed.js failed to initialize');
			return false;
		}

		this.reportUrl = config.reportUrl ? config.reportUrl : false;
		this.noConsole = config.noConsole ? config.noConsole : false;
		this.extraData = config.extraData ? config.extraData : false;
		this.raw = config.raw ? config.raw : false;

		this.waitForLoadEnd();
	}

	this.waitForLoadEnd = function() {
		if (document.readyState && document.readyState === 'complete') {
			this.measureSpeed.bind(this).call();
		} else {
			if (window.addEventListener) {
				window.addEventListener('load', this.measureSpeed.bind(this), true);
			} else {
				window.attachEvent('onload', this.measureSpeed.bind(this));
			}
		}
	}

	this.measureSpeed = function() {
		var raw = config.raw,
			timing = window.performance.timing,
			reportData = raw ? timing : this.createReport(timing);

		if (this.extraData) {
			reportData = this.mergeData([this.extraData, reportData]);
		}
		
		if (!config.noConsole) {
			console.log(reportData);
		}

		if (this.reportUrl) {
			this.reportToUrl(reportData);
		}
	}

	this.createReport = function(timing) {
		return {
			requestTime: timing.requestStart,
			firstByte: timing.domLoading - timing.requestStart,
			domReady: timing.domInteractive - timing.requestStart,
			loadTime: timing.domComplete - timing.requestStart
		};
	}

	this.mergeData = function(dataset) {
		var merge = {};
		for (var i = dataset.length - 1; i >= 0; i--) {
			for (var key in dataset[i]) {
				merge[key] = dataset[i][key];
			}
		}

		return merge;
	}

	this.reportUrl = function(data) {
		var XHR = this.XHR();

		XHR.open('POST', this.reportUrl, true);
		XHR.onReadyStateChange(function() {
			if ((XHR.readyState === 4) && !config.noConsole) {
				console.log('Data sent to url '+reportUrl);
			}
		});

		XHR.send(data);
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