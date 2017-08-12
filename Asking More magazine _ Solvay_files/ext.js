/****************************************************
     Author: Brian J Clifton
     Url: http://www.advanced-web-metrics.com/scripts
     This script is free to use as long as this info is left in
     
     Combined script for tracking external links, file downloads and mailto links
     
     All scripts presented have been tested and validated by the author and are believed to be correct
     as of the date of publication or posting. The Google Analytics software on which they depend is 
     subject to change, however; and therefore no warranty is expressed or implied that they will
     work as described in the future. Always check the most current Google Analytics documentation.

     Thanks to Nick Mikailovski (Google) for intitial discussions & Holger Tempel from webalytics.de
     for pointing out the original flaw of doing this in IE.

****************************************************/
// Only links written to the page (already in the DOM) will be tagged
// This version is for ga.js (last updated Jan 15th 2009)
// 2014 Aug-19 Updates: remove support for ga.js but add support for google universal analytics 


$( document ).ajaxComplete(function() {
	if (domain && domain!=''){
		var as = document.getElementsByTagName("a");
		var extTrack = [domain];
		// List of local sites that should not be treated as an outbound link. Include at least your own domain here
		
		// var extDoc = [".doc",".xls",".exe",".zip",".pdf",".js"];
		var extDoc = [".doc",".xls",".exe",".zip",".pdf"];
		//List of file extensions on your site. Add/edit as you require
		
		/*If you edit no further below this line, Top Content will report as follows:
			/ext/url-of-external-site
			/downloads/filename
			/mailto/email-address-clicked
		*/
		
		for(var i=0; i<as.length; i++) {
			var flag = 0;
			var tmp = as[i].getAttribute("onclick");
	
			// IE6-IE7 fix (null values error) with thanks to Julien Bissonnette for this
			if (tmp != null) {
			  tmp = String(tmp);
			  if (tmp.indexOf('urchinTracker') > -1 || tmp.indexOf('_trackPageview') > -1) continue;
	    		}
	
			// Tracking outbound links off site - not the GATC
			for (var j=0; j<extTrack.length; j++) {					
				if (as[i].href.indexOf(extTrack[j]) == -1 && as[i].href.indexOf('google-analytics.com') == -1 ) {
					flag++;
				}
			}
			
			if (flag == extTrack.length && as[i].href.indexOf("mailto:") == -1){
				as[i].onclick = function(){ 
					var splitResult = this.href.split("//");
					//_gaq.push(['_trackPageview', '/ext/' +splitResult[1]]);
					ga_Universal('send', 'pageview',{'page': '/ext/' +splitResult[1]}); 
					//pageTracker._trackPageview('/ext/' +splitResult[1]) + ";" +((tmp != null) ? tmp+";" : "");
				};
					//alert(as[i] +"  ext/" +splitResult[1])
			}			
	
			// Tracking electronic documents - doc, xls, pdf, exe, zip
			for (var j=0; j<extDoc.length; j++) {
				if (as[i].href.indexOf(extTrack[0]) != -1 && as[i].href.indexOf(extDoc[j]) != -1) {
					as[i].onclick = function(){
						var splitResult = this.href.split(extTrack[0]);
			            //_gaq.push(['_trackPageview', '/downloads' +splitResult[1]]);
			            ga_Universal('send', 'pageview',{'page': '/downloads' +splitResult[1]}); 

						//pageTracker._trackPageview('/downloads' +splitResult[1])+ ";" +((tmp != null) ? tmp+";" : "");
			        }
					//alert(as[i] +"  downloads" +splitResult[1])
					break;
				}
			}
	
			// added to track dtcm links 24-May-2012
		      if (/\.action.*output=BINARY/.test(as[i].href))
		      {
		        as[i].onclick = function()
		          {
		            var splitResult = this.href.split(extTrack[0]);
		           // _gaq.push(['_trackPageview', '/downloads' +splitResult[1]]);
		            ga_Universal('send', 'pageview',{'page': '/downloads' +splitResult[1]}); 
		            //pageTracker._trackPageview('/downloads' +splitResult[1])+ ";" +((tmp != null) ? tmp+";" : "");
		            //alert('/downloads' +splitResult[1])+ ";" +((tmp != null) ? tmp+";" : "")
		          }
		      }
	
			// added to track mailto links 23-Oct-2007
			// updated 31-Oct-2008 to remove break command - thanks to Victor Geerdink for spotting this
			if (as[i].href.indexOf("mailto:") != -1) {
				as[i].onclick = function(){ 
					var splitResult = this.href.split(":");
		           // _gaq.push(['_trackPageview', '/mailto/' +splitResult[1]]);
		            ga_Universal('send', 'pageview',{'page': '/mailto/' +splitResult[1]}); 
					//pageTracker._trackPageview('/mailto/' +splitResult[1])+ ";"+((tmp != null) ? tmp+";" : "");
				}
				//alert(as[i] +"  mailto/" +splitResult[1])
			}
		}
	}
});
