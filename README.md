# request-speed.js
A JavaScript library that helps developers measure and track the performance of their web pages

This library's purpose is twofold. Used locally for development, it can help you assess how time is spent loading by your application among the different layers. Used on production sites, it helps gather the data necessary to develop and maintain lightning-fast websites and applications - that is, real-life statistics about the load times experienced by your users instead of having to rely on data approximated by various pagespeed services.

Request-speed.js relies on the browser's Navigation Timing API, so IE8 and lower are not supported. Support may be added later but reporting accuracy won't be the same.

## How it works

Implementing request-speed.js is quite flexible: just import the library into your project and create an instance of `RequestSpeed` with your desired config wherever you want in your page, it will wait for the appropriate time to report its results. Below you can find a list of configuration options and their defaults.

## Config

```

var config = {
	raw: false, // Used to determine if the results should contain all the timings or an aggregate report
	noConsole: false, // If set to true, no the results won't be displayed to the console. Useful for production
	reportUrl: false // False to skip sending remote report, or an URL string to the endpoint to send data to
};

```

## The report

The speed report contains different information depending on the value of `config.raw`. If a raw report is requested, the entire contents of `window.performance.timing` will be returned as provided by the browser. If not, request-speed.js creates a simplified list of loadtime data typically of interest to developers. This report contains the following:

### `report.requestTime`

The time the request was made. Useful for organising your data for later analysis.

### `report.firstByte`

The time to first byte, as measured from the value of `requestTime`. A high value indicates possible problems with your network or your application's HTTP layer.

### `report.domReady`

The time it takes for the DOM to become interactive, as measured from the value of `requestTime`. Useful to determine the responsiveness of your application.

### `report.loadTime`

The time it takes for all the contents of the document to be loaded, including scripts, styles, images and other assets, as measured from the value of `requestTime`. A high value may indicate that your application uses too many assets or assets that aren't optimised for speed.

## Full example

```

<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="path/to/request-speed.js"></script>
	</head>
	<body>
		// your content
		<script type="text/javascript">
			new RequestSpeed({
				raw: false,
				noConsole: true,
				reportUrl: 'http://endpoint.example.com'
			});
		</script>
	</body>
</html>

```