(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/feature/productFilterLevel');

require('../../../app/comp/feature/productFilterCheck');

require('../../../app/comp/feature/productFilterRadio');

/** 
 * __HtmlTag__: product-filter-box <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSearchFilters} 
 */

var ProductFilterBox = (function () {
	function ProductFilterBox($rootScope, $timeout) {
		_classCallCheck(this, ProductFilterBox);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
	}

	ProductFilterBox.prototype.isVisible = function isVisible(code) {
		if (this.$rootScope.currentFilter.code === code) {
			return true;
		}
		return false;
	};

	return ProductFilterBox;
})();

_appModuleMain.main.component('productFilterBox', {
	controller: ProductFilterBox,
	bindings: { filters: '<' },
	template: "<div class=\"filter-box {{$ctrl.$rootScope.currentFilter.color}}\">\n\t<product-filter-level ng-show=\"$ctrl.isVisible('markets')\" filter=\"$ctrl.filters.markets\"></product-filter-level>\n\t<product-filter-level ng-show=\"$ctrl.isVisible('chemicals')\" filter=\"$ctrl.filters.chemicals\"></product-filter-level>\n\t<product-filter-check ng-show=\"$ctrl.isVisible('brands')\" filter=\"$ctrl.filters.brands\"></product-filter-check>\n\t<product-filter-radio ng-show=\"$ctrl.isVisible('zones')\" filter=\"$ctrl.filters.zones\"></product-filter-radio>\n</div>"
});

exports.ProductFilterBox = ProductFilterBox;

},{"../../../app/comp/feature/productFilterCheck":7,"../../../app/comp/feature/productFilterLevel":8,"../../../app/comp/feature/productFilterRadio":9,"../../../app/module/main":42}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: contact-list <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var ContactList = (function () {
	function ContactList() {
		_classCallCheck(this, ContactList);

		this.product = gpc_global_var.product;
		this.links = gpc_global_links;
	}

	ContactList.prototype.enc = function enc(str) {
		return encodeURIComponent(str).replace(/%20/g, "+");
	};

	ContactList.prototype.$onInit = function $onInit() {
		var query = 'productCode=' + this.enc(this.product.code) + '&productLabel=' + this.enc(this.product.name) + '&gbu=' + this.enc(this.product.gbu.name);
		this.items = [{ icon: 'ask', text: 'ASK_INQUIRY', href: this.links.product_request + '?' + query }, { icon: 'calc', text: 'REQUEST_QUOTATION', href: this.links.quotation_request + '?' + query }, { icon: 'documents', text: 'ASK_DOCUMENTATION', href: this.links.documentation_request + '?' + query }];
		if (this.product.sampleRequest === 'True') {
			this.items.unshift({ icon: 'sample', text: 'ORDER_SAMPLE', href: this.links.sample_request + '?' + query });
		}
	};

	ContactList.prototype.redirect = function redirect(href) {
		window.location = href;
	};

	return ContactList;
})();

_appModuleMain.main.component('contactList', {
	controller: ContactList,
	template: "<section class=\"section-contact-list\" id=\"contacts\">\n\t<div class=\"wrap\">\n\t\t<div class=\"box\">\n\t\t\t<div class=\"title\" translate=\"CONTACT_SOLVAY\">\n\t\t\t</div>\n\t\t\t<a href=\"{{i.href}}\" class=\"button {{i.icon}}\" ng-repeat=\"i in $ctrl.items\">\n\t\t\t\t<span>\n\t\t\t\t\t{{i.text | translate}}\n\t\t\t\t</span>\n\t\t\t</a>\n\t\t</div>\n\t</div>\n</section>"
});

exports.ContactList = ContactList;

/*
			<div ng-click="$ctrl.redirect(i.href)" class="button {{i.icon}}" ng-repeat="i in $ctrl.items">
				<span>
					{{i.text | translate}}
				</span>
			</div>
*/

},{"../../../app/module/main":42}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: download-docs <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var DownloadDocs = (function () {
	function DownloadDocs(productService, $rootScope, $translate) {
		_classCallCheck(this, DownloadDocs);

		this.productService = productService;
		this.$rootScope = $rootScope;
		this.product = gpc_global_var.product;
		this.links = gpc_global_links;
		this.product.sdsDocumentsList = [];
		this.product.sdsDocs.countries = [{ 'countryName': $translate.instant('SELECT_COUNTRY') }].concat(this.product.sdsDocs.countries);
		this.selectedCR = this.product.sdsDocs.countries[0].countryName;
		var query = 'productCode=' + this.enc(this.product.code) + '&productLabel=' + this.enc(this.product.name) + '&gbu=' + this.enc(this.product.gbu.name);
		this.askDoc = { icon: 'download', text: 'NO_DOC_LINK', href: this.links.documentation_request + '?' + query };
	}

	DownloadDocs.prototype.enc = function enc(str) {
		return encodeURIComponent(str).replace(/%20/g, "+");
	};

	DownloadDocs.prototype.getSDSDocumentsByCountry = function getSDSDocumentsByCountry() {
		var _this = this;

		this.productService.getSDSDocumentsList(function (data) {
			_this.product.sdsDocumentsList = data;
		}, this.product.code, this.selectedCR);
	};

	DownloadDocs.prototype.$onInit = function $onInit() {
		var divId = '';
		if (window.location.href.indexOf("docs") != -1) {
			divId = '#docs';
		}
		if (window.location.href.indexOf("contacts") != -1) {
			divId = '#contacts';
		}
		if (divId !== '') {
			(function () {
				var heightValue = 0;
				if (window.innerWidth > 1024) {
					heightValue = $(".header-layout").height() + $(".breadcrumb").height();
				}if ($(window).scrollTop() > $("#navFixedLinks").position().top) {
					heightValue = 53; // === $("#navFixedLinks").height()
				}
				setTimeout(function () {
					$('html,body').animate({
						scrollTop: $(divId).offset().top - heightValue
					}, 500);
				}, 500);
			})();
		}
	};

	return DownloadDocs;
})();

_appModuleMain.main.component('downloadDocs', {
	controller: DownloadDocs,
	template: "<section class=\"section-download-list\" id=\"docs\" >\n\t<div class=\"wrap\" >\n\t\t<div class=\"box\">\n\t\t\t<div class=\"download-title\">\n\t\t\t\t{{ 'DOWNLOAD_DOCUMENTATION' | translate }} {{$ctrl.product.name}}\n\t\t\t</div>\n\t\t\t<div class=\"group\">\n\t\t\t\t<div class=\"title\">\n\t\t\t\t\t<h3 class=\"title-text\" translate=\"SDS\"></h3>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"country-region-select\" ng-if=\"$ctrl.product.sdsDocs.countries[1] !== undefined\">\n\t\t\t\t\t<select ng-model=\"$ctrl.selectedCR\" ng-change=\"$ctrl.getSDSDocumentsByCountry()\">\n\t\t\t\t\t\t<option value=\"{{data.countryName}}\" ng-repeat=\"data in $ctrl.product.sdsDocs.countries track by $index\">{{data.countryName}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t</div>\n\t\t\t\t<ul class=\"download-list\">\n\t\t\t\t\t<li class=\"download-list__file\" ng-repeat=\"data in $ctrl.product.sdsDocumentsList track by $index\" ng-if=\"$ctrl.product.sdsDocumentsList.length>0\">\n\t\t\t\t\t\t<a href=\"{{ $ctrl.productService._DOCUMENT_DOWNLOAD + '?fileId=' + data.chronicalID + '&base=' + 'RCSEHS' + '&fileName=' + data.docType+'-'+$ctrl.product.name+'-'+data.language+'-'+data.version + '&version=' + data.version }}\" target=\"download\">\n\t\t\t\t\t\t\t<i class=\"material-icons\">file_download</i>\n\t\t\t\t\t\t\t{{data.docType}}-{{$ctrl.product.name}}-{{$ctrl.selectedCR}}-{{data.language}}\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"download-list__info\" ng-if=\"$ctrl.product.sdsDocs.countries[1] === undefined\">\n\t\t\t\t\t\t<i class=\"material-icons\">info</i>\n\t\t\t\t\t\t{{ 'NO_DOC_SENTENCE' | translate }} <a href=\"{{$ctrl.askDoc.href}}\">{{$ctrl.askDoc.text | translate }}</a>.\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"group\">\n\t\t\t\t<div class=\"title\">\n\t\t\t\t\t<h3 class=\"title-text\" translate=\"TDS\"></h3>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"separator\"></div>\n\t\t\t\t<ul class=\"download-list\">\n\t\t\t\t\t<li class=\"download-list__file\" ng-repeat=\"tds in $ctrl.product.otherDocs.tds\" ng-if=\"$ctrl.product.otherDocs.tds.length > 0\">\n\t\t\t\t\t\t<a href=\"{{ $ctrl.productService._DOCUMENT_DOWNLOAD + '?fileId=' + tds.chronicalID + '&base=' + 'FAST' + '&fileName=' + tds.docType+'-'+$ctrl.product.name+'-'+tds.language+'-'+tds.version + '&version=' + tds.version }}\" target=\"download\">\n\t\t\t\t\t\t\t<i class=\"material-icons\">file_download</i>\n\t\t\t\t\t\t\t{{tds.fullDocType}}-{{$ctrl.product.name}}-{{tds.language}}\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"download-list__file\" ng-if=\" $ctrl.product.ulProspectorCode !== '' && $ctrl.product.gbu.ulpGbuCode !== '' \">\n\t\t\t\t\t\t<a href=\"http://catalog.ides.com/datasheet.aspx?I={{$ctrl.product.gbu.ulpGbuCode}}&FMT=PDF&E={{$ctrl.product.ulProspectorCode}}\" target=\"_blank\">\n\t\t\t\t\t\t\t<i class=\"material-icons\">file_download</i>\n\t\t\t\t\t\t\tProduct data sheet-{{$ctrl.product.name}}-UL Prospector\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"download-list__info\" ng-if=\" $ctrl.product.otherDocs.tds.length === 0 && $ctrl.product.ulProspectorCode === '' \">\n\t\t\t\t\t\t<i class=\"material-icons\">info</i>\n\t\t\t\t\t\t{{ 'NO_DOC_SENTENCE' | translate }} <a href=\"{{$ctrl.askDoc.href}}\">{{$ctrl.askDoc.text | translate }}</a>.\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"group\" ng-if=\"$ctrl.product.otherDocs.literature.length > 0\">\n\t\t\t\t<div class=\"title\">\n\t\t\t\t\t<h3 class=\"title-text\" translate=\"LITTERATURE\"></h3>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"separator\"></div>\n\t\t\t\t<ul class=\"download-list\">\n\t\t\t\t\t <li class=\"download-list__file\" ng-repeat=\"lit in $ctrl.product.otherDocs.literature\" ng-if=\"$ctrl.product.otherDocs.literature.length>0\">\n\t\t\t\t\t\t<a href=\"{{ $ctrl.productService._DOCUMENT_DOWNLOAD + '?fileId=' + lit.chronicalID + '&base=' + 'FAST' + '&fileName=' + lit.docType+'-'+$ctrl.product.name+'-'+lit.language+'-'+lit.version + '&version=' + lit.version }}\" target=\"download\">\n\t\t\t\t\t\t\t<i class=\"material-icons\">file_download</i>\n\t\t\t\t\t\t\t{{lit.fullDocType}}-{{lit.fileName}}-{{lit.language}}\n\t\t\t\t\t\t</a>\n\t\t\t\t\t </li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"group\">\n\t\t\t\t<div class=\"title\">\n\t\t\t\t\t<h3 class=\"title-text\" translate=\"REGULATORY_QUALITY\"></h3>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"separator\"></div>\n\t\t\t\t<ul class=\"download-list\" >\n\t\t\t\t\t<li class=\"download-list__file\" ng-repeat=\"reg in $ctrl.product.otherDocs.regulatory\" ng-if=\"$ctrl.product.otherDocs.regulatory.length > 0\">\t\n\t\t\t\t\t\t<a href=\"{{ $ctrl.productService._DOCUMENT_DOWNLOAD + '?fileId=' + reg.chronicalID + '&base=' + 'FAST' + '&fileName=' + reg.docType+'-'+$ctrl.product.name+'-'+reg.language+'-'+reg.version + '&version=' + reg.version }}\" target=\"download\">\n\t\t\t\t\t\t\t<i class=\"material-icons\">file_download</i>\n\t\t\t\t\t\t\t{{reg.fullDocType}}-{{$ctrl.product.name}}-{{reg.language}}\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"download-list__info\" ng-if=\" $ctrl.product.otherDocs.regulatory.length==0\">\n\t\t\t\t\t\t<i class=\"material-icons\">info</i>\n\t\t\t\t\t\t{{ 'NO_DOC_SENTENCE' | translate }} <a href=\"{{$ctrl.askDoc.href}}\">{{$ctrl.askDoc.text | translate }}</a>.\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>"
});

exports.DownloadDocs = DownloadDocs;

/*

old litterature name : 
{{lit.fullDocType}}-{{lit.docSubType}}-{{$ctrl.product.name}}-{{lit.language}}

*/

},{"../../../app/module/main":42}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: fixed-links <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ContentLayout}
 */

var FixedLinks = (function () {
	function FixedLinks() {
		_classCallCheck(this, FixedLinks);

		this.product = gpc_global_var.product;
		this.links = gpc_global_links;
	}

	FixedLinks.prototype.enc = function enc(str) {
		return encodeURIComponent(str).replace(/%20/g, "+");
	};

	FixedLinks.prototype.$onInit = function $onInit() {
		var query = 'productCode=' + this.enc(this.product.code) + '&productLabel=' + this.enc(this.product.name) + '&gbu=' + this.enc(this.product.gbu.name);
		this.items = [{ icon: 'calc', text: 'REQUEST_QUOTATION', href: this.links.quotation_request + '?' + query }, { icon: 'documents', text: 'DOCUMENTATION', href: '#docs' }, { icon: 'ask', text: 'CONTACT', href: '#contacts' }];
		if (this.product.sampleRequest === 'True') {
			this.items.unshift({ icon: 'sample', text: 'ORDER_SAMPLE', href: this.links.sample_request + '?' + query });
		}
		var nav = $("#navFixedLinks");
		var fixedPoint = nav.position().top;
		$(window).scroll(function () {
			if ($(window).scrollTop() > fixedPoint) {
				nav.addClass("fixed");
			} else {
				nav.removeClass("fixed");
			}
		});
	};

	FixedLinks.prototype.scrollTo = function scrollTo(divId) {
		if (divId.indexOf("?") !== -1) {
			return;
		}
		var heightValue = 0;
		if (window.innerWidth > 1024 && $("#navFixedLinks").hasClass("fixed") === false) {
			heightValue = $(".header-layout").height() + $(".breadcrumb").height();
		}
		if ($("#navFixedLinks").hasClass("fixed")) {
			heightValue = $("#navFixedLinks").height() + $(".breadcrumb").height();
		}
		var scrollTop = $(divId).offset().top - heightValue;
		$('.header-layout').addClass('hide-on-scroll');
		$('html,body').animate({ scrollTop: scrollTop }, 500, function () {
			$('.header-layout').addClass('hide');
			$('.header-layout').removeClass('hide-on-scroll');
		});
	};

	return FixedLinks;
})();

_appModuleMain.main.component('fixedLinks', {
	controller: FixedLinks,
	template: "<header>\n\t<nav id=\"navFixedLinks\" class=\"nav-fixed-links\">\n\t\t<div class=\"wrap\">\n\t\t\t<a href=\"{{item.href}}\" ng-click=\"$ctrl.scrollTo(item.href)\" class=\"nav-fixed-item {{item.icon}}\" ng-repeat=\"item in $ctrl.items\">\n\t\t\t\t{{item.text | translate}}\n\t\t\t</a>\n\t\t</div>\n\t</nav>\n</header>"
});

exports.FixedLinks = FixedLinks;

},{"../../../app/module/main":42}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: other-products <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var OtherProducts = (function () {
	function OtherProducts($cookies) {
		_classCallCheck(this, OtherProducts);

		this.$cookies = $cookies;
		this.links = gpc_global_links;
	}

	OtherProducts.prototype.$onInit = function $onInit() {
		this.product = null;
		if (window.hasOwnProperty('gpc_global_var')) {
			if (gpc_global_var !== undefined) {
				this.product = gpc_global_var.product;
			}
		}
		this.viewed = this.$cookies.getObject('viewed');
		if (this.viewed === undefined) {
			this.viewed = [];
		}
		for (var _iterator = this.viewed.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var k = _ref[0];
			var v = _ref[1];

			if (this.product !== null && v.id.toString() === this.product.id.toString()) {
				this.viewed.splice(k, 1);
			}
		}
		if (this.product !== null) {
			this.viewed.unshift({ 'id': this.product.id, 'name': this.product.name });
		}
		this.viewed = this.viewed.slice(0, 5);
		this.$cookies.putObject('viewed', this.viewed, {
			expires: new Date(200000000000000)
		});
		if (this.product !== null && this.viewed.length > 1) {
			this.viewed.shift();
		}
		this.viewed = this.viewed.slice(0, 4);
		this.related = [];
		if (this.product !== null && this.product.relatedProductsDisplayNames !== undefined) {
			this.relatedNames = this.product.relatedProductsDisplayNames.split(';');
			for (var _iterator2 = this.product.relatedProductsIds.split(';').entries(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var k = _ref2[0];
				var v = _ref2[1];

				if (v.length > 0) {
					this.related.push({ id: v, name: this.relatedNames[k] });
				}
			}
			if (this.related.length > 4) {
				this.related = this.related.slice(0, 4);
			}
		}
	};

	OtherProducts.prototype.encode = function encode(p) {
		p = p.replace(/ /g, '+');
		p = encodeURI(p);
		p = p.replace(/\,/g, '%2C');
		p = p.replace(/\//g, '%2F');
		p = p.replace(/\(/g, '%28');
		p = p.replace(/\)/g, '%29');
		return p;
	};

	return OtherProducts;
})();

_appModuleMain.main.component('otherProducts', {
	controller: OtherProducts,
	template: "<section class=\"section-other-products\" ng-if=\"$ctrl.viewed.length > 0\">\n\t<div class=\"wrap\">\n\t\t<div class=\"box\">\n\t\t\t<div class=\"group\" ng-if=\"$ctrl.related.length !== 0\">\n\t\t\t\t<div class=\"title\" translate=\"RELATED_PRODUCTS\"></div>\n\t\t\t\t<ul class=\"groups-list\">\n\t\t\t\t\t<li class=\"groups-list-item\" ng-repeat=\"item in $ctrl.related\">\n\t\t\t\t\t\t<a href=\"{{$ctrl.links.detail}}?productId={{item.id}}&productName={{$ctrl.encode(item.name)}}\">\n\t\t\t\t\t\t\t{{item.name}}\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"group\">\n\t\t\t\t<div class=\"title\" translate=\"RECENTLY_VIEWED_PRODUCTS\"></div>\n\t\t\t\t<ul class=\"groups-list\">\n\t\t\t\t\t<li class=\"groups-list-item\" ng-repeat=\"item in $ctrl.viewed\">\n\t\t\t\t\t\t<a href=\"{{$ctrl.links.detail}}?productId={{item.id}}&productName={{$ctrl.encode(item.name)}}\">\n\t\t\t\t\t\t\t{{item.name}}\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>"
});

exports.OtherProducts = OtherProducts;

},{"../../../app/module/main":42}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/widget/tabs');

require('../../../app/comp/widget/breadcrumbList');

require('../../../app/comp/feature/fixedLinks');

/**
 * __HtmlTag__: product-detail <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var ProductDetail = function ProductDetail() {
	_classCallCheck(this, ProductDetail);
};

_appModuleMain.main.component('productDetail', {
	controller: ProductDetail,
	bindings: { product: '=' },
	template: "<section class=\"section-product-detail\">\n\t<div class=\"wrap\">\n\t\t<h1 class=\"product-title\">\n\t\t\t{{$ctrl.product.name}}\n\t\t</h1>\n\t</div>\n\t<fixed-links></fixed-links>\n\t<div class=\"wrap\">\n\t\t<div class=\"box\">\n\t\t\t<div class=\"description\" ng-bind-html=\"$ctrl.product.description\"></div>\n\t\t\t<tabs items=\"$ctrl.product.markets\" title=\"{{ 'MARKETS' | translate }}\"></tabs>\n\t\t\t<breadcrumb-list items=\"$ctrl.product.chemicals\" title=\"{{ 'CHEMICAL_CATEGORY' | translate }}\"></breadcrumb-list>\n\t\t\t<div class=\"attribute half\" ng-if=\"$ctrl.product.casNumber\">\n\t\t\t\t<h3 class=\"title\" translate=\"CAS_NUMBER\"></h3>\n\t\t\t\t<ul class=\"attribute-list\">\n\t\t\t\t\t<li>{{$ctrl.product.casNumber}}</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"attribute half\" ng-if=\"$ctrl.product.gbu.name\">\n\t\t\t\t<h3 class=\"title\" translate=\"GBU\"></h3>\n\t\t\t\t<ul class=\"attribute-list\">\n\t\t\t\t\t<li>{{$ctrl.product.gbu.name}}</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"attribute half\" ng-if=\"$ctrl.product.brand.name\">\n\t\t\t\t<h3 class=\"title\" translate=\"BRAND\"></h3>\n\t\t\t\t<ul class=\"attribute-list\">\n\t\t\t\t\t<li>{{$ctrl.product.brand.name}}</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"attribute\">\n\t\t\t\t<h3 class=\"title\" translate=\"ZONE\"></h3>\n\t\t\t\t<ul class=\"attribute-list\">\n\t\t\t\t\t<li ng-if=\"$ctrl.product.availibilityAPAC === 'True'\" translate=\"COUNTRY_APAC\">Asia / Pacific</li>\n\t\t\t\t\t<li ng-if=\"$ctrl.product.availibilityEMEA === 'True'\" translate=\"COUNTRY_EMEA\">Europe / Middle-East / Africa</li>\n\t\t\t\t\t<li ng-if=\"$ctrl.product.availibilityNA === 'True'\" translate=\"COUNTRY_NA\">North-America</li>\n\t\t\t\t\t<li ng-if=\"$ctrl.product.availibilityLA === 'True'\" translate=\"COUNTRY_LA\">Latin-America</li>\n\t\t\t\t\t<li ng-if=\"$ctrl.product.availibilityLA === 'False' && $ctrl.product.availibilityNA === 'False' && $ctrl.product.availibilityEMEA === 'False' && $ctrl.product.availibilityAPAC === 'False'\" translate=\"COUNTRY_NONE\">None</li>\n\t\t\t\t</ul>\n\t\t\t\t<span class=\"commercial-info\">{{$ctrl.product.commercialInformation}}</span>\n\t\t\t</div>\n\t\t\t<div ng-if=\" $ctrl.product.compilanceInfos != undefined\" class=\"attribute\">\n\t\t\t\t<h3 class=\"title\" translate=\"REGULATORY\"></h3>\n\t\t\t\t<ul class=\"attribute-list\">\n\t\t\t\t\t<li ng-repeat=\"elem in $ctrl.product.compilanceInfos | orderBy : 'category' \">\n\t\t\t\t\t\t{{elem.category}} :\n\t\t\t\t\t\t<ul  class=\"attribute-nested-list\">\n\t\t\t\t\t\t\t<li ng-repeat=\"data in elem.compliances\">{{data.name}}</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>\t\t\t\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div ng-if=\" $ctrl.product.synonyms != undefined\" class=\"attribute\">\n\t\t\t\t<h3 class=\"title\" translate=\"SYNONYMS\"></h3>\n\t\t\t\t<ul class=\"attribute-list\">\n\t\t\t\t\t<li ng-repeat=\"syn in $ctrl.product.synonyms | orderBy : 'name' \">\n\t\t\t\t\t\t{{syn.name}}\n\t\t\t\t\t</li>\t\t\t\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</section>"
});

exports.ProductDetail = ProductDetail;

},{"../../../app/comp/feature/fixedLinks":4,"../../../app/comp/widget/breadcrumbList":27,"../../../app/comp/widget/tabs":29,"../../../app/module/main":42}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: product-filter-box <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSearchFilters}
 */

var ProductFilterCheck = (function () {
	function ProductFilterCheck($rootScope, $timeout, productService) {
		_classCallCheck(this, ProductFilterCheck);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.productService = productService;
		this.initializeAll();
		this.$rootScope.searchBrand = '';
		this.createScrollBar();
	}

	ProductFilterCheck.prototype['switch'] = function _switch(item) {
		if (item.count === 0 || this.$rootScope.loading) {
			return;
		}
		item.active = !item.active; // revert boolean
		this.buildFilterParam(item, this.$rootScope.sinequaParams.brandsInfo, 'brands');
		this.productService.updateFilters(function (data) {});
	};

	ProductFilterCheck.prototype.initializeAll = function initializeAll() {
		for (var _iterator = this.filter.data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var i = _ref;

			if (i.active === undefined) {
				i.active = false;
			}
		}
	};

	ProductFilterCheck.prototype.unselectAll = function unselectAll() {
		for (var _iterator2 = this.filter.data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var i = _ref2;

			i.active = false;
		}
	};

	ProductFilterCheck.prototype.buildFilterParam = function buildFilterParam(item, sinequaParam, code) {
		var filterBubbles = this.$rootScope.filterBubbles;
		var newItem = { name: item.name, count: item.count };
		if (item.active) {
			sinequaParam.push(newItem);
			var newBubble = { values: [item.name], filter: this.filter };
			filterBubbles.push(newBubble);
		} else {
			for (var _iterator3 = sinequaParam.entries(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref3;

				if (_isArray3) {
					if (_i3 >= _iterator3.length) break;
					_ref3 = _iterator3[_i3++];
				} else {
					_i3 = _iterator3.next();
					if (_i3.done) break;
					_ref3 = _i3.value;
				}

				var i = _ref3[0];
				var sp = _ref3[1];

				if (sp.name === item.name) {
					sinequaParam.splice(i, 1);
				}
			}
			for (var _iterator4 = filterBubbles.entries(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
				var _ref4;

				if (_isArray4) {
					if (_i4 >= _iterator4.length) break;
					_ref4 = _iterator4[_i4++];
				} else {
					_i4 = _iterator4.next();
					if (_i4.done) break;
					_ref4 = _i4.value;
				}

				var k = _ref4[0];
				var fb = _ref4[1];

				if (item.name === fb.values[0]) {
					filterBubbles.splice(k, 1);
					break;
				}
			}
		}
	};

	ProductFilterCheck.prototype.createScrollBar = function createScrollBar() {
		Ps.initialize($('.productFilterCheck').get(0), {
			suppressScrollX: true
		});
	};

	ProductFilterCheck.prototype.updateScroll = function updateScroll() {
		this.$timeout(function () {
			Ps.update($('.productFilterCheck').get(0));
			Ps.update($('.productFilterCheck').get(0)); // needed to force refresh
		}, 300);
	};

	return ProductFilterCheck;
})();

_appModuleMain.main.component('productFilterCheck', {
	controller: ProductFilterCheck,
	bindings: { filter: '=' },
	require: { parentCtrl: '^^productSearchFilters' },
	template: "<div class=\"productFilterCheck filter-sub-box\">\n\t<div class=\"filter-select__title\" ng-click=\"$ctrl.parentCtrl.closeFilter($ctrl.filter,data.level)\">{{$ctrl.filter.name | translate}}</div>\n\t<div class=\"filter-select__close\" ng-click=\"$ctrl.parentCtrl.hideFilters()\">\n\t\t<button>OK</button>\n\t</div>\n\t<div class=\"search-input\">\n\t\t<input ng-model=\"$ctrl.$rootScope.searchBrand\" id=\"brand_search_input\" name=\"keywords\" type=\"text\" placeholder=\"Search for a specific brand\" ng-keydown=\"$ctrl.updateScroll()\"/>\n\t</div>\n\t<ul class=\"filter-select__list\">\n\t\t<li  class=\"filter-select__list-item filter-select__list-item--check\" ng-repeat=\"item in $ctrl.$rootScope.brands | filter:$ctrl.$rootScope.searchBrand | orderBy : 'name'\" ng-click=\"$ctrl.switch(item)\" ng-class=\"{active: item.active && item.count != 0 , disabled: item.count == 0}\">\n\t\t\t{{item.name}} \n\t\t\t<span ng-class=\"{ hide: $ctrl.$rootScope.loading }\">\n\t\t\t\t({{item.count}})\n\t\t\t</span>\n\t\t</li>\n\t</ul>\n\t<div ng-if=\"$ctrl.$rootScope.dataFilters.productsWithoutBrands !== 0\" class=\"no-brands-info\" >\n\t   {{$ctrl.$rootScope.dataFilters.productsWithoutBrands}} products having no brands\n\t</div>\n</div>"
});

exports.ProductFilterCheck = ProductFilterCheck;

},{"../../../app/module/main":42}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: product-filter-box <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSearchFilters}
 */

var ProductFilterLevel = (function () {
	function ProductFilterLevel($rootScope, $timeout, productService) {
		_classCallCheck(this, ProductFilterLevel);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.productService = productService;
	}

	ProductFilterLevel.prototype.$onInit = function $onInit() {
		var _this = this;

		this.desktopSize = this.parentCtrl.desktopSize;
		$(window).resize(function () {
			if (window.innerWidth >= _this.desktopSize) {
				var l = _this.$rootScope.sinequaParams[_this.filter.code].split("/").length - 2;
				if (l > 0) {
					_this.showLevel(1);
				}if (l > 1) {
					_this.showLevel(2);
				}
			}
		});
		this.allItems = this.filter.data.allItems;
		this.$timeout(function () {
			_this.showLevel(0);
		}, 300);
	};

	ProductFilterLevel.prototype['switch'] = function _switch(item, lvl) {
		var level = parseInt(lvl);
		if (this.$rootScope.loading === false && item.count != 0 && (item.active || this.allItems[level].selectedItem === false)) {
			this.$rootScope.loading = true;
			var next = level + 1;
			if (level === 0) {
				this.$rootScope.sinequaParams[this.filter.code] = '/';
				this.allItems[2].items = [];
				this.unselectAll(2);
				this.allItems[2].showLevel = false;
			}
			if (level < 2) {
				this.allItems[next].items = item.children;
				this.unselectAll(next);
				if (item.active === true) {
					this.allItems[next].showLevel = false;
				} else {
					this.showLevel(next);
				}
			}
			if (item.active === false) {
				this.unselectAll(level);
			}
			item.active = !item.active; // revert boolean
			this.allItems[level].selectedItem = item.active;
			this.updateScroll(level);
			this.buildFilterParam(item, level);
		}
	};

	ProductFilterLevel.prototype.unselectAll = function unselectAll(level) {
		this.allItems[level].selectedItem = false;
		for (var _iterator = this.allItems[level].items, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var i = _ref;

			i.active = false;
		}
	};

	ProductFilterLevel.prototype.showLevel = function showLevel(level) {
		this.allItems[level].showLevel = true;
		this.allItems[level].levelLoaded = true;
		this.createScrollBar();
	};

	ProductFilterLevel.prototype.decode = function decode(v) {
		return v.replace(/\(slash\)/g, '/');
	};

	ProductFilterLevel.prototype.isLevelActive = function isLevelActive(lvl) {
		var level = parseInt(lvl);
		for (var _iterator2 = this.allItems[level].items, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var i = _ref2;

			if (i.active) {
				return true;
			}
		}
		return false;
	};

	ProductFilterLevel.prototype.buildFilterParam = function buildFilterParam(item, level) {
		var code = this.filter.code;
		this.paramValue = this.$rootScope.sinequaParams[code];
		if (item.active) {
			// Add
			this.paramValue = this.paramValue.concat(item.name + '/');
		} else {
			// Remove		   
			var arr = this.paramValue.split('/');
			arr = arr.splice(0, level + 1);
			this.paramValue = arr.join('/') + '/';
		}
		this.$rootScope.sinequaParams[code] = this.paramValue;
		this.$rootScope.filterBubblesData[code] = this.paramValue.split('/');
		this.removeBlankfromArray(this.$rootScope.filterBubblesData[code]);
		this.updateBubbles(this.$rootScope.filterBubbles, code, this.$rootScope.filterBubblesData[code]);
		this.productService.updateFilters(function (data) {});
	};

	ProductFilterLevel.prototype.removeBlankfromArray = function removeBlankfromArray(array) {
		// first element and last element
		array.splice(0, 1);
		array.splice(array.length - 1, 1);
	};

	ProductFilterLevel.prototype.updateBubbles = function updateBubbles(array, filterName, bubblesData) {
		var found = false;
		for (var _iterator3 = array.entries(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var i = _ref3[0];
			var fb = _ref3[1];

			if (fb.filter.code === filterName) {
				fb.values = bubblesData;
				found = true;
				break;
			}
		}
		if (found === false) {
			var bubble = { values: bubblesData, filter: this.filter };
			array.push(bubble);
		}
	};

	ProductFilterLevel.prototype.createScrollBar = function createScrollBar() {
		var containers = document.querySelectorAll('.level__container');
		if (containers.length) {
			for (var _iterator4 = containers, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
				var _ref4;

				if (_isArray4) {
					if (_i4 >= _iterator4.length) break;
					_ref4 = _iterator4[_i4++];
				} else {
					_i4 = _iterator4.next();
					if (_i4.done) break;
					_ref4 = _i4.value;
				}

				var cont = _ref4;

				if (cont.classList.contains("ps-container") === false) {
					Ps.initialize(cont, {
						suppressScrollX: true
					});
				}
			}
		}
	};

	/**
  * after select an item, scroll to top in the next level
  */

	ProductFilterLevel.prototype.updateScroll = function updateScroll(lvl) {
		var _this2 = this;

		var lvlNext = parseInt(lvl) + 1;
		if (lvlNext < 3) {
			this.$timeout(function () {
				var divLevel = '#' + _this2.filter.code + '-level-' + lvlNext;
				$(divLevel).get(0).scrollTop = 0;
				Ps.update($(divLevel).get(0));
				Ps.update($(divLevel).get(0)); // needed to force refresh
			}, 300);
		}
	};

	return ProductFilterLevel;
})();

_appModuleMain.main.component('productFilterLevel', {
	controller: ProductFilterLevel,
	require: { parentCtrl: '^^productSearchFilters' },
	bindings: { filter: '<' },
	template: "<div id=\"{{$ctrl.filter.code}}-level-{{data.level}}\" class=\"level__container level__container--level-{{data.level}}\" ng-class=\"{ loading: !data.levelLoaded, show: data.showLevel, selected: data.selectedItem }\" ng-repeat=\"data in $ctrl.allItems\">\n\t<div class=\"level__container-title\" ng-click=\"$ctrl.parentCtrl.closeFilter($ctrl.filter,data.level)\">{{$ctrl.filter.name | translate}} - {{data.subName | translate}}</div>\n\t<div class=\"level__container-close\" ng-click=\"$ctrl.parentCtrl.hideFilters()\" >\n\t\t<button>OK</button>\n\t</div>\n\t<ul class=\"level level-{{data.level}}\">\n\t\t<li class=\"level__item\" ng-show=\"data.levelLoaded\" ng-repeat=\"item in data.items | orderBy : 'name'\" ng-click=\"$ctrl.switch(item,data.level)\" ng-class=\"{active: item.active, disabled: item.count==0 || data.selectedItem }\" >\n\t\t\t<span ng-bind-html=\"$ctrl.decode(item.name)\"></span> \n\t\t\t<span ng-if=\"item.active || $ctrl.isLevelActive(data.level) === false\" ng-class=\"{ hide: $ctrl.$rootScope.loading }\">\n\t\t\t\t({{item.count}})\n\t\t\t</span>\n\t\t</li>\n\t</ul>\n</div>"
});

exports.ProductFilterLevel = ProductFilterLevel;

},{"../../../app/module/main":42}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: product-filter-box <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSearchFilters}
 */

var ProductFilterRadio = (function () {
	function ProductFilterRadio($rootScope, $timeout, productService) {
		_classCallCheck(this, ProductFilterRadio);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.productService = productService;
		this.$rootScope.selected = {};
		this.initializeAll();
		this.createScrollBar();
	}

	ProductFilterRadio.prototype['switch'] = function _switch(item) {
		if (item.count === 0 || this.$rootScope.loading) {
			return;
		}
		this.unselectAll();
		this.resetRadioBubbles();
		if (this.$rootScope.selected.filterName !== item.filterName) {
			item.active = true;
			this.$rootScope.selected = item;
			this.$rootScope.sinequaParams[this.filter.code] = item.filterName;
			var newBubble = { values: [item.name], filter: this.filter };
			this.$rootScope.filterBubbles.push(newBubble);
		} else {
			item.active = false;
			this.$rootScope.selected = {};
			this.$rootScope.sinequaParams[this.filter.code] = '';
		}
		this.productService.updateFilters(function (data) {});
	};

	ProductFilterRadio.prototype.resetRadioBubbles = function resetRadioBubbles() {
		var filterBubbles = this.$rootScope.filterBubbles;
		for (var _iterator = filterBubbles.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var i = _ref[0];
			var fb = _ref[1];

			if (fb.filter.code === this.filter.code) {
				filterBubbles.splice(i, 1);
			}
		}
	};

	ProductFilterRadio.prototype.initializeAll = function initializeAll() {
		for (var _iterator2 = this.filter.data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var i = _ref2;

			if (i.active === undefined) {
				i.active = false;
			}
		}
	};

	ProductFilterRadio.prototype.unselectAll = function unselectAll() {
		for (var _iterator3 = this.filter.data, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var i = _ref3;

			i.active = false;
		}
	};

	ProductFilterRadio.prototype.isFilterActivate = function isFilterActivate() {
		for (var _iterator4 = this.filter.data, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
			var _ref4;

			if (_isArray4) {
				if (_i4 >= _iterator4.length) break;
				_ref4 = _iterator4[_i4++];
			} else {
				_i4 = _iterator4.next();
				if (_i4.done) break;
				_ref4 = _i4.value;
			}

			var i = _ref4;

			if (i.active) {
				return true;
			}
		}
		return false;
	};

	ProductFilterRadio.prototype.createScrollBar = function createScrollBar() {
		Ps.initialize($('.productFilterRadio').get(0), {
			suppressScrollX: true
		});
	};

	return ProductFilterRadio;
})();

_appModuleMain.main.component('productFilterRadio', {
	controller: ProductFilterRadio,
	bindings: { filter: '=' },
	require: { parentCtrl: '^^productSearchFilters' },
	template: "<div class=\"productFilterRadio filter-sub-box\">\n\t<div class=\"filter-select__title\" ng-click=\"$ctrl.parentCtrl.closeFilter( $ctrl.filter, data.level )\">{{$ctrl.filter.name | translate}}</div>\n\t<div class=\"filter-select__close\" ng-click=\"$ctrl.parentCtrl.hideFilters()\">\n\t\t<button>OK</button>\n\t</div>\n\t<ul class=\"filter-select__list\">\n\t\t<li class=\"filter-select__list-item filter-select__list-item--radio\" ng-repeat=\"item in $ctrl.filter.data | orderBy : 'name'\" ng-click=\"$ctrl.switch(item)\" ng-class=\"{ active: item.active, disabled: item.count === 0 }\">\n\t\t\t{{item.name}} \n\t\t\t<span ng-if=\"item.active || item.count === 0 || $ctrl.isFilterActivate() === false\" ng-class=\"{ hide: $ctrl.$rootScope.loading }\">\n\t\t\t\t({{item.count}})\n\t\t\t</span>\n\t\t</li>\n\t</ul>\n</div>"
});

exports.ProductFilterRadio = ProductFilterRadio;

},{"../../../app/module/main":42}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: product-not-find <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var ProductNotFind = (function () {
	function ProductNotFind() {
		_classCallCheck(this, ProductNotFind);

		this.links = gpc_global_links;
	}

	ProductNotFind.prototype.redirect = function redirect() {
		window.location = this.links.general_request;
	};

	return ProductNotFind;
})();

_appModuleMain.main.component('productNotFind', {
	controller: ProductNotFind,
	template: "<section class=\"product-not-find\">\n\t<div class=\"wrap\">\n\t\t<div class=\"box\">\n\t\t\t<div class=\"title\" translate=\"PRODUCT_NOT_FOUND\">\n\t\t\t</div>\n\t\t\t<a class=\"button ask\" href=\"{{$ctrl.links.general_request}}\">\n\t\t\t\t<span>\n\t\t\t\t\t{{ 'CONTACT_US' | translate }}\n\t\t\t\t</span>\n\t\t\t</a>\n\t\t</div>\n\t</div>\n</section>"
});

exports.ProductNotFind = ProductNotFind;

},{"../../../app/module/main":42}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/feature/productSearchFilters');

require('../../../app/comp/feature/productSelectedFilters');

var _appServiceGpcService = require('../../../app/service/GpcService');

var ProductSearch = (function () {
	function ProductSearch($rootScope, $timeout, productService) {
		_classCallCheck(this, ProductSearch);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.productService = productService;
		this.showMobile = false;
		this.$rootScope.searchKeys = [];
		this.scroll();
		this.click();
	}

	ProductSearch.prototype.search = function search() {
		var _this = this;

		//unselect & clear sinequaParams & set params to empty
		this.parentCtrl.searchFilters.closeCurrentFilter();
		this.parentCtrl.clearAll(false);
		this.productService.updateFilters(function (data) {
			_this.$rootScope.sinequaParams.displayedSearchTxtMode = _this.$rootScope.sinequaParams.searchTxt;
		});
	};

	ProductSearch.prototype.keyUp = function keyUp($event) {
		var keyCode = $event.keyCode;
		if (keyCode === 13) {
			this.search();
			return;
		}
		this.getCompletion();
	};

	ProductSearch.prototype.getCompletion = function getCompletion() {
		var _this2 = this;

		var txt = $("#product_search_input input").val();
		if (txt.length < 3) {
			this.$rootScope.searchKeys = [];
			return;
		}
		this.productService.getCompletion(txt, function (data, success) {
			var arr = Object.keys(data).map(function (k) {
				return data[k].Display;
			});
			_this2.$rootScope.searchKeys = arr;
		});
	};

	/**
  * autoscroll on input focus
  */

	ProductSearch.prototype.scroll = function scroll() {
		var _this3 = this;

		$("#product_search_input input").on('focus', function () {
			_this3.parentCtrl.scrollToSearch();
		});
	};

	ProductSearch.prototype.click = function click() {
		var _this4 = this;

		$("autocomplete ul").on('click', function () {
			_this4.search();
		});
	};

	ProductSearch.prototype.clearAll = function clearAll() {
		this.parentCtrl.clearAll();
		this.productService.updateFilters(function (data) {});
	};

	ProductSearch.prototype.switchFilter = function switchFilter(on) {
		this.showMobile = on;
	};

	return ProductSearch;
})();

_appModuleMain.main.component('productSearch', {
	controller: ProductSearch,
	require: { parentCtrl: '^productSearchPage' },
	template: "<section class=\"product-search-section\">\n\t<div class=\"wrap\">\n\t\t<div class=\"search-input-box\">\n\t\t\t<autocomplete ng-model=\"$ctrl.$rootScope.sinequaParams.searchTxt\" attr-id=\"product_search_input\" data=\"$ctrl.$rootScope.searchKeys\" ng-keyup=\"$ctrl.keyUp($event)\" attr-placeholder=\"{{ 'START_TYPING' | translate }}\"></autocomplete>\n\t\t\t<button id=\"product_search_button\" ng-click=\"$ctrl.search()\" class=\"product_search_button\" translate=\"SEARCH\"></button>\n\t\t</div>\n\t\t<div class=\"product-search-section__actions\">\n  \t\t\t<button class=\"product-search-section__actions-item\" ng-click=\"$ctrl.switchFilter(true)\" translate=\"FILTER\"></button>\n  \t\t\t<button class=\"product-search-section__actions-item delete\" ng-click=\"$ctrl.clearAll()\" translate=\"RESET_SEARCH\"></button>\n\t\t</div>\n\t\t<div class=\"product-search__placeholder\" ng-class=\"{show: $ctrl.showMobile}\">\n\t\t\t<button class=\"product-search__placeholder-close\" ng-click=\"$ctrl.switchFilter(false)\" translate=\"CLOSE\"></button>\n\t\t\t<product-search-filters></product-search-filters>\n\t\t</div>\n\t</div>\n</section>"
});

exports.ProductSearch = ProductSearch;

},{"../../../app/comp/feature/productSearchFilters":12,"../../../app/comp/feature/productSelectedFilters":15,"../../../app/module/main":42,"../../../app/service/GpcService":43}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

var _appServiceGpcService = require('../../../app/service/GpcService');

require('../../../app/comp/feature/ProductFilterBox');

/**
 * __HtmlTag__: product-search-filters <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSearchPage}
 */

var ProductSearchFilters = (function () {
	function ProductSearchFilters($timeout, $rootScope, productService) {
		_classCallCheck(this, ProductSearchFilters);

		this.$timeout = $timeout;
		this.$rootScope = $rootScope;
		this.productService = productService;
		this.showBlock = false;
		this.desktopSize = 1025;
		this.initFilters();
		this.getFiltersFromHash();
		this.getFiltersFromSession();
	}

	ProductSearchFilters.prototype.$onInit = function $onInit() {
		this.parentCtrl.refSearchFilters(this);
	};

	ProductSearchFilters.prototype.initFilters = function initFilters() {
		this.$rootScope.markets = {};
		this.$rootScope.chemicals = {};
		this.$rootScope.brands = this.$rootScope.dataFilters.ConsolidatedBrands;
		this.$rootScope.zones = this.$rootScope.dataFilters.ConsolidatedZones;
		this.$rootScope.markets.allItems = [{ level: '0', subName: 'GLOBAL', items: this.$rootScope.dataFilters.ConsolidatedMarkets, showLevel: false, levelLoaded: false, selectedItem: false }, { level: '1', subName: 'SEGMENT', items: [], showLevel: false, levelLoaded: false, selectedItem: false }, { level: '2', subName: 'APPLICATION', items: [], showLevel: false, levelLoaded: false, selectedItem: false }];
		this.$rootScope.chemicals.allItems = [{ level: '0', subName: 'CATEGORY', items: this.$rootScope.dataFilters.ConsolidatedChemicals, showLevel: false, levelLoaded: false, selectedItem: false }, { level: '1', subName: 'FAMILY', items: [], showLevel: false, levelLoaded: false, selectedItem: false }, { level: '2', subName: 'PRODUCT', items: [], showLevel: false, levelLoaded: false, selectedItem: false }];
		this.$rootScope.marketsFilter = { order: 1, code: 'markets', name: "MARKETS", color: "red", data: this.$rootScope.markets, active: false };
		this.$rootScope.chemicalsFilter = { order: 2, code: 'chemicals', name: "CHEMICALS", color: "blue", data: this.$rootScope.chemicals, active: false };
		this.$rootScope.brandsFilter = { order: 3, code: 'brands', name: "BRAND", color: "yellow", data: this.$rootScope.brands, active: false };
		this.$rootScope.zonesFilter = { order: 4, code: 'zones', name: "ZONE", color: "purple", data: this.$rootScope.zones, active: false };
		this.$rootScope.filtersMap = {
			markets: this.$rootScope.marketsFilter,
			chemicals: this.$rootScope.chemicalsFilter,
			brands: this.$rootScope.brandsFilter,
			zones: this.$rootScope.zonesFilter
		};
		this.$rootScope.currentFilter = this.$rootScope.filtersMap.markets;
		this.$rootScope.filterBubbles = [];
	};

	ProductSearchFilters.prototype.getFiltersFromHash = function getFiltersFromHash() {
		var _this = this;

		var hash = location.hash.substr(1) + '&' + location.search.substr(1);
		if (hash.indexOf('=') !== -1) {
			if (hash.charAt(0) === '/') {
				hash = hash.substr(1);
			}
			var sinParams = _appServiceGpcService.GpcService.defaultSinParams;
			var params = hash.split('&');
			for (var _iterator = params, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var param = _ref;

				if (param.indexOf('=') !== -1) {
					var keyValue = param.split('=');
					var k = keyValue[0];
					var v = keyValue[1];
					v = v.replace(/_/g, " ");
					v = v.replace(/\(AND\)/g, "&");
					v = v.replace(/\(R\)/g, "®");
					v = v.replace(/\(C\)/g, "©");
					v = v.replace(/\(TM\)/g, "™");
					v = v.replace(/~\(/g, "[");
					v = v.replace(/\)~/g, "]");
					if (k === 'brands') {
						for (var _iterator2 = v.split(';'), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
							var _ref2;

							if (_isArray2) {
								if (_i2 >= _iterator2.length) break;
								_ref2 = _iterator2[_i2++];
							} else {
								_i2 = _iterator2.next();
								if (_i2.done) break;
								_ref2 = _i2.value;
							}

							var i = _ref2;

							sinParams.brandsInfo.push({ name: i });
						}
					}
					if (k === 'markets' || k === 'chemicals') {
						v = '/' + v + '/';
					}
					if (k === 'keywords') {
						k = 'searchTxt';
					}
					sinParams[k] = v;
				}
			}
			sessionStorage.removeItem('sinParams');
			sessionStorage.setItem('sinParams', JSON.stringify(sinParams));
			this.$rootScope.sinequaParams = sinParams;
			this.$timeout(function () {
				window.location.replace(window.location.href.split('#')[0] + '#');
				_this.productService.updateFilters(function (data) {
					_this.$rootScope.sinequaParams.displayedSearchTxtMode = _this.$rootScope.sinequaParams.searchTxt;
				});
			}, 500);
		}
	};

	ProductSearchFilters.prototype.getFiltersFromSession = function getFiltersFromSession() {
		if (sessionStorage.getItem('sinParams') != undefined) {
			this.$rootScope.sinequaParams = JSON.parse(sessionStorage.getItem('sinParams'));
			this.$rootScope.sinequaParams.displayedSearchTxtMode = this.$rootScope.sinequaParams.searchTxt;
			for (var _iterator3 = Object.entries(this.$rootScope.filtersMap), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref3;

				if (_isArray3) {
					if (_i3 >= _iterator3.length) break;
					_ref3 = _iterator3[_i3++];
				} else {
					_i3 = _iterator3.next();
					if (_i3.done) break;
					_ref3 = _i3.value;
				}

				var code = _ref3[0];
				var filter = _ref3[1];

				var selectedValues = ';' + this.$rootScope.sinequaParams[code] + ';';
				if (Array.isArray(filter.data)) {
					for (var _iterator4 = filter.data, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
						var _ref4;

						if (_isArray4) {
							if (_i4 >= _iterator4.length) break;
							_ref4 = _iterator4[_i4++];
						} else {
							_i4 = _iterator4.next();
							if (_i4.done) break;
							_ref4 = _i4.value;
						}

						var item = _ref4;

						var _name = item.name;
						if (item.filterName !== undefined) {
							_name = item.filterName;
						}
						if (selectedValues.indexOf(';' + _name + ';') !== -1) {
							item.active = true;
							var newBubble = { values: [item.name], filter: filter };
							this.$rootScope.filterBubbles.push(newBubble);
						} else {
							item.active = false;
						}
					}
				} else {
					var _selectedValues = this.$rootScope.sinequaParams[code];
					var newBubble = { values: [], filter: filter };
					for (var _iterator5 = filter.data.allItems.entries(), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
						var _ref5;

						if (_isArray5) {
							if (_i5 >= _iterator5.length) break;
							_ref5 = _iterator5[_i5++];
						} else {
							_i5 = _iterator5.next();
							if (_i5.done) break;
							_ref5 = _i5.value;
						}

						var l = _ref5[0];
						var level = _ref5[1];

						var selectedValue = '/' + _selectedValues.split('/')[l + 1] + '/';
						for (var _iterator6 = level.items, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
							var _ref6;

							if (_isArray6) {
								if (_i6 >= _iterator6.length) break;
								_ref6 = _iterator6[_i6++];
							} else {
								_i6 = _iterator6.next();
								if (_i6.done) break;
								_ref6 = _i6.value;
							}

							var item = _ref6;

							if (selectedValue.indexOf('/' + item.name + '/') !== -1) {
								filter.data.allItems[l].selectedItem = true;
								item.active = true;
								newBubble.values.push(item.name);
								if (l < 2) {
									filter.data.allItems[l + 1].showLevel = true;
									filter.data.allItems[l + 1].levelLoaded = true;
									filter.data.allItems[l + 1].items = item.children;
								}
							} else {
								item.active = false;
							}
						}
					}
					if (newBubble.values.length > 0) {
						this.$rootScope.filterBubbles.push(newBubble);
					}
				}
			}
		}
	};

	/**
  * autoscroll on input focus & update perfect-scrollbar
  */

	ProductSearchFilters.prototype.scroll = function scroll() {
		this.parentCtrl.scrollToSearch();
		this.$timeout(function () {
			var pss = $(".ps-container").get();
			for (var _iterator7 = pss, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
				var _ref7;

				if (_isArray7) {
					if (_i7 >= _iterator7.length) break;
					_ref7 = _iterator7[_i7++];
				} else {
					_i7 = _iterator7.next();
					if (_i7.done) break;
					_ref7 = _i7.value;
				}

				var ps = _ref7;

				Ps.update(ps);
			}
		}, 300);
	};

	ProductSearchFilters.prototype['switch'] = function _switch(filter) {
		this.$rootScope.currentFilter = filter;
		if (filter.active === false) {
			for (var _iterator8 = Object.entries(this.$rootScope.filtersMap), _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
				var _ref8;

				if (_isArray8) {
					if (_i8 >= _iterator8.length) break;
					_ref8 = _iterator8[_i8++];
				} else {
					_i8 = _iterator8.next();
					if (_i8.done) break;
					_ref8 = _i8.value;
				}

				var k = _ref8[0];
				var f = _ref8[1];

				f.active = false;
			}
			if (filter.data.allItems !== undefined) {
				filter.data.allItems[0].showLevel = true;
			}
		}
		filter.active = !filter.active; // revert boolean
		this.showBlock = filter.active;
		this.scroll();
	};

	ProductSearchFilters.prototype.closeFilter = function closeFilter(filter) {
		var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var close = true;
		var l = parseInt(level);
		if (filter.data.allItems !== undefined) {
			filter.data.allItems[l].showLevel = false;
			if (l !== 0 || window.innerWidth >= this.desktopSize) {
				close = false;
			}
		}
		if (close) {
			this.showBlock = false;
			filter.active = false;
		}
	};

	ProductSearchFilters.prototype.closeCurrentFilter = function closeCurrentFilter() {
		if (this.$rootScope.currentFilter.active) {
			this['switch'](this.$rootScope.currentFilter);
		}
	};

	ProductSearchFilters.prototype.hideFilters = function hideFilters() {
		this.closeFilter(this.$rootScope.currentFilter);
		this.psCtrl.switchFilter(false);
	};

	return ProductSearchFilters;
})();

_appModuleMain.main.component('productSearchFilters', {
	controller: ProductSearchFilters,
	require: { parentCtrl: '^^productSearchPage', psCtrl: '^productSearch' },
	template: "<div class=\"search-filter-box\">\n\t<span class=\"title\" translate=\"REFINE_BY\"></span>\n\t<ul class=\"search-categories\">\n\t\t<li class=\"search-categories-item {{filter.color}}\" ng-repeat=\"(key, filter) in $ctrl.$rootScope.filtersMap\" ng-click=\"$ctrl.switch(filter)\" ng-class=\"{active: filter.active}\">\n\t\t\t{{filter.name | translate}}\n\t\t</li>\n\t</ul>\n\t<product-filter-box ng-class=\"{show: $ctrl.showBlock}\" filters=\"$ctrl.$rootScope.filtersMap\"></product-filter-box>\n</div>"
});

exports.ProductSearchFilters = ProductSearchFilters;

},{"../../../app/comp/feature/ProductFilterBox":1,"../../../app/module/main":42,"../../../app/service/GpcService":43}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/widget/pagination');

require('../../../app/comp/feature/productSelectedFilters');

/**
 * __HtmlTag__: product-search-results <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSearchPage}
 */

var ProductSearchResults = (function () {
	function ProductSearchResults($rootScope) {
		_classCallCheck(this, ProductSearchResults);

		this.$rootScope = $rootScope;
		this.links = gpc_global_links;
		this.entities = [['amp', '&'], ['apos', '\''], ['lt', '<'], ['gt', '>'], ['nbsp', ' '], ['quot', '"']];
	}

	ProductSearchResults.prototype.redirect = function redirect(productId, productName, anchor) {
		window.location = this.links.detail + '?productId=' + productId + '&productName=' + this.encode(productName) + '#' + anchor;
	};

	ProductSearchResults.prototype.strip = function strip(txt) {
		return this.decodeHTMLEntities(txt).replace(/<(?:.|\n)*?>/gm, ' ');
	};

	ProductSearchResults.prototype.decodeHTMLEntities = function decodeHTMLEntities(t) {
		for (var _iterator = this.entities, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var e = _ref;

			t = t.replace(new RegExp('&' + e[0] + ';', 'g'), e[1]);
		}
		return t;
	};

	ProductSearchResults.prototype.encode = function encode(p) {
		p = p.replace(/ /g, '+');
		p = encodeURI(p);
		p = p.replace(/\,/g, '%2C');
		p = p.replace(/\//g, '%2F');
		p = p.replace(/\(/g, '%28');
		p = p.replace(/\)/g, '%29');
		return p;
	};

	return ProductSearchResults;
})();

_appModuleMain.main.component('productSearchResults', {
	controller: ProductSearchResults,
	template: "<section class=\"product-search-results-section\">\n\t<div class=\"wrap\"> \n\t\t<product-selected-filters></product-selected-filters>\n\t\t<div ng-class=\"{ hide: $ctrl.$rootScope.loading }\" class=\"title\">{{$ctrl.$rootScope.dataFilters.TotalCount}} {{ 'NUMBER_RESULTS' | translate }} <span ng-if=\"$ctrl.$rootScope.sinequaParams.displayedSearchTxtMode\">for «{{$ctrl.$rootScope.sinequaParams.displayedSearchTxtMode}}»</span></div>\n\t\t<div class=\"box\">\n\t\t\t<table class=\"products-table\">\n\t\t\t\t<thead class=\"products-table-head\">\n\t\t\t\t\t<tr class=\"products-table-row\">\n\t\t\t\t\t\t<th class=\"products-table-col\" translate=\"PRODUCT_NAME\"></th>\n\t\t\t\t\t\t<th class=\"products-table-col\" translate=\"DESCRIPTION\"></th>\n\t\t\t\t\t\t<th class=\"products-table-col\"></th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody class=\"products-table-body\">\n\t\t\t\t\t<tr class=\"products-table-row\" ng-repeat=\"product in $ctrl.$rootScope.dataFilters.Products\" >\n\t\t\t\t\t\t<td class=\"products-table-col name\">\n\t\t\t\t\t\t\t<a href=\"{{$ctrl.links.detail}}?productId={{product.id}}&productName={{$ctrl.encode(product.name)}}\">{{product.name}}</a>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"products-table-col description\">\n\t\t\t\t\t\t\t<div ng-bind-html=\"$ctrl.strip(product.description)\"></div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"products-table-col actions\">\n\t\t\t\t\t\t\t<button class=\"button border\" ng-click=\"$ctrl.redirect( product.id, product.name, 'docs' )\">\n\t\t\t\t\t\t\t\tMSDS / SDS\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button class=\"button border\" ng-click=\"$ctrl.redirect( product.id, product.name, 'docs' )\" translate=\"DOCUMENTS\">\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button class=\"icon\" ng-click=\"$ctrl.redirect( product.id, product.name, 'contacts' )\">\n\t\t\t\t\t\t\t\t<i class=\"material-icons\">mail</i>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\n\t\t\t<pagination></pagination>\n\t\t</div>\n\t</div>\n</section>"
});

exports.ProductSearchResults = ProductSearchResults;

},{"../../../app/comp/feature/productSelectedFilters":15,"../../../app/comp/widget/pagination":28,"../../../app/module/main":42}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: product-selected-bubble-box <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductSelectedFilters}
 */

var ProductSelectedBubbleBox = (function () {
	function ProductSelectedBubbleBox($rootScope) {
		_classCallCheck(this, ProductSelectedBubbleBox);

		this.$rootScope = $rootScope;
	}

	ProductSelectedBubbleBox.prototype.decode = function decode(v) {
		return v.replace(/\(slash\)/g, '/');
	};

	return ProductSelectedBubbleBox;
})();

_appModuleMain.main.component('productSelectedBubbleBox', {
	controller: ProductSelectedBubbleBox,
	require: { parentCtrl: '^^productSelectedFilters' },
	template: "<ul class=\"bubble-box\">\n\t<li ng-repeat=\"filterBbl in $ctrl.$rootScope.filterBubbles | orderBy:'filter.order'\" class=\"bubble {{filterBbl.filter.color}}\" ng-show=\"filterBbl.values.length > 0\">\n\t\t<span ng-repeat=\"value in filterBbl.values track by $index\" >\n\t\t\t{{$ctrl.decode(value)}}\n\t\t</span>\n\t\t<button class=\"close\" ng-click=\"$ctrl.parentCtrl.close( filterBbl )\">\n\t\t\t<i class=\"material-icons\">\n\t\t\t\tclose\n\t\t\t</i>\n\t\t</button>\n\t</li>\n</ul>"
});

exports.ProductSelectedBubbleBox = ProductSelectedBubbleBox;

},{"../../../app/module/main":42}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/feature/productSelectedBubbleBox');

/**
 * __HtmlTag__: product-selected-filters <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link productSearchPage}
 */

var ProductSelectedFilters = (function () {
	function ProductSelectedFilters($rootScope, $timeout, productService) {
		_classCallCheck(this, ProductSelectedFilters);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.productService = productService;
	}

	ProductSelectedFilters.prototype.close = function close(filterBbl) {
		this.$rootScope.filterBubbles.splice(this.$rootScope.filterBubbles.indexOf(filterBbl), 1);
		this.$rootScope.sinequaParams[filterBbl.filter.code] = '';
		if (filterBbl.filter.code === 'brands') {
			this.reBuildBrandsParam(filterBbl);
			this.unselect(filterBbl.filter.data, filterBbl.values[0]);
		} else {
			this.unselect(filterBbl.filter.data);
		}
		if (filterBbl.filter.code === 'zones') {
			this.$rootScope.selected = {};
		}
		this.productService.updateFilters(function (data) {}, true);
	};

	ProductSelectedFilters.prototype.unselect = function unselect(data) {
		var singleName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

		if (data.allItems !== undefined) {
			for (var _iterator = Array(3).keys(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var i = _ref;

				this.unselect(data.allItems[i].items);
				data.allItems[i].selectedItem = false;
				if (i > 0) {
					data.allItems[i].showLevel = false;
				}
			}
		} else {
			for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var i = _ref2;

				if (singleName === '' || singleName === i.name) {
					i.active = false;
				}
			}
		}
	};

	ProductSelectedFilters.prototype.reBuildBrandsParam = function reBuildBrandsParam(filterBbl) {
		var rs = this.$rootScope;
		var brandsInfo = rs.sinequaParams.brandsInfo;
		var newBrandsInfo = [];
		var names = [];
		for (var _iterator3 = brandsInfo.entries(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var i = _ref3[0];
			var bf = _ref3[1];

			if (bf.name !== filterBbl.values[0]) {
				names.push(bf.name);
				newBrandsInfo.push(bf);
			}
		}
		rs.sinequaParams.brandsInfo = newBrandsInfo;
		rs.sinequaParams.brands = names.join(';');
	};

	ProductSelectedFilters.prototype.clearAll = function clearAll() {
		if (this.$rootScope.loading) {
			return;
		}
		//unselect & clear sinequaParams & set params to empty
		this.parentCtrl.clearAll();
		//default server call
		this.productService.updateFilters(function (data) {}, true);
	};

	ProductSelectedFilters.prototype.scrollToSearch = function scrollToSearch() {
		this.parentCtrl.scrollToSearch();
	};

	ProductSelectedFilters.prototype.$onInit = function $onInit() {
		this.parentCtrl.refSelectedFilters(this);
		$(window).scroll(function () {
			var nav = $('.fixed-selected-filters');
			if ($(window).scrollTop() > $('.bubble-box').offset().top) {
				nav.addClass('fixed');
			} else {
				nav.removeClass('fixed');
			}
		});
	};

	return ProductSelectedFilters;
})();

_appModuleMain.main.component('productSelectedFilters', {
	controller: ProductSelectedFilters,
	require: { parentCtrl: '^^productSearchPage' },
	template: "<div>\n\t<div class=\"selected-filters\">\n\t\t<product-selected-bubble-box></product-selected-bubble-box>\n\t\t<div class=\"button-box\">\n\t\t\t<div class=\"button\" ng-click=\"$ctrl.clearAll()\">\n\t\t\t\t<i class=\"material-icons\">delete</i>\n\t\t\t\t{{ 'RESET_SEARCH' | translate }}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"fixed-selected-filters\">\n\t\t<div class=\"nb-result\">\n\t\t\t{{$ctrl.$rootScope.dataFilters.TotalCount}} {{ 'NUMBER_RESULTS' | translate }} <span ng-if=\"$ctrl.$rootScope.sinequaParams.searchTxt\">for «{{$ctrl.$rootScope.sinequaParams.searchTxt}}»</span>\n\t\t</div>\n\t\t<product-selected-bubble-box></product-selected-bubble-box>\n\t\t<div class=\"button-box\">\n\t\t\t<div class=\"button\" ng-click=\"$ctrl.scrollToSearch()\">\n\t\t\t\t<i class=\"material-icons\">filter_list</i>\n\t\t\t\t{{ 'REFINE_SEARCH' | translate }}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>"
});

exports.ProductSelectedFilters = ProductSelectedFilters;

},{"../../../app/comp/feature/productSelectedBubbleBox":14,"../../../app/module/main":42}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

var _appServiceYoutubeService = require('../../../app/service/youtubeService');

/**
 * __HtmlTag__: youtubelist <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link }
 */

var YoutubePlaylist = (function () {
    function YoutubePlaylist($rootScope, $timeout, youtubeService) {
        _classCallCheck(this, YoutubePlaylist);

        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.youtubeService = youtubeService;
    }

    YoutubePlaylist.prototype.$onInit = function $onInit() {
        this.$rootScope.youtubelist = [];

        var rs = this.$rootScope.youtubelist;
        console.log("youtube-playlist ready in GPC ");
        var postPlaylistUpdate = function postPlaylistUpdate() {
            // $('.central-youtube-video').css("display", "");
        };

        this.youtubeService.getYoutubePlaylist("", function (data, success) {
            //[TO-DO]: Complete the script

            for (var i = 0; i < 3; i++) {
                if (typeof data.items[i] !== undefined) {
                    rs.push({ "id": data.items[i].snippet.resourceId.videoId, "image": data.items[i].snippet.thumbnails.medium.url, "title": data.items[i].snippet.title, "playlistid": data.items[i].snippet.playlistId });
                }
            }
        });
        //$('.central-youtube-video').css("display", "none");
    };

    YoutubePlaylist.prototype.select = function select(name) {};

    YoutubePlaylist.prototype.updateMe = function updateMe(data) {};

    return YoutubePlaylist;
})();

_appModuleMain.main.component('youtubePlaylistWidget', {
    controller: YoutubePlaylist,
    bindings: { items: '=', title: '@' },
    template: "<section class=\"central-youtube-playlist-section\">\n  <div class=\"central-youtube-playlist\">\n    <div class=\"central-playlis-latest-video-label\">\n      <span class=\"label__title\">\n        LATEST VIDEOS\n      </span>\n    </div>\n    <div class=\"label central-playlis-more-label\">\n      <span class=\"label__title\">\n        MORE VIDEOS\n      </span>\n    </div>\n    <div ng-repeat=\"item in $ctrl.$rootScope.youtubelist\" class=\"youtube-playlist-item\">\n      <a href=\"https://www.youtube.com/watch?v={{item.id}}&list={{item.playlistid}}&index=1\" target=\"_blank\">\n        <figure class=\"main-picture\" id=\"{{item.id}}\">\n          <img id=\"my_image\" alt=\"\" src=\"{{item.image}}\"></img>\n        </figure>\n        <span class=\"playlist-item-title\">{{item.title}}</span>\n      </a>\n    </div>\n  </div>\n</section>"
});

exports.YoutubePlaylist = YoutubePlaylist;

},{"../../../app/module/main":42,"../../../app/service/youtubeService":45}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: text-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var CheckboxFieldWidget = function CheckboxFieldWidget() {
	_classCallCheck(this, CheckboxFieldWidget);
};

_appModuleMain.main.component('checkboxFieldWidget', {
	controller: CheckboxFieldWidget,
	bindings: { label: '@', formValues: '<', config: '<', key: '@', required: '<', maxlength: '@', onChange: '&' },
	template: "<div class=\"form-item\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<input class=\"form-checkboxes\" id=\"{{$ctrl.config[$ctrl.key].name}}\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-required=\"$ctrl.required\" ng-model=\"$ctrl.formValues[$ctrl.key]\" type=\"checkbox\" ng-true-value=\"'yes'\" ng-false-value=\"'no'\" ng-change=\"$ctrl.onChange()\"></input>\n</div>"
});

exports.CheckboxFieldWidget = CheckboxFieldWidget;

},{"../../../app/module/main":42}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: interact-picklist-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var interactPicklistFieldWidget = (function () {
	function interactPicklistFieldWidget($filter) {
		_classCallCheck(this, interactPicklistFieldWidget);

		this.$filter = $filter;
		this.selectedValues = {
			selectedLevel1: '',
			selectedLevel2: '',
			selectedLevel3: ''
		};
	}

	interactPicklistFieldWidget.prototype.$onInit = function $onInit() {
		//  build map for level 2 and level 3 list
		this.mapLevel2 = {};
		this.mapLevel3 = {};
		// build tree
		this.listLevel1 = [];
		this.listLevel2 = [];
		this.listLevel3 = [];

		var level1Name = this.levelKeys[0];
		var level2Name = this.levelKeys[1];
		var level3Name = this.levelKeys[2];
		var level3Code = this.levelKeys[3];
		var orderedValues = this.$filter('orderBy')(this.config[this.key].values, [level1Name, level2Name, level3Name]);
		var level1 = [];
		var level2 = [];
		var level3 = [];
		var spacer = "---- ";
		for (var i = 0; i < orderedValues.length; i++) {
			if (level1.indexOf(orderedValues[i][level1Name]) === -1) {
				level2 = []; // reset level2
				this.mapLevel2[orderedValues[i][level1Name]] = [];
				level1.push(orderedValues[i][level1Name]);
				this.listLevel1.push({ "label": orderedValues[i][level1Name], "value": orderedValues[i][level1Name], "disabled": false, 'class': "level1" });
			}
			if (level2.indexOf(orderedValues[i][level2Name]) === -1) {
				level2.push(orderedValues[i][level2Name]);
				this.mapLevel2[orderedValues[i][level1Name]].push(orderedValues[i][level2Name]);
			}
			if (typeof this.mapLevel3[orderedValues[i][level2Name]] === 'undefined') {
				this.mapLevel3[orderedValues[i][level2Name]] = [];
			}
			this.mapLevel3[orderedValues[i][level2Name]].push({ "label": orderedValues[i][level3Name], "value": orderedValues[i][level3Code], "disabled": false, 'class': "level3" });
		}
	};

	interactPicklistFieldWidget.prototype.changeLevel1 = function changeLevel1(itemSelected) {
		this.listLevel2 = [];
		this.listLevel3 = [];
		for (var i = 0; i < this.mapLevel2[itemSelected].length; i++) {
			this.listLevel2.push({ "label": this.mapLevel2[itemSelected][i], "value": this.mapLevel2[itemSelected][i], "disabled": false, 'class': "level2" });
		}
	};

	interactPicklistFieldWidget.prototype.changeLevel2 = function changeLevel2(itemSelected) {
		this.listLevel3 = [];
		for (var i = 0; i < this.mapLevel3[itemSelected].length; i++) {
			this.listLevel3.push({ "label": this.mapLevel3[itemSelected][i]["label"], "value": this.mapLevel3[itemSelected][i]["value"], "disabled": false, 'class': "level3" });
		}
	};

	interactPicklistFieldWidget.prototype.changeLevel3 = function changeLevel3() {};

	return interactPicklistFieldWidget;
})();

_appModuleMain.main.component('interactPicklistFieldWidget', {
	controller: interactPicklistFieldWidget,
	bindings: { label: '@', formValues: '<', config: '<', key: '@', required: '<', type: '@', levelKeys: '<' },
	template: "<div class=\"form-item\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<select ng-if=\"$ctrl.type==='simple'\" class=\"form-select\" name=\"{{$ctrl.config[$ctrl.key].name}}+level1\" ng-model=\"$ctrl.selectedValues['selectedLevel1']\" ng-required=\"$ctrl.required\" ng-change=\"$ctrl.changeLevel1($ctrl.selectedValues['selectedLevel1'])\">\n\t\t<option ng-repeat=\"item in $ctrl.listLevel1\" label=\"{{item.label}}\" value=\"{{item.value}}\" ng-disabled=\"item.disabled\" class=\"{{item.class}}\">{{item.label}}</option>\n\t</select>\n\t<select ng-if=\"$ctrl.type==='simple' && $ctrl.selectedValues['selectedLevel1'] !=='' \" class=\"form-select\" name=\"{{$ctrl.config[$ctrl.key].name}}+level2\" ng-model=\"$ctrl.selectedValues['selectedLevel2']\" ng-required=\"$ctrl.required\" ng-change=\"$ctrl.changeLevel2($ctrl.selectedValues['selectedLevel2'])\">\n\t\t<option ng-repeat=\"item in $ctrl.listLevel2\" label=\"{{item.label}}\" value=\"{{item.value}}\" ng-disabled=\"item.disabled\" class=\"{{item.class}}\">{{item.label}}</option>\n\t</select>\n\t<select ng-if=\"$ctrl.type==='simple'  && $ctrl.selectedValues['selectedLevel2'] !=='' \" class=\"form-select\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-model=\"$ctrl.formValues[$ctrl.key]\" ng-required=\"$ctrl.required\" ng-change=\"$ctrl.changeLevel3()\">\n\t\t<option ng-repeat=\"item in $ctrl.listLevel3\" label=\"{{item.label}}\" value=\"{{item.value}}\" ng-disabled=\"item.disabled\" class=\"{{item.class}}\">{{item.label}}</option>\n\t</select>\n</div>"
});

exports.interactPicklistFieldWidget = interactPicklistFieldWidget;

},{"../../../app/module/main":42}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: number-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var NumberFieldWidget = (function () {
  function NumberFieldWidget() {
    _classCallCheck(this, NumberFieldWidget);

    this.field = null;
  }

  NumberFieldWidget.prototype.isNumberKey = function isNumberKey(evt) {
    /*var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 
      && (charCode < 48 || charCode > 57))
     event.preventDefault();*/
    // "/^[0-9]{1,6}\.{0,1}[0-9]{0,3}$/"
  };

  return NumberFieldWidget;
})();

_appModuleMain.main.component('numberFieldWidget', {
  controller: NumberFieldWidget,
  bindings: { label: '@', formValues: '<', config: '<', key: '@', required: '<', maxlength: '@', min: '@', max: '@', onChange: '&' },
  template: "<div class=\"form-item\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<input class=\"form-text\" id=\"{{$ctrl.config[$ctrl.key].name}}\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-required=\"$ctrl.required\" ng-model=\"$ctrl.formValues[$ctrl.key]\" ng-keypress=\"$ctrl.isNumberKey($event)\" \n        type=\"number\" step=\"any\" min=\"{{$ctrl.min}}\" max=\"{{$ctrl.max}}\" ng-min=\"{{$ctrl.min}}\" ng-max=\"{{$ctrl.max}}\"></input>\n</div>"
});

exports.NumberFieldWidget = NumberFieldWidget;

},{"../../../app/module/main":42}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: picklist-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var PicklistFieldWidget = (function () {
	function PicklistFieldWidget($filter) {
		_classCallCheck(this, PicklistFieldWidget);

		this.$filter = $filter;
	}

	PicklistFieldWidget.prototype.$onInit = function $onInit() {
		// build tree
		this.list = [];
		/*
  for (let i = 0; i < this.config[this.key].values.length; i++) {
  	if(this.config[this.key].marketName === this.boxCodesName){
  		boxItems = this.boxes[i].Items
  		break
  	}
  }
  */
		var level1Name = this.levelKeys[0];
		var level2Name = this.levelKeys[1];
		var level3Name = this.levelKeys[2];
		var level3Code = this.levelKeys[3];
		var orderedValues = this.$filter('orderBy')(this.config[this.key].values, [level1Name, level2Name, level3Name]);
		var level1 = [];
		var level2 = [];
		var level3 = [];
		var spacer = "---- ";
		for (var i = 0; i < orderedValues.length; i++) {
			if (level1.indexOf(orderedValues[i][level1Name]) === -1) {
				level2 = []; // reset level2
				level1.push(orderedValues[i][level1Name]);
				this.list.push({ "label": orderedValues[i][level1Name], "value": orderedValues[i][level1Name], "disabled": true, 'class': "level1" });
			}
			if (level2.indexOf(orderedValues[i][level2Name]) === -1) {
				level2.push(orderedValues[i][level2Name]);
				this.list.push({ "label": spacer + orderedValues[i][level2Name], "value": orderedValues[i][level2Name], "disabled": true, 'class': "level2" });
			}
			this.list.push({ "label": spacer + spacer + orderedValues[i][level3Name], "value": orderedValues[i][level3Code], "disabled": false, 'class': "level3" });
		}
	};

	return PicklistFieldWidget;
})();

_appModuleMain.main.component('picklistFieldWidget', {
	controller: PicklistFieldWidget,
	bindings: { label: '@', formValues: '<', config: '<', key: '@', required: '<', type: '@', onChange: '&', levelKeys: '<' },
	template: "<div class=\"form-item\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<select ng-if=\"$ctrl.type==='simple'\" class=\"form-select\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-model=\"$ctrl.formValues[$ctrl.key]\" ng-required=\"$ctrl.required\" ng-change=\"$ctrl.onChange()\">\n\t\t<option ng-repeat=\"item in $ctrl.list\" label=\"{{item.label}}\" value=\"{{item.value}}\" ng-disabled=\"item.disabled\" class=\"{{item.class}}\">{{item.label}}</option>\n\t</select>\n</div>"
});

exports.PicklistFieldWidget = PicklistFieldWidget;

},{"../../../app/module/main":42}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: select-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var SelectFieldWidget = function SelectFieldWidget() {
	_classCallCheck(this, SelectFieldWidget);
};

_appModuleMain.main.component('selectFieldWidget', {
	controller: SelectFieldWidget,
	bindings: { label: '@', formValues: '<', config: '<', key: '@', values: '<', required: '<', type: '@', onChange: '&' },
	template: "<div class=\"form-item\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<select ng-if=\"$ctrl.type==='simple'\" class=\"form-select\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-model=\"$ctrl.formValues[$ctrl.key]\" ng-required=\"$ctrl.required\" ng-options=\"item.label for item in $ctrl.config[$ctrl.key].values track by item.value\"  ng-change=\"$ctrl.onChange()\"></select>\n\t<select multiple ng-if=\"$ctrl.type==='multiple'\" class=\"form-select\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-model=\"$ctrl.formValues[$ctrl.key]\" ng-required=\"$ctrl.required\" ng-options=\"item.label for item in $ctrl.config[$ctrl.key].values track by item.value\"  ng-change=\"$ctrl.onChange()\"></select>\n</div>"
});

exports.SelectFieldWidget = SelectFieldWidget;

},{"../../../app/module/main":42}],22:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: text-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var TextFieldWidget = function TextFieldWidget() {
	_classCallCheck(this, TextFieldWidget);
};

_appModuleMain.main.component('textFieldWidget', {
	controller: TextFieldWidget,
	bindings: { label: '@', formValues: '<', config: '<', key: '@', required: '<', maxlength: '@', pattern: '@', type: '@', onChange: '&' },
	template: "<div class=\"form-item\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<input ng-if=\"$ctrl.type==='text'||$ctrl.type==='email'\" class=\"form-text\" id=\"{{$ctrl.config[$ctrl.key].name}}\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-required=\"$ctrl.required\" ng-model=\"$ctrl.formValues[$ctrl.key]\" type=\"{{$ctrl.type}}\" maxlength=\"{{$ctrl.maxLength}}\" ng-pattern=\"$ctrl.pattern\" ng-change=\"$ctrl.onChange()\"></input>\n\t<textarea ng-if=\"$ctrl.type==='textarea'\" class=\"form-text\" id=\"{{$ctrl.config[$ctrl.key].name}}\" name=\"{{$ctrl.config[$ctrl.key].name}}\" ng-required=\"$ctrl.required\" ng-model=\"$ctrl.formValues[$ctrl.key]\" maxlength=\"{{$ctrl.maxlength}}\" cols=\"30\" rows=\"10\" ng-change=\"$ctrl.onChange()\"></textarea>\n</div>"
});

exports.TextFieldWidget = TextFieldWidget;

},{"../../../app/module/main":42}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: volume-field-widget <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductFormPage} 
 */

var VolumeFieldWidget = (function () {
  function VolumeFieldWidget() {
    _classCallCheck(this, VolumeFieldWidget);

    this.field = null;
  }

  VolumeFieldWidget.prototype.isNumberKey = function isNumberKey(evt) {
    /*var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 
      && (charCode < 48 || charCode > 57))
     event.preventDefault();*/
    // "/^[0-9]{1,6}\.{0,1}[0-9]{0,3}$/"
  };

  return VolumeFieldWidget;
})();

_appModuleMain.main.component('volumeFieldWidget', {
  controller: VolumeFieldWidget,
  bindings: { label: '@', formValues: '<', config: '<', key: '@', volumeKey: '@', unitKey: '@', required: '<', maxlength: '@', min: '@', max: '@', onChange: '&' },
  template: "<div class=\"form-item volume\">\n\t<label ng-required=\"$ctrl.required\">{{$ctrl.label}}</label>\n\t<select class=\"form-select\" name=\"{{$ctrl.config[$ctrl.unitKey].name}}\" ng-model=\"$ctrl.formValues[$ctrl.unitKey]\" ng-required=\"$ctrl.required\" ng-options=\"item.label for item in $ctrl.config[$ctrl.unitKey].values track by item.value\"  ng-change=\"$ctrl.onChange()\">\n    \t<option value=\"\">{{'UNIT_SELECTION' | translate}}</option>\n    </select>\n    <input class=\"form-text\" type=\"number\" step=\"any\" min=\"{{$ctrl.min}}\" max=\"{{$ctrl.max}}\" id=\"{{$ctrl.config[$ctrl.volumeKey].name}}\" name=\"{{$ctrl.config[$ctrl.volumeKey].name}}\" ng-required=\"$ctrl.required\" ng-model=\"$ctrl.formValues[$ctrl.volumeKey]\" ng-keypress=\"$ctrl.isNumberKey($event)\" ng-min=\"{{$ctrl.min}}\" ng-max=\"{{$ctrl.max}}\" ng-change=\"$ctrl.onChange()\"></input>\n</div>"
});

exports.VolumeFieldWidget = VolumeFieldWidget;

},{"../../../app/module/main":42}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/feature/productDetail');

require('../../../app/comp/feature/otherProducts');

require('../../../app/comp/feature/contactList');

require('../../../app/comp/feature/fixedLinks');

require('../../../app/comp/feature/downloadDocs');

/**
 * __HtmlTag__: product-detail-page <br/>
 * __Dependencies__: {@link main}, {@link BreadcrumbList} <br/>
 * __Used by__: {@link RouteProvider} (gpc.js)
 */

var ProductDetailPage = function ProductDetailPage($location, $cookies) {
	_classCallCheck(this, ProductDetailPage);

	this.$cookies = $cookies;
	this.product = gpc_global_var.product;
};

_appModuleMain.main.component('productDetailPage', {
	controller: ProductDetailPage,
	transclude: {
		spotlight: '?spotlight'
	},
	template: "<div>\n\t<product-detail product=\"$ctrl.product\"></product-detail>\n\t<download-docs></download-docs>\n\t<contact-list></contact-list>\n\t<div ng-transclude=\"spotlight\"></div>\n\t<other-products></other-products>\n</div>"
});

exports.ProductDetailPage = ProductDetailPage;

},{"../../../app/comp/feature/contactList":2,"../../../app/comp/feature/downloadDocs":3,"../../../app/comp/feature/fixedLinks":4,"../../../app/comp/feature/otherProducts":5,"../../../app/comp/feature/productDetail":6,"../../../app/module/main":42}],25:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/formFields/selectFieldWidget');

require('../../../app/comp/formFields/textFieldWidget');

require('../../../app/comp/formFields/checkboxFieldWidget');

require('../../../app/comp/formFields/picklistFieldWidget');

require('../../../app/comp/formFields/interactPicklistFieldWidget');

require('../../../app/comp/formFields/numberFieldWidget');

require('../../../app/comp/formFields/volumeFieldWidget');

/**
 * __HtmlTag__: product-form-page <br/>
 * __Dependencies__: {@link main}, {@link SelectFieldWidget}, {@link TextFieldWidget}, {@link CheckboxFieldWidget}, {@link PicklistFieldWidget}, {@link NumberFieldWidget}, {@link VolumeFieldWidget} <br/>
 * __Used by__: {@link RouteProvider} (gpc.js)
 */

var ProductFormPage = (function () {
	function ProductFormPage() {
		_classCallCheck(this, ProductFormPage);

		this.config = formConfig.referentialData;
		this.defaultValues = formConfig.defaultValues;
		this.hostName = document.location.hostname;
		this.webfactory = false;
		try {
			this.sfdcWebsiteOrigin = document.getElementById("sfdcWebsiteOrigin").value;
		} catch (err) {
			this.sfdcWebsiteOrigin = '';
		}

		this.formValues = {
			subject: this.defaultValues.requestType.value,
			description: '',
			salutation: '',
			firstName: '',
			lastName: '',
			language: null,
			whoYouAre: null,
			companyOrganization: '',
			country: null,
			city: '',
			street: '',
			sameShipToLocation: 'yes',
			shipToLocationStreet: '',
			shipToLocationCity: '',
			shipToLocationCountry: null,
			department: null,
			zfunction: null,
			email: '',
			phone: '',
			requestType: this.defaultValues.requestType.value,
			type: this.defaultValues.type.value,
			application: '',
			endUse: '',
			evaluationGoal: null,
			volume: 0,
			unitSelection: null,
			unitSelectionAnnual: null,
			whenProductUsed: null,
			annualVolume: '',
			approvalRequired: null,
			approvalRequiredComment: '',
			productFamily: '',
			solvayBusiness: { "label": this.defaultValues.solvayBusiness.value, "value": this.defaultValues.solvayBusiness.value },
			documents: [],
			sampleProductComment: '',
			question: '',
			productCode: this.defaultValues.productCode.value,
			productLabel: this.defaultValues.productLabel.value,
			captchaResponse: '',
			websiteOrigin: this.sfdcWebsiteOrigin
		};
		if ($("#isWebfactorySite").length > 0) {
			this.formValues['solvayBusiness'].label = this.formValues.websiteOrigin;
			this.formValues['solvayBusiness'].value = this.formValues.websiteOrigin;
		}
	}

	ProductFormPage.prototype.$onInit = function $onInit() {

		//Do this only for webfactory with "General Request", continue as usual if not the case
		if ($("#isWebfactorySite").length > 0) {
			this.webfactory = true;
			switch (this.defaultValues.requestType.value) {
				case 'General Request':
					this.fields = ['question', 'salutation'];
					return;
					break;
			}
		}

		switch (this.defaultValues.requestType.value) {
			case 'Sample':
				this.fields = ['shipToLocation', 'application', 'endUse', 'evaluationGoal', 'volume', 'whenProductUsed', 'question'];
				break;
			case 'Quotation':
				this.fields = ['application', 'endUse', 'volume', 'approval', 'question'];
				break;
			case 'Documentation':
				this.fields = ['application', 'endUse', 'documents', 'question'];
				break;
			case 'Product Inquiry':
				this.fields = ['application', 'endUse', 'question'];
				break;
			case 'General Request':
				this.fields = ['application', 'endUse', 'productFamily', 'solvayBusiness', 'question'];
				break;
			default:
				this.fields = [];
				break;
		}
	};

	ProductFormPage.prototype.display = function display(fieldName) {
		return this.fields.indexOf(fieldName) !== -1;
	};

	ProductFormPage.prototype.changeSampleProductComment = function changeSampleProductComment() {
		this.formValues.sampleProductComment = "";
		if (this.formValues.evaluationGoal !== null) {
			this.formValues.sampleProductComment += "\Evaluation goal:\n" + this.formValues.evaluationGoal.value;
		}
		if (this.formValues.annualVolume !== "") {
			this.formValues.sampleProductComment += "\nAnnual Volume: " + this.formValues.annualVolume;
		}
		if (this.formValues.unitSelectionAnnual !== null) {
			this.formValues.sampleProductComment += " " + this.formValues.unitSelectionAnnual.value;
		}
	};

	ProductFormPage.prototype.changeDescription = function changeDescription() {
		this.formValues.description = "";
		if (this.formValues.approvalRequiredComment !== "") {
			this.formValues.description += "\nRequired approval or specification:\n" + this.formValues.approvalRequiredComment;
		}
		if (this.formValues.productFamily !== "") {
			this.formValues.description += "\nProduct Family: " + this.formValues.productFamily;
		}
		if (this.formValues.question !== "") {
			this.formValues.description += "\nQuestion:\n" + this.formValues.question;
		}
	};

	ProductFormPage.prototype.changeSubject = function changeSubject() {
		this.formValues.subject = this.defaultValues.requestType.value;
		if (this.formValues.documents.length > 0) {
			for (var i = 0; i < this.formValues.documents.length; i++) {
				this.formValues.subject += " - " + this.formValues.documents[i].value;
			}
		}
	};

	ProductFormPage.prototype.isGeneralRequest = function isGeneralRequest() {
		return this.defaultValues.requestType.value === 'General Request';
	};

	return ProductFormPage;
})();

_appModuleMain.main.component('productFormPage', {
	controller: ProductFormPage,
	bindings: {},
	template: "<form action=\"\" method=\"POST\" name=\"productform\" class=\"product-form\">\n\n\t<h2 translate=\"YOUR_REQUEST\"></h2>\n\t\n\t<interact-picklist-field-widget label=\"{{'APPLICATION' | translate}}\" form-values=\"$ctrl.formValues\" key=\"application\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('application')\" type=\"simple\" required=\"$ctrl.isGeneralRequest()\" level-keys=\"['marketName','segmentName','applicationName','applicationCode']\"></interact-picklist-field-widget>\n\t\n\t<text-field-widget label=\"{{'END_USE' | translate}}\" form-values=\"$ctrl.formValues\" key=\"endUse\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('endUse')\" type=\"textarea\" required=\"false\"></text-field-widget>\n\t\n\t<select-field-widget label=\"{{'EVALUATION_GOAL' | translate}}\" form-values=\"$ctrl.formValues\" key=\"evaluationGoal\" config=\"$ctrl.config\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('evaluationGoal')\" type=\"simple\" required=\"true\" on-change=\"$ctrl.changeSampleProductComment()\"></select-field-widget>\n\t\n\t<volume-field-widget label=\"{{'VOLUME' | translate}}\" form-values=\"$ctrl.formValues\" key=\"volume\" volume-key=\"volume\" unit-key=\"unitSelection\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('volume')\" type=\"simple\" required=\"true\"></volume-field-widget>\n\t\n\t<select-field-widget label=\"{{'WHEN_PRODUCT_USED' | translate}}\" form-values=\"$ctrl.formValues\" key=\"whenProductUsed\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('whenProductUsed')\" type=\"simple\" required=\"true\"></select-field-widget>\n\t\n\t<volume-field-widget label=\"{{'ANNUAL_VOLUME' | translate}}\" form-values=\"$ctrl.formValues\" key=\"annualVolume\" volume-key=\"annualVolume\" unit-key=\"unitSelectionAnnual\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('volume')\" type=\"simple\" required=\"true\" on-change=\"$ctrl.changeSampleProductComment()\"></volume-field-widget>\n\t\n\t<select-field-widget label=\"{{'APPROVAL_REQUIRED' | translate}}\" form-values=\"$ctrl.formValues\" key=\"approvalRequired\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('approval')\" type=\"simple\" required=\"false\"></select-field-widget>\n\t<text-field-widget label=\"{{'APPROVAL_COMMENT' | translate}}\" form-values=\"$ctrl.formValues\" key=\"approvalRequiredComment\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('approval')\" type=\"textarea\" required=\"$ctrl.formValues.approvalRequired==='yes'\" ng-hide=\"$ctrl.formValues.approvalRequired==='no'\" on-change=\"$ctrl.changeDescription()\"></text-field-widget>\n\t\n\t<picklist-field-widget label=\"{{'PRODUCT_FAMILY' | translate}}\" form-values=\"$ctrl.formValues\" key=\"productFamily\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('productFamily')\" type=\"simple\" required=\"false\"  level-keys=\"['chemicalCategoryName','chemicalFamilyName','chemicalProductName','chemicalProductName']\" on-change=\"$ctrl.changeDescription()\"></picklist-field-widget>\n\t\n\t<select-field-widget label=\"{{'SOLVAY_BUSINESS' | translate}}\" form-values=\"$ctrl.formValues\" key=\"solvayBusiness\" config=\"$ctrl.config\" type=\"simple\" ng-hide=\"!$ctrl.isGeneralRequest() || $ctrl.webfactory == true\" required=\"false\"></select-field-widget>\n\n\n\t<select-field-widget label=\"{{'DOCUMENTS' | translate}}\" form-values=\"$ctrl.formValues\" key=\"documents\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('documents')\" type=\"multiple\" required=\"true\" on-change=\"$ctrl.changeSubject()\"></select-field-widget>\n\t\n\t<text-field-widget label=\"{{'QUESTION' | translate}}\" form-values=\"$ctrl.formValues\" key=\"question\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('question')\" type=\"textarea\" required=\"true\" on-change=\"$ctrl.changeDescription()\"></text-field-widget>\n\t\n\n\t<h2 translate=\"YOUR_IDENTITY\"></h2>\n\n\t<select-field-widget label=\"{{'SALUTATION' | translate}}\" form-values=\"$ctrl.formValues\" key=\"salutation\" config=\"$ctrl.config\" type=\"simple\" ng-if=\"$ctrl.display('salutation')\"></select-field-widget>\n\n\t<text-field-widget label=\"{{'FIRST_NAME' | translate}}\" form-values=\"$ctrl.formValues\" key=\"firstName\" config=\"$ctrl.config\" type=\"text\" required=\"true\"></text-field-widget>\n\t<text-field-widget label=\"{{'LAST_NAME' | translate}}\" form-values=\"$ctrl.formValues\" key=\"lastName\" config=\"$ctrl.config\" type=\"text\" required=\"true\"></text-field-widget>\n\t\n\t<select-field-widget label=\"{{'LANGUAGE' | translate}}\" form-values=\"$ctrl.formValues\" key=\"language\" config=\"$ctrl.config\" type=\"simple\" required=\"true\"></select-field-widget>\n\t\n\t<select-field-widget label=\"{{'WHO_YOU_ARE' | translate}}\" form-values=\"$ctrl.formValues\" key=\"whoYouAre\" config=\"$ctrl.config\" type=\"simple\" required=\"!$ctrl.webfactory\"></select-field-widget>\n\t\n\t<text-field-widget label=\"{{'COMPANY_ORGANISATION' | translate}}\" form-values=\"$ctrl.formValues\" key=\"companyOrganization\" config=\"$ctrl.config\" type=\"text\" required=\"true\"></text-field-widget>\n\t\n\t<select-field-widget label=\"{{'COUNTRY' | translate}}\" form-values=\"$ctrl.formValues\" key=\"country\" config=\"$ctrl.config\" type=\"simple\" required=\"true\"></select-field-widget>\n\t<text-field-widget label=\"{{'CITY' | translate}}\" form-values=\"$ctrl.formValues\" key=\"city\" config=\"$ctrl.config\" type=\"text\" required=\"false\"></text-field-widget>\n\t<text-field-widget label=\"{{'STREET' | translate}}\" form-values=\"$ctrl.formValues\" key=\"street\" config=\"$ctrl.config\" type=\"text\" required=\"false\"></text-field-widget>\n\n\t<checkbox-field-widget label=\"{{'SAME_SHIP_TO_LOCATION' | translate}}\" form-values=\"$ctrl.formValues\" key=\"sameShipToLocation\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('shipToLocation')\" required=\"false\"></checkbox-field-widget>\n\t<select-field-widget label=\"{{'SHIP_TO_COUNTRY' | translate}}\" form-values=\"$ctrl.formValues\" key=\"shipToLocationCountry\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('shipToLocation')\" type=\"simple\" required=\"$ctrl.formValues.sameShipToLocation===undefined || $ctrl.formValues.sameShipToLocation==='no'\" ng-hide=\"$ctrl.formValues.sameShipToLocation==='yes'\"></select-field-widget>\n\t<text-field-widget label=\"{{'SHIP_TO_CITY' | translate}}\" form-values=\"$ctrl.formValues\" key=\"shipToLocationCity\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('shipToLocation')\" type=\"text\" required=\"$ctrl.formValues.sameShipToLocation===undefined || $ctrl.formValues.sameShipToLocation==='no'\" ng-hide=\"$ctrl.formValues.sameShipToLocation==='yes'\"></text-field-widget>\n\t<text-field-widget label=\"{{'SHIP_TO_STREET' | translate}}\" form-values=\"$ctrl.formValues\" key=\"shipToLocationStreet\" config=\"$ctrl.config\" ng-if=\"$ctrl.display('shipToLocation')\" type=\"text\" required=\"$ctrl.formValues.sameShipToLocation===undefined || $ctrl.formValues.sameShipToLocation==='no'\" ng-hide=\"$ctrl.formValues.sameShipToLocation==='yes'\"></text-field-widget>\n\t\n\t<select-field-widget label=\"{{'DEPARTMENT' | translate}}\" form-values=\"$ctrl.formValues\" key=\"department\" config=\"$ctrl.config\" type=\"simple\" required=\"!$ctrl.webfactory\"></select-field-widget>\n\t<select-field-widget label=\"{{'FUNCTION' | translate}}\" form-values=\"$ctrl.formValues\" key=\"zfunction\" config=\"$ctrl.config\" type=\"simple\" required=\"!$ctrl.webfactory\"></select-field-widget>\n\n\t<text-field-widget label=\"{{'EMAIL' | translate}}\" form-values=\"$ctrl.formValues\" key=\"email\" config=\"$ctrl.config\" type=\"email\" required=\"true\"></text-field-widget>\n\t<text-field-widget label=\"{{'PHONE' | translate}}\" form-values=\"$ctrl.formValues\" key=\"phone\" config=\"$ctrl.config\" type=\"text\" required=\"false\"></text-field-widget>\n\n\t\n\t<input type=\"hidden\" name=\"{{$ctrl.config.sampleProductComment.name}}\" value=\"{{$ctrl.formValues.sampleProductComment}}\"/>\n\t<input type=\"hidden\" name=\"description\" value=\"{{$ctrl.formValues.description}}\"/> \n\t<input type=\"hidden\" name=\"subject\" value=\"{{$ctrl.formValues.subject}}\"/>\n\t<input type=\"hidden\" name=\"{{$ctrl.config.requestType.name}}\" value=\"{{$ctrl.formValues.requestType}}\"/> \n\t<input type=\"hidden\" name=\"{{$ctrl.config.type.name}}\" value=\"{{$ctrl.formValues.type}}\"/>\n\t<input type=\"hidden\" name=\"{{$ctrl.config.productCode.name}}\" value=\"{{$ctrl.formValues.productCode}}\"/>\n\t<input type=\"hidden\" name=\"{{$ctrl.config.productLabel.name}}\" value=\"{{$ctrl.formValues.productLabel}}\"/>\t\t\n\t<input type=\"hidden\" name=\"captchaResponse\" id=\"captchaResponse\"/>\n\t<input type=\"hidden\" name=\"{{$ctrl.config.websiteOrigin.name}}\" value=\"{{$ctrl.formValues.websiteOrigin}}\"/>\t\t\t\n\n\t<div class=\"g-recaptcha\" data-sitekey=\"{{$ctrl.config.recaptcha.siteKey}}\" data-callback='validateform'></div>\n\t<script src='https://www.google.com/recaptcha/api.js'></script>\n\t<script type='text/javascript'>\n        document.getElementById(\"submit\").disabled = true;\n        function validateform(response){\n            var captcha_response = grecaptcha.getResponse();\n            if(captcha_response.length == 0)\n            {\n                alert('Problem on loading, please try again from the mail in your inbox');\n            }\n            else\n            {\n                document.getElementById(\"submit\").disabled = false;\n                document.getElementById(\"captchaResponse\").value = captcha_response; \n            }\n        }\n    </script>\n    \n\t<div class=\"form-buttons\">\n\t\t<button class=\"button regular\" id=\"cancel\" onclick=\"history.go(-1);\" type=\"reset\" value=\"cancel\">Cancel</button>\n\t\t<button class=\"button highlight\" id=\"submit\" name=\"method:execute\" type=\"submit\" value=\"submit\">Submit</button>\n\t</div>\t\n</form>"
});

exports.ProductFormPage = ProductFormPage;

},{"../../../app/comp/formFields/checkboxFieldWidget":17,"../../../app/comp/formFields/interactPicklistFieldWidget":18,"../../../app/comp/formFields/numberFieldWidget":19,"../../../app/comp/formFields/picklistFieldWidget":20,"../../../app/comp/formFields/selectFieldWidget":21,"../../../app/comp/formFields/textFieldWidget":22,"../../../app/comp/formFields/volumeFieldWidget":23,"../../../app/module/main":42}],26:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

require('../../../app/comp/feature/productSearch');

require('../../../app/comp/feature/productSearchResults');

require('../../../app/comp/feature/otherProducts');

require('../../../app/comp/feature/productNotFind');

/** 
 * __HtmlTag__: product-search-page <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link RouteProvider} (gpc.js)
 */

var ProductSearchPage = (function () {
	function ProductSearchPage($location, $cookies, $rootScope, productService) {
		_classCallCheck(this, ProductSearchPage);

		this.$rootScope = $rootScope;
		this.productService = productService; // init dataFilters
	}

	ProductSearchPage.prototype.$onInit = function $onInit() {
		$('#share').remove();
	};

	ProductSearchPage.prototype.refSelectedFilters = function refSelectedFilters(comp) {
		this.selectedFilters = comp;
	};

	ProductSearchPage.prototype.refSearchFilters = function refSearchFilters(comp) {
		this.searchFilters = comp;
	};

	ProductSearchPage.prototype.clearAll = function clearAll() {
		var clearSearchTxt = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

		this.$rootScope.searchBrand = '';
		//unselect & clear sinequaParams
		for (var _iterator = Object.entries(this.$rootScope.filtersMap), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var k = _ref[0];
			var f = _ref[1];

			this.selectedFilters.unselect(f.data);
			this.$rootScope.sinequaParams[k] = '';
		}
		//set params to empty
		this.$rootScope.sinequaParams.brandsInfo = [];
		this.$rootScope.sinequaParams.displayedSearchTxtMode = '';
		if (clearSearchTxt) {
			this.$rootScope.sinequaParams.searchTxt = '';
			this.$rootScope.searchKeys = [];
		}
		this.$rootScope.dataFilters.PageCount = '';
		this.$rootScope.filterBubbles = [];
		this.searchFilters.scroll();
	};

	ProductSearchPage.prototype.scrollToSearch = function scrollToSearch() {
		var topPosition = $('product-search').offset().top;
		$('.header-layout').addClass('hide-on-scroll');
		$('html, body').animate({ scrollTop: topPosition }, 400, function () {
			$('.header-layout').addClass('hide');
			$('.header-layout').removeClass('hide-on-scroll');
		});
	};

	return ProductSearchPage;
})();

_appModuleMain.main.component('productSearchPage', {
	controller: ProductSearchPage,
	template: "<div ng-if=\"$ctrl.$rootScope.dataFilters !== undefined\">\n\t<product-search></product-search>\n\t<product-search-results></product-search-results>\n\t<product-not-find></product-not-find>\n\t<other-products></other-products>\n</div>"
});

exports.ProductSearchPage = ProductSearchPage;

},{"../../../app/comp/feature/otherProducts":5,"../../../app/comp/feature/productNotFind":10,"../../../app/comp/feature/productSearch":11,"../../../app/comp/feature/productSearchResults":13,"../../../app/module/main":42}],27:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: breadcrumb-list <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var BreadcrumbList = (function () {
	function BreadcrumbList() {
		_classCallCheck(this, BreadcrumbList);
	}

	BreadcrumbList.prototype.$onInit = function $onInit() {
		this.data = [];
		for (var _iterator = this.items, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var cat = _ref;

			for (var _iterator2 = cat.children, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var fam = _ref2;

				for (var _iterator3 = fam.children, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref3;

					if (_isArray3) {
						if (_i3 >= _iterator3.length) break;
						_ref3 = _iterator3[_i3++];
					} else {
						_i3 = _iterator3.next();
						if (_i3.done) break;
						_ref3 = _i3.value;
					}

					var pro = _ref3;

					this.data.push({ cat: this.decode(cat.name), fam: this.decode(fam.name), pro: this.decode(pro.name) });
				}
			}
		}
	};

	BreadcrumbList.prototype.decode = function decode(v) {
		return v.replace(/\(slash\)/g, '/');
	};

	return BreadcrumbList;
})();

_appModuleMain.main.component('breadcrumbList', {
	controller: BreadcrumbList,
	bindings: { items: '=', title: '@' },
	template: "<section class=\"section-breadcrumb-list\">\n\t<div class=\"title\">{{$ctrl.title}}</div>\n\t<ul class=\"attribute-list\" ng-repeat=\"item in $ctrl.data\">\n\t\t<li>\n\t\t\t{{item.cat}} {{'>'}} {{item.fam}} {{'>'}} {{item.pro}}\n\t\t</li>\n\t</ul>\n</section>"
});

exports.BreadcrumbList = BreadcrumbList;

},{"../../../app/module/main":42}],28:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: pagination <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var Pagination = (function () {
	function Pagination($rootScope, $timeout, productService) {
		_classCallCheck(this, Pagination);

		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.productService = productService;
		this.$rootScope.data = {
			nbResults: this.$rootScope.dataFilters.TotalCount,
			nbPages: this.$rootScope.dataFilters.PageCount,
			page: this.$rootScope.sinequaParams.currentPage,
			choices: ['10', '50', '100'],
			nbPerPage: '100',
			openedSelect: false,
			pageNumbers: this.generatePageNumsArray(this.$rootScope.dataFilters.PageCount)
		};
	}

	Pagination.prototype.change = function change(i) {
		if (i < 1 || i == this.$rootScope.data.page || i > this.$rootScope.data.nbPages) {
			return;
		}
		this.$rootScope.data.page = i;
		this.$rootScope.sinequaParams.currentPage = this.$rootScope.data.page;
		this.productService.updateFilters(function (data) {}, false, false);
		this.parentCtrl.scrollToSearch();
		this.$rootScope.data.openedSelect = false;
	};

	Pagination.prototype.search = function search(nbPerPage) {
		var _this = this;

		if (this.$rootScope.data.openedSelect === false) {
			return;
		}
		if (nbPerPage) {
			this.$rootScope.data.nbPerPage = nbPerPage;
			this.$rootScope.sinequaParams.itemsPerPage = nbPerPage;
			this.$rootScope.data.page = 1;
			this.$rootScope.sinequaParams.currentPage = 1;
		}
		this.productService.updateFilters(function (data) {
			_this.$rootScope.data.pageNumbers = _this.generatePageNumsArray(data.PageCount);
			_this.$rootScope.data.nbPages = data.PageCount;
		});
		this.parentCtrl.scrollToSearch();
		this.$rootScope.data.openedSelect = false;
	};

	Pagination.prototype.openSelect = function openSelect() {
		this.$rootScope.data.openedSelect = true;
	};

	Pagination.prototype.generatePageNumsArray = function generatePageNumsArray(nbrOfPages) {
		var array = [];
		for (var i = 1; i <= nbrOfPages; i++) {
			array.push(i);
		}
		return array;
	};

	return Pagination;
})();

_appModuleMain.main.component('pagination', {
	controller: Pagination,
	require: { parentCtrl: '^^productSearchPage' },
	template: "<section class=\"pagination-section\">\n\t<div class=\"summary\">\n\t\t<span class=\"results-count\">\n\t\t{{$ctrl.$rootScope.dataFilters.TotalCount}} {{ 'NUMBER_RESULTS' | translate }} \n\t\t</span>\n\t\t<span class=\"views-count\" ng-model=\"$ctrl.$rootScope.data.nbPerPage\" ng-click=\"$ctrl.openSelect()\">\n\t\t\t{{$ctrl.$rootScope.data.nbPerPage}} {{' '}} <i class=\"material-icons\">keyboard_arrow_down</i>\n\t\t</span>\n\t\t<ul class=\"views-count-choices\" ng-class=\"{open: $ctrl.$rootScope.data.openedSelect}\">\n\t\t\t<li ng-repeat=\"choice in $ctrl.$rootScope.data.choices\" ng-click=\"$ctrl.search(choice)\" >\n\t\t\t\t{{choice}}\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n\t<div class=\"pagin\">\n\t\t<button class=\"previous\" ng-click=\"$ctrl.change($ctrl.$rootScope.data.page-1)\" ng-class=\"{disabled: $ctrl.$rootScope.data.page === 1}\">\n\t\t\t<i ng-class=\"{disabled: $ctrl.$rootScope.data.page === 1}\" class=\"material-icons\">keyboard_arrow_left</i>\n\t\t</button>\n\t\t<ul class=\"pages\">\n\t\t\t<li class=\"pages-item\" ng-repeat=\"i in $ctrl.$rootScope.data.pageNumbers\" ng-class=\"{selected: true}\" >\n\t\t\t<span ng-if=\"i === $ctrl.$rootScope.data.page\">{{i}}</span>\t\n\t\t\t<a ng-if=\"i != $ctrl.$rootScope.data.page\" ng-click=\"$ctrl.change(i)\" >{{i}}</a>\t\n\t\t\t</li>\n\t\t</ul>\n\t\t<button class=\"next\" ng-click=\"$ctrl.change($ctrl.$rootScope.data.page+1)\" ng-class=\"{disabled: $ctrl.$rootScope.data.page === $ctrl.$rootScope.data.pageNumbers}\">\n\t\t\t<i ng-class=\"{disabled: $ctrl.$rootScope.data.page === $ctrl.$rootScope.data.pageNumbers}\" class=\"material-icons\">keyboard_arrow_right</i>\n\t\t</button>\n\t</div>\n</section>"
});

exports.Pagination = Pagination;

},{"../../../app/module/main":42}],29:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _appModuleMain = require('../../../app/module/main');

/**
 * __HtmlTag__: tabs <br/>
 * __Dependencies__: {@link main} <br/>
 * __Used by__: {@link ProductDetailPage}
 */

var Tabs = (function () {
	function Tabs() {
		_classCallCheck(this, Tabs);

		this.selected = '';
	}

	Tabs.prototype.select = function select(name) {
		this.selected = name;
	};

	Tabs.prototype.getSubItems = function getSubItems(item) {
		for (var _iterator = Object.entries(item), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var k = _ref[0];
			var v = _ref[1];

			if (v instanceof Array) {
				return v;
			}
		}
	};

	Tabs.prototype.selectFirst = function selectFirst($first, name) {
		if ($first) {
			this.selected = name;
		}
	};

	Tabs.prototype.decode = function decode(v) {
		return v.replace(/\(slash\)/g, '/');
	};

	return Tabs;
})();

_appModuleMain.main.component('tabs', {
	controller: Tabs,
	bindings: { items: '=', title: '@' },
	template: "<section class=\"section-tabs\">\n\t<div class=\"title\">{{$ctrl.title}}</div>\n\t<ul class=\"tabs\">\n\t\t<li ng-init=\"$ctrl.selectFirst( $first, item.name )\" class=\"tabs-item\" ng-repeat=\"item in $ctrl.items | orderBy : 'name'\" ng-click=\"$ctrl.select( item.name )\" ng-class=\"{ 'active': item.name === $ctrl.selected , 'default-cursor' : $ctrl.items.length == 1 }\">\n\t\t\t{{$ctrl.decode(item.name)}}\n\t\t</li>\n\t</ul>\n\t<div class=\"tabs-select\">\n\t\t<select ng-model=\"$ctrl.selected\">\n\t \t\t<option value=\"{{value.name}}\" ng-repeat=\"(key, value) in $ctrl.items | orderBy : 'name'\">{{value.name}}</option>\n\t\t</select>\n\t\t<span>▼</span>\n\t</div>\n\t<div class=\"content\" ng-repeat=\"item in $ctrl.items | orderBy : 'name'\" ng-show=\"item.name === $ctrl.selected\">\n\t\t<ul class=\"sub-content\">\n\t\t\t<li class=\"subitem\" ng-repeat=\"subitem in $ctrl.getSubItems( item ) | orderBy : 'name'\">\n\t\t\t\t<div class=\"subitem-title\">{{$ctrl.decode(subitem.name)}}</div>\n\t\t\t\t<ul class=\"subitem-list\">\n\t\t\t\t\t<li class=\"subitem-item\" ng-repeat=\"si in $ctrl.getSubItems( subitem ) | orderBy : 'name'\">\n\t\t\t\t\t\t{{$ctrl.decode(si.name)}}\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</section>"
});

exports.Tabs = Tabs;

},{"../../../app/module/main":42}],30:[function(require,module,exports){
'use strict';

require('babelify/polyfill');

// load Angular Main Application Object

var _appModuleMain = require('../app/module/main');

require('../app/service/productService');

require('../app/comp/page/productSearchPage');

require('../app/comp/page/productDetailPage');

require('../app/comp/page/productFormPage');

require('../app/service/youtubeService');

require('../app/comp/feature/youtubeplaylist');

},{"../app/comp/feature/youtubeplaylist":16,"../app/comp/page/productDetailPage":24,"../app/comp/page/productFormPage":25,"../app/comp/page/productSearchPage":26,"../app/module/main":42,"../app/service/productService":44,"../app/service/youtubeService":45,"babelify/polyfill":236}],31:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelConst = require('../../app/model/Const');

var Application = (function (_GpcObject) {
	_inherits(Application, _GpcObject);

	Application.prototype['default'] = function _default() {
		this.id = 0;
		this.code = _appModelConst._STRING;
	};

	function Application(data) {
		_classCallCheck(this, Application);

		_GpcObject.call(this, data);
	}

	return Application;
})(_appModelGpcObject.GpcObject);

exports.Application = Application;

},{"../../app/model/Const":36,"../../app/model/GpcObject":38}],32:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelConst = require('../../app/model/Const');

var Brand = (function (_GpcObject) {
	_inherits(Brand, _GpcObject);

	Brand.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
	};

	function Brand(data) {
		_classCallCheck(this, Brand);

		_GpcObject.call(this, data);
	}

	return Brand;
})(_appModelGpcObject.GpcObject);

exports.Brand = Brand;

},{"../../app/model/Const":36,"../../app/model/GpcObject":38}],33:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelChemicalFamily = require('../../app/model/ChemicalFamily');

var _appModelConst = require('../../app/model/Const');

var ChemicalCategory = (function (_GpcObject) {
	_inherits(ChemicalCategory, _GpcObject);

	ChemicalCategory.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
		this._children = _appModelConst._ARR; // array of ChemicalFamily()
	};

	function ChemicalCategory(data) {
		_classCallCheck(this, ChemicalCategory);

		_GpcObject.call(this, data);
	}

	_createClass(ChemicalCategory, [{
		key: 'children',
		set: function set(data) {
			this._children = [];
			for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var cfam = _ref;

				var cf = new _appModelChemicalFamily.ChemicalFamily(cfam);
				this._children.push(cf);
			}
		},
		get: function get() {
			return this._children;
		}
	}]);

	return ChemicalCategory;
})(_appModelGpcObject.GpcObject);

exports.ChemicalCategory = ChemicalCategory;

},{"../../app/model/ChemicalFamily":34,"../../app/model/Const":36,"../../app/model/GpcObject":38}],34:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelChemicalProduct = require('../../app/model/ChemicalProduct');

var _appModelChemicalCategory = require('../../app/model/ChemicalCategory');

var _appModelConst = require('../../app/model/Const');

/** 
 * Correspond to the java class com.solvay.gpc.domain.chemicalFamily <br/>
 * __Dependencies__: {@link Label}, {@link LabelArea} <br/>
 * __Used by__: {@link ChemicalFamilyService}
 */

var ChemicalFamily = (function (_GpcObject) {
	_inherits(ChemicalFamily, _GpcObject);

	ChemicalFamily.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
		this._children = _appModelConst._ARR; // array of ChemicalProducts
	};

	function ChemicalFamily(data) {
		_classCallCheck(this, ChemicalFamily);

		_GpcObject.call(this, data);
	}

	_createClass(ChemicalFamily, [{
		key: 'children',
		set: function set(data) {
			this._children = [];
			for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var cprod = _ref;

				var cf = new _appModelChemicalProduct.ChemicalProduct(cprod);
				this._children.push(cf);
			}
		},
		get: function get() {
			return this._children;
		}
	}]);

	return ChemicalFamily;
})(_appModelGpcObject.GpcObject);

exports.ChemicalFamily = ChemicalFamily;

},{"../../app/model/ChemicalCategory":33,"../../app/model/ChemicalProduct":35,"../../app/model/Const":36,"../../app/model/GpcObject":38}],35:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelChemicalFamily = require('../../app/model/ChemicalFamily');

var _appModelConst = require('../../app/model/Const');

var ChemicalProduct = (function (_GpcObject) {
	_inherits(ChemicalProduct, _GpcObject);

	ChemicalProduct.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
	};

	function ChemicalProduct(data) {
		_classCallCheck(this, ChemicalProduct);

		_GpcObject.call(this, data);
	}

	return ChemicalProduct;
})(_appModelGpcObject.GpcObject);

exports.ChemicalProduct = ChemicalProduct;

},{"../../app/model/ChemicalFamily":34,"../../app/model/Const":36,"../../app/model/GpcObject":38}],36:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var _STRING = "";
var _ARR = Object.freeze([]);
var _OBJ = Object.freeze({});

/** const use to specified default value */
exports._STRING = _STRING;
exports._ARR = _ARR;
exports._OBJ = _OBJ;

},{}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelConst = require('../../app/model/Const');

var Gbu = (function (_GpcObject) {
	_inherits(Gbu, _GpcObject);

	Gbu.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
	};

	function Gbu(data) {
		_classCallCheck(this, Gbu);

		_GpcObject.call(this, data);
	}

	return Gbu;
})(_appModelGpcObject.GpcObject);

exports.Gbu = Gbu;

},{"../../app/model/Const":36,"../../app/model/GpcObject":38}],38:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _has_to_overide = 'This class has to overide';

/** 
 * Super class for each js entity in the model package
 */

var GpcObject = (function () {
	GpcObject.prototype['default'] = function _default() {
		console.log(_has_to_overide + ' the default() method : ' + this.objName);
	};

	_createClass(GpcObject, [{
		key: 'objName',
		get: function get() {
			return this.constructor.name;
		}
	}, {
		key: 'displayName',
		get: function get() {
			return this.constructor.name.toUpperCase();
		}
	}, {
		key: 'entityName',
		get: function get() {
			return this.constructor.entityName;
		}
	}], [{
		key: 'entityName',
		get: function get() {
			console.log(_has_to_overide + ' the entityName() method : ' + this.constructor.name);
		}
	}]);

	function GpcObject(data) {
		_classCallCheck(this, GpcObject);

		this['default']();
		if (data !== undefined) {
			Object.assign(this, data);
		}
	}

	GpcObject.prototype.clone = function clone() {
		var cln = Object.assign(Object.create(this), this);
		for (var _iterator = Object.entries(this), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var k = _ref[0];
			var v = _ref[1];

			if (v instanceof Object) {
				cln[k] = Object.assign(Object.create(v), v);
			}
		}
		return cln;
	};

	GpcObject.prototype.getTxt = function getTxt(attribute, language) {
		var attr = attribute;
		if (attribute.startsWith('_') === false) {
			attr = '_' + attribute;
		}

		attr = attr.substr(1);
		if (this[attr] === undefined) {
			return "";
		}
		return this[attr];
	};

	_createClass(GpcObject, [{
		key: 'codeOrNameOrId',
		get: function get() {
			if (this.code !== undefined && this.code !== 'undefined' && this.code !== '') {
				return this.code;
			} else if (this.name !== undefined && this.name !== 'undefined' && this.name.getTxt() !== '') {
				return this.name.getTxt();
			} else {
				return this.id;
			}
		}
	}]);

	return GpcObject;
})();

exports.GpcObject = GpcObject;

},{}],39:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelSegment = require('../../app/model/Segment');

var _appModelConst = require('../../app/model/Const');

var Market = (function (_GpcObject) {
	_inherits(Market, _GpcObject);

	Market.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
		this._children = _appModelConst._ARR; // array of Segment()
	};

	function Market(data) {
		_classCallCheck(this, Market);

		_GpcObject.call(this, data);
	}

	_createClass(Market, [{
		key: 'children',
		set: function set(data) {
			this._children = [];
			for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var seg = _ref;

				var s = new _appModelSegment.Segment(seg);
				this._children.push(s);
			}
		},
		get: function get() {
			return this._children;
		}
	}]);

	return Market;
})(_appModelGpcObject.GpcObject);

exports.Market = Market;

},{"../../app/model/Const":36,"../../app/model/GpcObject":38,"../../app/model/Segment":41}],40:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelConst = require('../../app/model/Const');

var _appModelBrand = require('../../app/model/Brand');

var _appModelMarket = require('../../app/model/Market');

var _appModelChemicalCategory = require('../../app/model/ChemicalCategory');

var _appModelGbu = require('../../app/model/Gbu');

var _serviceGpcService = require('../service/GpcService');

var Product = (function (_GpcObject) {
	_inherits(Product, _GpcObject);

	function Product() {
		_classCallCheck(this, Product);

		_GpcObject.apply(this, arguments);
	}

	Product.prototype['default'] = function _default() {
		this.id = 0;
		this.code = _appModelConst._STRING;
		this.name = _appModelConst._STRING;
		this.synonym = _appModelConst._STRING;
		this.description = _appModelConst._STRING;
		this.casNumber = _appModelConst._STRING;
		this.sampleRequest = _appModelConst._STRING;
		this.materialGroup = _appModelConst._STRING;
		this.availabilityEMEA = _appModelConst._STRING;
		this.availabilityNA = _appModelConst._STRING;
		this.availabilityLA = _appModelConst._STRING;
		this.availabilityAPAC = _appModelConst._STRING;
		this.brand = _appModelConst._OBJ;
		this.gbu = _appModelConst._OBJ;
		this.displayPackaging = _appModelConst._STRING;
		this.displayMaterial = _appModelConst._STRING;
		this.sapSource = _appModelConst._STRING;
		this.ulProspectorCode = _appModelConst._STRING;
		this.commercialInformation = _appModelConst._STRING;
		this._chemicals = _appModelConst._ARR;
		this._markets = _appModelConst._ARR;
	};

	_createClass(Product, [{
		key: 'markets',
		get: function get() {
			return this._marketTrees;
		},
		set: function set(data) {
			this._markets = [];
			for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var mTree = _ref;

				var m = new _appModelMarket.Market(mTree);
				this._markets.push(m);
			}
		}
	}, {
		key: 'chemicals',
		get: function get() {
			return this._chemicalTrees;
		},
		set: function set(data) {
			this._chemicals = [];
			for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var cTree = _ref2;

				var m = new _appModelChemicalCategory.ChemicalCategory(cTree);
				this._chemicals.push(m);
			}
		}
	}]);

	return Product;
})(_appModelGpcObject.GpcObject);

exports.Product = Product;

},{"../../app/model/Brand":32,"../../app/model/ChemicalCategory":33,"../../app/model/Const":36,"../../app/model/Gbu":37,"../../app/model/GpcObject":38,"../../app/model/Market":39,"../service/GpcService":43}],41:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appModelGpcObject = require('../../app/model/GpcObject');

var _appModelApplication = require('../../app/model/Application');

var _appModelMarket = require('../../app/model/Market');

var _appModelConst = require('../../app/model/Const');

var Segment = (function (_GpcObject) {
	_inherits(Segment, _GpcObject);

	Segment.prototype['default'] = function _default() {
		this.id = 0;
		this.name = _appModelConst._STRING;
		this._children = _appModelConst._ARR; // array of Application()
	};

	function Segment(data) {
		_classCallCheck(this, Segment);

		_GpcObject.call(this, data);
	}

	_createClass(Segment, [{
		key: 'children',
		set: function set(data) {
			this._children = [];
			for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var app = _ref;

				var a = new _appModelApplication.Application(app);
				this._children.push(a);
			}
		},
		get: function get() {
			return this._children;
		}
	}]);

	return Segment;
})(_appModelGpcObject.GpcObject);

exports.Segment = Segment;

},{"../../app/model/Application":31,"../../app/model/Const":36,"../../app/model/GpcObject":38,"../../app/model/Market":39}],42:[function(require,module,exports){
/** 
 * main angular object 
 * 
 * Use Auto-complete directive
 * https://github.com/JustGoscha/allmighty-autocomplete
 */
'use strict';

exports.__esModule = true;
var main = angular.module('GPC', ['pascalprecht.translate', 'ngSanitize', 'ngRoute', 'ngResource', 'ngCookies', 'autocomplete']);

main.config(['$translateProvider', function ($translateProvider) {
	if (typeof languagePack !== 'undefined') {
		var langArray = new Array();
		for (var lang in languagePack) {
			langArray.push(lang);
			if (languagePack[lang] !== null && typeof languagePack[lang] == "object") {
				$translateProvider.translations(lang, languagePack[lang]);
			}
		}
		// following code detect the browser language and find the corresponding language in pack,
		// with 'en' as a fall back
		$translateProvider.registerAvailableLanguageKeys(langArray, {
			'*': 'default'
		}).determinePreferredLanguage().fallbackLanguage('default');
		// Here ö,ä,ü (special characters) works
		$translateProvider.useSanitizeValueStrategy('escaped');
		// Here the html tag works
		// $translateProvider.useSanitizeValueStrategy('sanitizeParameters')
	}
}]);

exports.main = main;

},{}],43:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _defaultSinParams = {
	'markets': '/',
	'chemicals': '/',
	'zones': '',
	'brands': '',
	'searchTxt': '',
	'displayedSearchTxt': '',
	'itemsPerPage': 100,
	'currentPage': 1,
	'brandsInfo': []
};

/**
* Generic CRUD 
*/

var GpcService = (function () {
	function GpcService(backEnd, $http, $rootScope) {
		_classCallCheck(this, GpcService);

		this.backEnd = backEnd;
		this.$http = $http;
		this._SINEQUA_PRODUCTS_SEARCH = '../../searchProducts.jaction';
		this._SINEQUA_DOCUMENTS_SEARCH = '../../SearchProductDocuments.jaction';
		this._DOCUMENT_DOWNLOAD = '../../DownloadDocument.jaction';
		this._SINEQUA_PRODUCTS_COMPLETION = '../../searchProductsAutoCompletion.jaction';
		this.$rootScope = $rootScope;
		this.$rootScope.dataLoadedFromServer = true;
		this.$rootScope.loading = false;
		if (this.$rootScope.dataLoadedFromServer) {
			if (sessionStorage.getItem('sinParams') != undefined) {
				this.$rootScope.sinequaParams = JSON.parse(sessionStorage.getItem('sinParams'));
			} else {
				this.$rootScope.sinequaParams = _defaultSinParams;
			}
			this.$rootScope.filterBubblesData = {
				'markets': [],
				'chemicals': [],
				'zones': [],
				'brands': []
			};
			if (sessionStorage.getItem('dataFilters') != undefined) {
				this.$rootScope.dataFilters = JSON.parse(sessionStorage.getItem('dataFilters'));
				if (sessionStorage.getItem('updatedDataFilters') != undefined && sessionStorage.getItem('updatedDataFilters') != 'undefined') {
					this.$rootScope.updatedDataFilters = JSON.parse(sessionStorage.getItem('updatedDataFilters'));
				}
			} else {
				this.getFilters(function () {});
			}
		}
	}

	GpcService.getService = function getService(name) {
		return _serviceMap[name];
	};

	GpcService.prototype.saveFilters = function saveFilters() {
		var sinParams = JSON.stringify(this.$rootScope.sinequaParams);
		var dataFilters = JSON.stringify(this.$rootScope.dataFilters);
		var updatedDataFilters = JSON.stringify(this.$rootScope.updatedDataFilters);
		sessionStorage.setItem('sinParams', sinParams);
		sessionStorage.setItem('dataFilters', dataFilters);
		sessionStorage.setItem('updatedDataFilters', updatedDataFilters);
	};

	GpcService.prototype.getFilters = function getFilters(callback) {
		var _this = this;

		var rs = this.$rootScope;
		var sp = rs.sinequaParams;
		rs.loading = true;
		this.$http.get(this._SINEQUA_PRODUCTS_SEARCH + '?resultType=' + 'json' + '&mode=' + '&text=' + '&language=' + 'EN' + '&productId=' + '&zone=' + '&brandName=' + '&marketNameHierarchy=' + '&chemicalNameHierarchy=' + '&itemsPerPage=' + sp.itemsPerPage + '&currentPage=' + sp.currentPage, {}).success(function (data) {
			rs.dataFilters = data;
			rs.dataFilters.productsWithoutBrands = 0;
			rs.dataFilters.defaultBrandsCount = [];
			for (var _iterator = data.ConsolidatedBrands, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var brand = _ref;

				rs.dataFilters.defaultBrandsCount.push(brand.count);
			}
			rs.loading = false;
			_this.saveFilters();
			callback(data, true);
		}).error(function (error) {
			console.log(error);
			rs.loading = false;
			callback(error, false);
		});
	};

	GpcService.prototype.updateFilters = function updateFilters(callback) {
		var _this2 = this;

		var bubbleClick = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var firstPage = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

		var rs = this.$rootScope;
		var sp = this.$rootScope.sinequaParams;
		rs.loading = true;
		this.initParams(firstPage);
		var star = '*';
		if (sp.searchTxt.length === 0) {
			star = '';
		}
		this.$http.get(this._SINEQUA_PRODUCTS_SEARCH + '?resultType=' + 'json' + '&mode=' + '&text=' + encodeURIComponent(sp.searchTxt) + star + // * = like
		'&language=' + 'EN' + '&productId=' + '&zone=' + sp.zones + '&brandName=' + encodeURIComponent(sp.brands) + '&marketNameHierarchy=' + encodeURIComponent(sp.markets) + '&chemicalNameHierarchy=' + encodeURIComponent(sp.chemicals) + '&itemsPerPage=' + sp.itemsPerPage + '&currentPage=' + sp.currentPage, {}).success(function (data) {
			rs.updatedDataFilters = data;
			_this2.initArraysIfUndefined();
			rs.dataFilters.Products = rs.updatedDataFilters.Products;
			rs.dataFilters.TotalCount = rs.updatedDataFilters.TotalCount;
			_this2.merge(rs.dataFilters.ConsolidatedChemicals, rs.updatedDataFilters.ConsolidatedChemicals);
			_this2.merge(rs.dataFilters.ConsolidatedMarkets, rs.updatedDataFilters.ConsolidatedMarkets);
			_this2.merge(rs.dataFilters.ConsolidatedZones, rs.updatedDataFilters.ConsolidatedZones);
			_this2.mergeBrands(rs.dataFilters.ConsolidatedBrands, rs.updatedDataFilters.ConsolidatedBrands, bubbleClick);
			//update paging
			rs.data.pageNumbers = _this2.generatePageNumsArray(data.PageCount);
			rs.data.nbPages = data.PageCount;
			//remove localStorage variables
			sessionStorage.removeItem('sinParams');
			sessionStorage.removeItem('updatedDataFilters');
			sessionStorage.removeItem('dataFilters');
			rs.loading = false;
			_this2.saveFilters();
			callback(data, true);
		}).error(function (error) {
			console.log(error);
			rs.loading = false;
			callback(error, false);
		});
	};

	GpcService.prototype.initParams = function initParams(firstPage) {
		var rs = this.$rootScope;
		var sp = this.$rootScope.sinequaParams;
		if (firstPage) {
			rs.data.page = 1;
			rs.sinequaParams.currentPage = 1;
		}
		if (sp.markets.length === 1) {
			sp.markets = '';
		}
		if (sp.chemicals.length === 1) {
			sp.chemicals = '';
		}
		sp.brands = '';
		if (sp.brandsInfo.length === 1) {
			// solve a special bug in the search engine
			sp.brands = sp.brandsInfo[0].name + ';' + sp.brandsInfo[0].name;
		} else {
			for (var _iterator2 = sp.brandsInfo, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var bi = _ref2;

				sp.brands = sp.brands + bi.name + ';';
			}
			sp.brands = sp.brands.slice(0, -1);
		}
		rs.dataFilters.productsWithoutBrands = 0;
	};

	GpcService.prototype.initArraysIfUndefined = function initArraysIfUndefined() {
		var rs = this.$rootScope;
		if (rs.updatedDataFilters.ConsolidatedChemicals === undefined) {
			rs.updatedDataFilters.ConsolidatedChemicals = [];
		}
		if (rs.updatedDataFilters.ConsolidatedMarkets === undefined) {
			rs.updatedDataFilters.ConsolidatedMarkets = [];
		}
		if (rs.updatedDataFilters.ConsolidatedZones === undefined) {
			rs.updatedDataFilters.ConsolidatedZones = [];
		}
		if (rs.updatedDataFilters.ConsolidatedBrands === undefined) {
			rs.updatedDataFilters.ConsolidatedBrands = [];
		}
	};

	GpcService.prototype.generatePageNumsArray = function generatePageNumsArray(nbrOfPages) {
		var array = [];
		for (var i = 1; i <= nbrOfPages; i++) {
			array.push(i);
		}
		return array;
	};

	GpcService.prototype.merge = function merge(defaultData, updatedData) {
		for (var _iterator3 = defaultData, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var d = _ref3;

			var found = false;
			if (updatedData !== undefined) {
				for (var _iterator4 = updatedData, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
					var _ref4;

					if (_isArray4) {
						if (_i4 >= _iterator4.length) break;
						_ref4 = _iterator4[_i4++];
					} else {
						_i4 = _iterator4.next();
						if (_i4.done) break;
						_ref4 = _i4.value;
					}

					var u = _ref4;

					if (d.name === u.name) {
						found = true;
						d.count = u.count;
						if (d.children !== undefined && u.children !== undefined) {
							this.merge(d.children, u.children);
						}
					}
				}
			}
			if (found === false) {
				this.setCountToZero(d);
			}
		}
	};

	GpcService.prototype.mergeBrands = function mergeBrands(defaultData, updatedData) {
		var bubbleClick = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		var rs = this.$rootScope;
		var sp = this.$rootScope.sinequaParams;
		var otherFilterActivated = false;
		if (sp.markets.length > 1 || sp.chemicals.length > 1 || sp.zones.length > 1 || sp.searchTxt.length > 1) {
			otherFilterActivated = true;
		}
		if (rs.currentFilter.code === 'brands' && bubbleClick === false && sp.brandsInfo.length > 0) {
			// Do not update brand count when we are on the brand Filter
			return;
		}
		var productsHavingBrands = 0;
		rs.dataFilters.productsWithoutBrands = 0;
		var returnedBrands = [];
		if (updatedData !== undefined) {
			for (var _iterator5 = updatedData, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
				var _ref5;

				if (_isArray5) {
					if (_i5 >= _iterator5.length) break;
					_ref5 = _iterator5[_i5++];
				} else {
					_i5 = _iterator5.next();
					if (_i5.done) break;
					_ref5 = _i5.value;
				}

				var brd = _ref5;

				returnedBrands.push(brd.name);
			}
		}
		for (var _iterator6 = defaultData.entries(), _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
			var _ref6;

			if (_isArray6) {
				if (_i6 >= _iterator6.length) break;
				_ref6 = _iterator6[_i6++];
			} else {
				_i6 = _iterator6.next();
				if (_i6.done) break;
				_ref6 = _i6.value;
			}

			var di = _ref6[0];
			var d = _ref6[1];

			if (otherFilterActivated) {
				// set the updated count to the available brands and set 0 as count for the unavailable brands (other filters are selected)
				if (updatedData !== undefined && returnedBrands.indexOf(d.name) === -1) {
					// if the brand is not selected from the begining set its count to zero
					this.setCountToZero(d);
					for (var _iterator7 = sp.brandsInfo.entries(), _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
						var _ref7;

						if (_isArray7) {
							if (_i7 >= _iterator7.length) break;
							_ref7 = _iterator7[_i7++];
						} else {
							_i7 = _iterator7.next();
							if (_i7.done) break;
							_ref7 = _i7.value;
						}

						var bri = _ref7[0];
						var br = _ref7[1];
						// brand not available for the current selection : remove it from sinequa param
						if (br.name === d.name) {
							sp.brandsInfo.splice(bri, 1);
						}
					}
					for (var _iterator8 = rs.filterBubbles.entries(), _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
						var _ref8;

						if (_isArray8) {
							if (_i8 >= _iterator8.length) break;
							_ref8 = _iterator8[_i8++];
						} else {
							_i8 = _iterator8.next();
							if (_i8.done) break;
							_ref8 = _i8.value;
						}

						var bbi = _ref8[0];
						var bb = _ref8[1];
						// brand not available for the current selection : remove its bubble
						if (bb.filter.code === 'brands' && bb.values[0] === d.name) {
							rs.filterBubbles.splice(bbi, 1);
						}
					}
					d.active = false;
				} else if (updatedData !== undefined) {
					// the brand is available and selected ==> just update its count
					for (var _iterator9 = updatedData, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
						var _ref9;

						if (_isArray9) {
							if (_i9 >= _iterator9.length) break;
							_ref9 = _iterator9[_i9++];
						} else {
							_i9 = _iterator9.next();
							if (_i9.done) break;
							_ref9 = _i9.value;
						}

						var ud = _ref9;

						if (d.name === ud.name) {
							if (isNaN(parseInt(ud.count))) {
								ud.count = 0;
							}
							d.count = ud.count;
							productsHavingBrands = productsHavingBrands + parseInt(ud.count);
						}
					}
				} else {
					this.setCountToZero(d); // case other filters are selected but the returned products have no brands
				}
			} else {
					// set default values of brands with their count, bubbles and other params
					d.count = rs.dataFilters.defaultBrandsCount[di];
				}
		}
		if (otherFilterActivated) {
			rs.dataFilters.productsWithoutBrands = parseInt(rs.dataFilters.TotalCount) - productsHavingBrands; // Number of products having no brand	
		}
	};

	GpcService.prototype.setCountToZero = function setCountToZero(data) {
		data.count = 0;
		if (data.children != undefined) {
			for (var _iterator10 = data.children, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
				var _ref10;

				if (_isArray10) {
					if (_i10 >= _iterator10.length) break;
					_ref10 = _iterator10[_i10++];
				} else {
					_i10 = _iterator10.next();
					if (_i10.done) break;
					_ref10 = _i10.value;
				}

				var c = _ref10;

				this.setCountToZero(c);
			}
		}
	};

	GpcService.prototype.getSDSDocumentsList = function getSDSDocumentsList(callback, prodCode, countryName) {
		var rs = this.$rootScope;
		if (prodCode.startsWith("P") === false) {
			prodCode = 'PRCO' + prodCode;
		}
		this.$http.get(this._SINEQUA_DOCUMENTS_SEARCH + '?productCode=' + prodCode + '&country=' + countryName, {}).success(function (data) {
			rs.sdsDocumentsList = data;
			callback(data, true);
		}).error(function (error) {
			console.log(error);
			callback(error, false);
		});
	};

	GpcService.prototype.getCompletion = function getCompletion(txt, callback) {
		this.$http.get(this._SINEQUA_PRODUCTS_COMPLETION + '?text=' + txt, {}).success(function (data) {
			callback(data, true);
		}).error(function (error) {
			console.log(error);
			callback(error, false);
		});
	};

	_createClass(GpcService, null, [{
		key: 'defaultSinParams',
		get: function get() {
			return _defaultSinParams;
		}
	}]);

	return GpcService;
})();

exports.GpcService = GpcService;

},{}],44:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _appServiceGpcService = require('../../app/service/GpcService');

var _appModelProduct = require('../../app/model/Product');

var _appModuleMain = require('../../app/module/main');

/** 
 * CRUD for Products <br/>
 * __Dependencies__: {@link main}, {@link Market}, backEnd (config.js) <br/>
 * __Used by__: {@link ProductPage}
 */

var ProductService = (function (_GpcService) {
  _inherits(ProductService, _GpcService);

  function ProductService(backEnd, $http, $rootScope) {
    _classCallCheck(this, ProductService);

    _GpcService.call(this, backEnd, $http, $rootScope);
  }

  return ProductService;
})(_appServiceGpcService.GpcService);

_appModuleMain.main.service('productService', ProductService);

exports.ProductService = ProductService;

},{"../../app/model/Product":40,"../../app/module/main":42,"../../app/service/GpcService":43}],45:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _appModuleMain = require('../../app/module/main');

var _defaultSinParams = {};

/**
* Generic CRUD 
*/

var YoutubeService = (function () {
	function YoutubeService(backEnd, $http, $rootScope) {
		_classCallCheck(this, YoutubeService);

		this.backEnd = backEnd;
		this.$http = $http;
		this.$rootScope = $rootScope;
		this.$rootScope.dataLoadedFromServer = true;
		this.$rootScope.loading = false;
	}

	YoutubeService.getService = function getService(name) {
		return _serviceMap[name];
	};

	YoutubeService.prototype.getYoutubePlaylist = function getYoutubePlaylist(txt, callback) {

		var playlistId = "PLtEnYqvFb9h1PMrcrPusdWcbM6-A5N_Zz";
		var apiKey = "AIzaSyDVoiizX4Cjw3hW-VcGraZ7RaFTQ1fJ4gQ";
		var youtubeUrl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails%2Cstatus&playlistId=" + playlistId + "&key=" + apiKey;

		this.$http.get(youtubeUrl, {}).success(function (data) {
			callback(data, true);
		}).error(function (error) {
			console.log(error);
			callback(error, false);
		});
	};

	_createClass(YoutubeService, null, [{
		key: "defaultSinParams",
		get: function get() {
			return _defaultSinParams;
		}
	}]);

	return YoutubeService;
})();

_appModuleMain.main.service('youtubeService', YoutubeService);

exports.YoutubeService = YoutubeService;

},{"../../app/module/main":42}],46:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator/runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/shim":233,"regenerator/runtime":234}],47:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],48:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./$.hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./$.hide":76,"./$.wks":128}],49:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":83}],50:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , $$    = arguments
    , end   = $$.length > 2 ? $$[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./$.to-index":121,"./$.to-length":124,"./$.to-object":125}],51:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , $$     = arguments
    , $$len  = $$.length
    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
    , end    = $$len > 2 ? $$[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./$.to-index":121,"./$.to-length":124,"./$.to-object":125}],52:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length')
  , toIndex   = require('./$.to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$.to-index":121,"./$.to-iobject":123,"./$.to-length":124}],53:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./$.ctx')
  , IObject  = require('./$.iobject')
  , toObject = require('./$.to-object')
  , toLength = require('./$.to-length')
  , asc      = require('./$.array-species-create');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$.array-species-create":54,"./$.ctx":62,"./$.iobject":79,"./$.to-length":124,"./$.to-object":125}],54:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var isObject = require('./$.is-object')
  , isArray  = require('./$.is-array')
  , SPECIES  = require('./$.wks')('species');
module.exports = function(original, length){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return new (C === undefined ? Array : C)(length);
};
},{"./$.is-array":81,"./$.is-object":83,"./$.wks":128}],55:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":56,"./$.wks":128}],56:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],57:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , redefineAll  = require('./$.redefine-all')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":91,"./$.ctx":62,"./$.defined":63,"./$.descriptors":64,"./$.for-of":72,"./$.has":75,"./$.hide":76,"./$.is-object":83,"./$.iter-define":87,"./$.iter-step":89,"./$.redefine-all":105,"./$.set-species":110,"./$.strict-new":114,"./$.uid":127}],58:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":55,"./$.for-of":72}],59:[function(require,module,exports){
'use strict';
var hide              = require('./$.hide')
  , redefineAll       = require('./$.redefine-all')
  , anObject          = require('./$.an-object')
  , isObject          = require('./$.is-object')
  , strictNew         = require('./$.strict-new')
  , forOf             = require('./$.for-of')
  , createArrayMethod = require('./$.array-methods')
  , $has              = require('./$.has')
  , WEAK              = require('./$.uid')('weak')
  , isExtensible      = Object.isExtensible || isObject
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"./$.an-object":49,"./$.array-methods":53,"./$.for-of":72,"./$.has":75,"./$.hide":76,"./$.is-object":83,"./$.redefine-all":105,"./$.strict-new":114,"./$.uid":127}],60:[function(require,module,exports){
'use strict';
var global         = require('./$.global')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , redefineAll    = require('./$.redefine-all')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , fails          = require('./$.fails')
  , $iterDetect    = require('./$.iter-detect')
  , setToStringTag = require('./$.set-to-string-tag');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO;
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || instance.forEach(function(val, key){
      BUGGY_ZERO = 1 / key === -Infinity;
    });
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$.export":67,"./$.fails":69,"./$.for-of":72,"./$.global":74,"./$.is-object":83,"./$.iter-detect":88,"./$.redefine":106,"./$.redefine-all":105,"./$.set-to-string-tag":111,"./$.strict-new":114}],61:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],62:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":47}],63:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],64:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":69}],65:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":74,"./$.is-object":83}],66:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":91}],67:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , hide      = require('./$.hide')
  , redefine  = require('./$.redefine')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)redefine(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":61,"./$.ctx":62,"./$.global":74,"./$.hide":76,"./$.redefine":106}],68:[function(require,module,exports){
var MATCH = require('./$.wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./$.wks":128}],69:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],70:[function(require,module,exports){
'use strict';
var hide     = require('./$.hide')
  , redefine = require('./$.redefine')
  , fails    = require('./$.fails')
  , defined  = require('./$.defined')
  , wks      = require('./$.wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , original = ''[KEY];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, exec(defined, SYMBOL, original));
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"./$.defined":63,"./$.fails":69,"./$.hide":76,"./$.redefine":106,"./$.wks":128}],71:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./$.an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./$.an-object":49}],72:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":49,"./$.ctx":62,"./$.is-array-iter":80,"./$.iter-call":85,"./$.to-length":124,"./core.get-iterator-method":129}],73:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":91,"./$.to-iobject":123}],74:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],75:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],76:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":91,"./$.descriptors":64,"./$.property-desc":104}],77:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":74}],78:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],79:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":56}],80:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":90,"./$.wks":128}],81:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":56}],82:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./$.is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./$.is-object":83}],83:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],84:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./$.is-object')
  , cof      = require('./$.cof')
  , MATCH    = require('./$.wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./$.cof":56,"./$.is-object":83,"./$.wks":128}],85:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":49}],86:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":91,"./$.hide":76,"./$.property-desc":104,"./$.set-to-string-tag":111,"./$.wks":128}],87:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":91,"./$.export":67,"./$.has":75,"./$.hide":76,"./$.iter-create":86,"./$.iterators":90,"./$.library":93,"./$.redefine":106,"./$.set-to-string-tag":111,"./$.wks":128}],88:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":128}],89:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],90:[function(require,module,exports){
module.exports = {};
},{}],91:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],92:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":91,"./$.to-iobject":123}],93:[function(require,module,exports){
module.exports = false;
},{}],94:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],95:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],96:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],97:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":56,"./$.global":74,"./$.task":120}],98:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":91,"./$.fails":69,"./$.iobject":79,"./$.to-object":125}],99:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":61,"./$.export":67,"./$.fails":69}],100:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject')
  , isEnum    = $.isEnum;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./$":91,"./$.to-iobject":123}],101:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = require('./$')
  , anObject = require('./$.an-object')
  , Reflect  = require('./$.global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":91,"./$.an-object":49,"./$.global":74}],102:[function(require,module,exports){
'use strict';
var path      = require('./$.path')
  , invoke    = require('./$.invoke')
  , aFunction = require('./$.a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that  = this
      , $$    = arguments
      , $$len = $$.length
      , j = 0, k = 0, args;
    if(!holder && !$$len)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
    while($$len > k)args.push($$[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$.a-function":47,"./$.invoke":78,"./$.path":103}],103:[function(require,module,exports){
module.exports = require('./$.global');
},{"./$.global":74}],104:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],105:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":106}],106:[function(require,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = require('./$.global')
  , hide      = require('./$.hide')
  , SRC       = require('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":61,"./$.global":74,"./$.hide":76,"./$.uid":127}],107:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],108:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],109:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":91,"./$.an-object":49,"./$.ctx":62,"./$.is-object":83}],110:[function(require,module,exports){
'use strict';
var global      = require('./$.global')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":91,"./$.descriptors":64,"./$.global":74,"./$.wks":128}],111:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":91,"./$.has":75,"./$.wks":128}],112:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":74}],113:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":47,"./$.an-object":49,"./$.wks":128}],114:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],115:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":63,"./$.to-integer":122}],116:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./$.is-regexp')
  , defined  = require('./$.defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./$.defined":63,"./$.is-regexp":84}],117:[function(require,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = require('./$.to-length')
  , repeat   = require('./$.string-repeat')
  , defined  = require('./$.defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"./$.defined":63,"./$.string-repeat":118,"./$.to-length":124}],118:[function(require,module,exports){
'use strict';
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$.defined":63,"./$.to-integer":122}],119:[function(require,module,exports){
var $export = require('./$.export')
  , defined = require('./$.defined')
  , fails   = require('./$.fails')
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $export($export.P + $export.F * fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./$.defined":63,"./$.export":67,"./$.fails":69}],120:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":56,"./$.ctx":62,"./$.dom-create":65,"./$.global":74,"./$.html":77,"./$.invoke":78}],121:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./$.to-integer":122}],122:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],123:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":63,"./$.iobject":79}],124:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":122}],125:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":63}],126:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./$.is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./$.is-object":83}],127:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],128:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":74,"./$.shared":112,"./$.uid":127}],129:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":55,"./$.core":61,"./$.iterators":90,"./$.wks":128}],130:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , $export           = require('./$.export')
  , DESCRIPTORS       = require('./$.descriptors')
  , createDesc        = require('./$.property-desc')
  , html              = require('./$.html')
  , cel               = require('./$.dom-create')
  , has               = require('./$.has')
  , cof               = require('./$.cof')
  , invoke            = require('./$.invoke')
  , fails             = require('./$.fails')
  , anObject          = require('./$.an-object')
  , aFunction         = require('./$.a-function')
  , isObject          = require('./$.is-object')
  , toObject          = require('./$.to-object')
  , toIObject         = require('./$.to-iobject')
  , toInteger         = require('./$.to-integer')
  , toIndex           = require('./$.to-index')
  , toLength          = require('./$.to-length')
  , IObject           = require('./$.iobject')
  , IE_PROTO          = require('./$.uid')('__proto__')
  , createArrayMethod = require('./$.array-methods')
  , arrayIndexOf      = require('./$.array-includes')(false)
  , ObjectProto       = Object.prototype
  , ArrayProto        = Array.prototype
  , arraySlice        = ArrayProto.slice
  , arrayJoin         = ArrayProto.join
  , defineProperty    = $.setDesc
  , getOwnDescriptor  = $.getDesc
  , defineProperties  = $.setDescs
  , factories         = {}
  , IE8_DOM_DEFINE;

if(!DESCRIPTORS){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$export($export.S + $export.F * !DESCRIPTORS, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$export($export.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$export($export.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = arraySlice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(arraySlice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * fails(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$export($export.P + $export.F * (IObject != Object), 'Array', {
  join: function join(separator){
    return arrayJoin.call(IObject(this), separator === undefined ? ',' : separator);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$export($export.S, 'Array', {isArray: require('./$.is-array')});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};

var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};

$export($export.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(createArrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(createArrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(createArrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(createArrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(createArrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize(arrayIndexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$export($export.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./$":91,"./$.a-function":47,"./$.an-object":49,"./$.array-includes":52,"./$.array-methods":53,"./$.cof":56,"./$.descriptors":64,"./$.dom-create":65,"./$.export":67,"./$.fails":69,"./$.has":75,"./$.html":77,"./$.invoke":78,"./$.iobject":79,"./$.is-array":81,"./$.is-object":83,"./$.property-desc":104,"./$.to-index":121,"./$.to-integer":122,"./$.to-iobject":123,"./$.to-length":124,"./$.to-object":125,"./$.uid":127}],131:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {copyWithin: require('./$.array-copy-within')});

require('./$.add-to-unscopables')('copyWithin');
},{"./$.add-to-unscopables":48,"./$.array-copy-within":50,"./$.export":67}],132:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {fill: require('./$.array-fill')});

require('./$.add-to-unscopables')('fill');
},{"./$.add-to-unscopables":48,"./$.array-fill":51,"./$.export":67}],133:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":48,"./$.array-methods":53,"./$.export":67}],134:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":48,"./$.array-methods":53,"./$.export":67}],135:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":62,"./$.export":67,"./$.is-array-iter":80,"./$.iter-call":85,"./$.iter-detect":88,"./$.to-length":124,"./$.to-object":125,"./core.get-iterator-method":129}],136:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":48,"./$.iter-define":87,"./$.iter-step":89,"./$.iterators":90,"./$.to-iobject":123}],137:[function(require,module,exports){
'use strict';
var $export = require('./$.export');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , $$     = arguments
      , $$len  = $$.length
      , result = new (typeof this == 'function' ? this : Array)($$len);
    while($$len > index)result[index] = $$[index++];
    result.length = $$len;
    return result;
  }
});
},{"./$.export":67,"./$.fails":69}],138:[function(require,module,exports){
require('./$.set-species')('Array');
},{"./$.set-species":110}],139:[function(require,module,exports){
'use strict';
var $             = require('./$')
  , isObject      = require('./$.is-object')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":91,"./$.is-object":83,"./$.wks":128}],140:[function(require,module,exports){
var setDesc    = require('./$').setDesc
  , createDesc = require('./$.property-desc')
  , has        = require('./$.has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || require('./$.descriptors') && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"./$":91,"./$.descriptors":64,"./$.has":75,"./$.property-desc":104}],141:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":60,"./$.collection-strong":57}],142:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./$.export')
  , log1p   = require('./$.math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./$.export":67,"./$.math-log1p":95}],143:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./$.export');

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$export($export.S, 'Math', {asinh: asinh});
},{"./$.export":67}],144:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./$.export":67}],145:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./$.export')
  , sign    = require('./$.math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./$.export":67,"./$.math-sign":96}],146:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./$.export":67}],147:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./$.export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./$.export":67}],148:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./$.export');

$export($export.S, 'Math', {expm1: require('./$.math-expm1')});
},{"./$.export":67,"./$.math-expm1":94}],149:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./$.export')
  , sign      = require('./$.math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./$.export":67,"./$.math-sign":96}],150:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./$.export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum   = 0
      , i     = 0
      , $$    = arguments
      , $$len = $$.length
      , larg  = 0
      , arg, div;
    while(i < $$len){
      arg = abs($$[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./$.export":67}],151:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./$.export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./$.fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./$.export":67,"./$.fails":69}],152:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./$.export":67}],153:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./$.export');

$export($export.S, 'Math', {log1p: require('./$.math-log1p')});
},{"./$.export":67,"./$.math-log1p":95}],154:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./$.export":67}],155:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./$.export');

$export($export.S, 'Math', {sign: require('./$.math-sign')});
},{"./$.export":67,"./$.math-sign":96}],156:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./$.fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./$.export":67,"./$.fails":69,"./$.math-expm1":94}],157:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./$.export":67,"./$.math-expm1":94}],158:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.export":67}],159:[function(require,module,exports){
'use strict';
var $           = require('./$')
  , global      = require('./$.global')
  , has         = require('./$.has')
  , cof         = require('./$.cof')
  , toPrimitive = require('./$.to-primitive')
  , fails       = require('./$.fails')
  , $trim       = require('./$.string-trim').trim
  , NUMBER      = 'Number'
  , $Number     = global[NUMBER]
  , Base        = $Number
  , proto       = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF  = cof($.create(proto)) == NUMBER
  , TRIM        = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(require('./$.descriptors') ? $.getNames(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), function(key){
    if(has(Base, key) && !has($Number, key)){
      $.setDesc($Number, key, $.getDesc(Base, key));
    }
  });
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redefine')(global, NUMBER, $Number);
}
},{"./$":91,"./$.cof":56,"./$.descriptors":64,"./$.fails":69,"./$.global":74,"./$.has":75,"./$.redefine":106,"./$.string-trim":119,"./$.to-primitive":126}],160:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./$.export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./$.export":67}],161:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./$.export')
  , _isFinite = require('./$.global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./$.export":67,"./$.global":74}],162:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./$.export');

$export($export.S, 'Number', {isInteger: require('./$.is-integer')});
},{"./$.export":67,"./$.is-integer":82}],163:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./$.export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./$.export":67}],164:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./$.export')
  , isInteger = require('./$.is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./$.export":67,"./$.is-integer":82}],165:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./$.export":67}],166:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./$.export":67}],167:[function(require,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $export = require('./$.export');

$export($export.S, 'Number', {parseFloat: parseFloat});
},{"./$.export":67}],168:[function(require,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $export = require('./$.export');

$export($export.S, 'Number', {parseInt: parseInt});
},{"./$.export":67}],169:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":67,"./$.object-assign":98}],170:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"./$.is-object":83,"./$.object-sap":99}],171:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":99,"./$.to-iobject":123}],172:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./$.object-sap')('getOwnPropertyNames', function(){
  return require('./$.get-names').get;
});
},{"./$.get-names":73,"./$.object-sap":99}],173:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./$.object-sap":99,"./$.to-object":125}],174:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./$.is-object":83,"./$.object-sap":99}],175:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./$.is-object":83,"./$.object-sap":99}],176:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./$.is-object":83,"./$.object-sap":99}],177:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./$.export');
$export($export.S, 'Object', {is: require('./$.same-value')});
},{"./$.export":67,"./$.same-value":108}],178:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":99,"./$.to-object":125}],179:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"./$.is-object":83,"./$.object-sap":99}],180:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"./$.is-object":83,"./$.object-sap":99}],181:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":67,"./$.set-proto":109}],182:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./$.classof')
  , test    = {};
test[require('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./$.redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":55,"./$.redefine":106,"./$.wks":128}],183:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , empty      = function(){ /* empty */ }
  , Wrapper;

var testResolve = function(sub){
  var test = new P(empty), promise;
  if(sub)test.constructor = function(exec){
    exec(empty, empty);
  };
  (promise = P.resolve(test))['catch'](empty);
  return promise === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":91,"./$.a-function":47,"./$.an-object":49,"./$.classof":55,"./$.core":61,"./$.ctx":62,"./$.descriptors":64,"./$.export":67,"./$.for-of":72,"./$.global":74,"./$.is-object":83,"./$.iter-detect":88,"./$.library":93,"./$.microtask":97,"./$.redefine-all":105,"./$.same-value":108,"./$.set-proto":109,"./$.set-species":110,"./$.set-to-string-tag":111,"./$.species-constructor":113,"./$.strict-new":114,"./$.wks":128}],184:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export  = require('./$.export')
  , _apply   = Function.apply
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, anObject(argumentsList));
  }
});
},{"./$.an-object":49,"./$.export":67}],185:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = require('./$')
  , $export   = require('./$.export')
  , aFunction = require('./$.a-function')
  , anObject  = require('./$.an-object')
  , isObject  = require('./$.is-object')
  , bind      = Function.bind || require('./$.core').Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./$":91,"./$.a-function":47,"./$.an-object":49,"./$.core":61,"./$.export":67,"./$.fails":69,"./$.is-object":83}],186:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./$.fails')(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$":91,"./$.an-object":49,"./$.export":67,"./$.fails":69}],187:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./$.export')
  , getDesc  = require('./$').getDesc
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./$":91,"./$.an-object":49,"./$.export":67}],188:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./$.export')
  , anObject = require('./$.an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./$.iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./$.an-object":49,"./$.export":67,"./$.iter-create":86}],189:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"./$":91,"./$.an-object":49,"./$.export":67}],190:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./$.export')
  , getProto = require('./$').getProto
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./$":91,"./$.an-object":49,"./$.export":67}],191:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = require('./$')
  , has      = require('./$.has')
  , $export  = require('./$.export')
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./$":91,"./$.an-object":49,"./$.export":67,"./$.has":75,"./$.is-object":83}],192:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./$.export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./$.export":67}],193:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./$.export')
  , anObject      = require('./$.an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./$.an-object":49,"./$.export":67}],194:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./$.export');

$export($export.S, 'Reflect', {ownKeys: require('./$.own-keys')});
},{"./$.export":67,"./$.own-keys":101}],195:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./$.export')
  , anObject           = require('./$.an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.an-object":49,"./$.export":67}],196:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./$.export')
  , setProto = require('./$.set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.export":67,"./$.set-proto":109}],197:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = require('./$')
  , has        = require('./$.has')
  , $export    = require('./$.export')
  , createDesc = require('./$.property-desc')
  , anObject   = require('./$.an-object')
  , isObject   = require('./$.is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./$":91,"./$.an-object":49,"./$.export":67,"./$.has":75,"./$.is-object":83,"./$.property-desc":104}],198:[function(require,module,exports){
var $        = require('./$')
  , global   = require('./$.global')
  , isRegExp = require('./$.is-regexp')
  , $flags   = require('./$.flags')
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(require('./$.descriptors') && (!CORRECT_NEW || require('./$.fails')(function(){
  re2[require('./$.wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./$.redefine')(global, 'RegExp', $RegExp);
}

require('./$.set-species')('RegExp');
},{"./$":91,"./$.descriptors":64,"./$.fails":69,"./$.flags":71,"./$.global":74,"./$.is-regexp":84,"./$.redefine":106,"./$.set-species":110,"./$.wks":128}],199:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = require('./$');
if(require('./$.descriptors') && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./$.flags')
});
},{"./$":91,"./$.descriptors":64,"./$.flags":71}],200:[function(require,module,exports){
// @@match logic
require('./$.fix-re-wks')('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"./$.fix-re-wks":70}],201:[function(require,module,exports){
// @@replace logic
require('./$.fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"./$.fix-re-wks":70}],202:[function(require,module,exports){
// @@search logic
require('./$.fix-re-wks')('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"./$.fix-re-wks":70}],203:[function(require,module,exports){
// @@split logic
require('./$.fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"./$.fix-re-wks":70}],204:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":60,"./$.collection-strong":57}],205:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $at     = require('./$.string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.export":67,"./$.string-at":115}],206:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./$.export')
  , toLength  = require('./$.to-length')
  , context   = require('./$.string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , $$   = arguments
      , endPosition = $$.length > 1 ? $$[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./$.export":67,"./$.fails-is-regexp":68,"./$.string-context":116,"./$.to-length":124}],207:[function(require,module,exports){
var $export        = require('./$.export')
  , toIndex        = require('./$.to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res   = []
      , $$    = arguments
      , $$len = $$.length
      , i     = 0
      , code;
    while($$len > i){
      code = +$$[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$.export":67,"./$.to-index":121}],208:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./$.export')
  , context  = require('./$.string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./$.fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./$.export":67,"./$.fails-is-regexp":68,"./$.string-context":116}],209:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":87,"./$.string-at":115}],210:[function(require,module,exports){
var $export   = require('./$.export')
  , toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl   = toIObject(callSite.raw)
      , len   = toLength(tpl.length)
      , $$    = arguments
      , $$len = $$.length
      , res   = []
      , i     = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < $$len)res.push(String($$[i]));
    } return res.join('');
  }
});
},{"./$.export":67,"./$.to-iobject":123,"./$.to-length":124}],211:[function(require,module,exports){
var $export = require('./$.export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.export":67,"./$.string-repeat":118}],212:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./$.export')
  , toLength    = require('./$.to-length')
  , context     = require('./$.string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , $$     = arguments
      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./$.export":67,"./$.fails-is-regexp":68,"./$.string-context":116,"./$.to-length":124}],213:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./$.string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./$.string-trim":119}],214:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":91,"./$.an-object":49,"./$.descriptors":64,"./$.enum-keys":66,"./$.export":67,"./$.fails":69,"./$.get-names":73,"./$.global":74,"./$.has":75,"./$.is-array":81,"./$.keyof":92,"./$.library":93,"./$.property-desc":104,"./$.redefine":106,"./$.set-to-string-tag":111,"./$.shared":112,"./$.to-iobject":123,"./$.uid":127,"./$.wks":128}],215:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , redefine     = require('./$.redefine')
  , weak         = require('./$.collection-weak')
  , isObject     = require('./$.is-object')
  , has          = require('./$.has')
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":91,"./$.collection":60,"./$.collection-weak":59,"./$.has":75,"./$.is-object":83,"./$.redefine":106}],216:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":60,"./$.collection-weak":59}],217:[function(require,module,exports){
'use strict';
var $export   = require('./$.export')
  , $includes = require('./$.array-includes')(true);

$export($export.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./$.add-to-unscopables')('includes');
},{"./$.add-to-unscopables":48,"./$.array-includes":52,"./$.export":67}],218:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":58,"./$.export":67}],219:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export  = require('./$.export')
  , $entries = require('./$.object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./$.export":67,"./$.object-to-array":100}],220:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = require('./$')
  , $export    = require('./$.export')
  , ownKeys    = require('./$.own-keys')
  , toIObject  = require('./$.to-iobject')
  , createDesc = require('./$.property-desc');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"./$":91,"./$.export":67,"./$.own-keys":101,"./$.property-desc":104,"./$.to-iobject":123}],221:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export = require('./$.export')
  , $values = require('./$.object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./$.export":67,"./$.object-to-array":100}],222:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./$.export')
  , $re     = require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./$.export":67,"./$.replacer":107}],223:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":58,"./$.export":67}],224:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./$.export')
  , $at     = require('./$.string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.export":67,"./$.string-at":115}],225:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./$.export":67,"./$.string-pad":117}],226:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./$.export":67,"./$.string-pad":117}],227:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"./$.string-trim":119}],228:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"./$.string-trim":119}],229:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $export = require('./$.export')
  , $ctx    = require('./$.ctx')
  , $Array  = require('./$.core').Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = $ctx(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$export($export.S, 'Array', statics);
},{"./$":91,"./$.core":61,"./$.ctx":62,"./$.export":67}],230:[function(require,module,exports){
require('./es6.array.iterator');
var global      = require('./$.global')
  , hide        = require('./$.hide')
  , Iterators   = require('./$.iterators')
  , ITERATOR    = require('./$.wks')('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NLProto && !NLProto[ITERATOR])hide(NLProto, ITERATOR, ArrayValues);
if(HTCProto && !HTCProto[ITERATOR])hide(HTCProto, ITERATOR, ArrayValues);
},{"./$.global":74,"./$.hide":76,"./$.iterators":90,"./$.wks":128,"./es6.array.iterator":136}],231:[function(require,module,exports){
var $export = require('./$.export')
  , $task   = require('./$.task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.export":67,"./$.task":120}],232:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./$.global')
  , $export    = require('./$.export')
  , invoke     = require('./$.invoke')
  , partial    = require('./$.partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./$.export":67,"./$.global":74,"./$.invoke":78,"./$.partial":102}],233:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-left');
require('./modules/es7.string.pad-right');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$.core');
},{"./modules/$.core":61,"./modules/es5":130,"./modules/es6.array.copy-within":131,"./modules/es6.array.fill":132,"./modules/es6.array.find":134,"./modules/es6.array.find-index":133,"./modules/es6.array.from":135,"./modules/es6.array.iterator":136,"./modules/es6.array.of":137,"./modules/es6.array.species":138,"./modules/es6.function.has-instance":139,"./modules/es6.function.name":140,"./modules/es6.map":141,"./modules/es6.math.acosh":142,"./modules/es6.math.asinh":143,"./modules/es6.math.atanh":144,"./modules/es6.math.cbrt":145,"./modules/es6.math.clz32":146,"./modules/es6.math.cosh":147,"./modules/es6.math.expm1":148,"./modules/es6.math.fround":149,"./modules/es6.math.hypot":150,"./modules/es6.math.imul":151,"./modules/es6.math.log10":152,"./modules/es6.math.log1p":153,"./modules/es6.math.log2":154,"./modules/es6.math.sign":155,"./modules/es6.math.sinh":156,"./modules/es6.math.tanh":157,"./modules/es6.math.trunc":158,"./modules/es6.number.constructor":159,"./modules/es6.number.epsilon":160,"./modules/es6.number.is-finite":161,"./modules/es6.number.is-integer":162,"./modules/es6.number.is-nan":163,"./modules/es6.number.is-safe-integer":164,"./modules/es6.number.max-safe-integer":165,"./modules/es6.number.min-safe-integer":166,"./modules/es6.number.parse-float":167,"./modules/es6.number.parse-int":168,"./modules/es6.object.assign":169,"./modules/es6.object.freeze":170,"./modules/es6.object.get-own-property-descriptor":171,"./modules/es6.object.get-own-property-names":172,"./modules/es6.object.get-prototype-of":173,"./modules/es6.object.is":177,"./modules/es6.object.is-extensible":174,"./modules/es6.object.is-frozen":175,"./modules/es6.object.is-sealed":176,"./modules/es6.object.keys":178,"./modules/es6.object.prevent-extensions":179,"./modules/es6.object.seal":180,"./modules/es6.object.set-prototype-of":181,"./modules/es6.object.to-string":182,"./modules/es6.promise":183,"./modules/es6.reflect.apply":184,"./modules/es6.reflect.construct":185,"./modules/es6.reflect.define-property":186,"./modules/es6.reflect.delete-property":187,"./modules/es6.reflect.enumerate":188,"./modules/es6.reflect.get":191,"./modules/es6.reflect.get-own-property-descriptor":189,"./modules/es6.reflect.get-prototype-of":190,"./modules/es6.reflect.has":192,"./modules/es6.reflect.is-extensible":193,"./modules/es6.reflect.own-keys":194,"./modules/es6.reflect.prevent-extensions":195,"./modules/es6.reflect.set":197,"./modules/es6.reflect.set-prototype-of":196,"./modules/es6.regexp.constructor":198,"./modules/es6.regexp.flags":199,"./modules/es6.regexp.match":200,"./modules/es6.regexp.replace":201,"./modules/es6.regexp.search":202,"./modules/es6.regexp.split":203,"./modules/es6.set":204,"./modules/es6.string.code-point-at":205,"./modules/es6.string.ends-with":206,"./modules/es6.string.from-code-point":207,"./modules/es6.string.includes":208,"./modules/es6.string.iterator":209,"./modules/es6.string.raw":210,"./modules/es6.string.repeat":211,"./modules/es6.string.starts-with":212,"./modules/es6.string.trim":213,"./modules/es6.symbol":214,"./modules/es6.weak-map":215,"./modules/es6.weak-set":216,"./modules/es7.array.includes":217,"./modules/es7.map.to-json":218,"./modules/es7.object.entries":219,"./modules/es7.object.get-own-property-descriptors":220,"./modules/es7.object.values":221,"./modules/es7.regexp.escape":222,"./modules/es7.set.to-json":223,"./modules/es7.string.at":224,"./modules/es7.string.pad-left":225,"./modules/es7.string.pad-right":226,"./modules/es7.string.trim-left":227,"./modules/es7.string.trim-right":228,"./modules/js.array.statics":229,"./modules/web.dom.iterable":230,"./modules/web.immediate":231,"./modules/web.timers":232}],234:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":237}],235:[function(require,module,exports){
module.exports = require("./lib/polyfill");

},{"./lib/polyfill":46}],236:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":235}],237:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[30]);


angular.module('GPC').constant('backEnd', {
	'foo': '',
	'bar': '',
})