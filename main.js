/**
 * FIRMS Tuna Atlas data viewer
 * @author Emmanuel Blondel GIS & Marine web-information systems Expert
 */
import $ from 'jquery'; 
window.$ = $;

//filters
import 'openfairviewer/src/import-jsonix';
import 'openfairviewer/src/import-w3c-schemas';
import 'openfairviewer/src/import-ogc-schemas';
import FilterFactory from 'openfairviewer/src/vendor/ows/FilterFactory';

//tiled layers
import {TileArcGISRest} from 'ol/source';
import {Tile as TileLayer} from 'ol/layer';

import OpenFairViewer from 'openfairviewer/src/OpenFairViewer.js';
import './main.css';

window.OFV = null;
window.ff = null;
$(document).ready(function(){

	//OGC filter factory
	ff = new FilterFactory({
		version : "1.1.0",
		schemas : [CSW_2_0_2]
	});

	new OpenFairViewer({
		id: 'OFV',
		containerId: 'mapWrapper',
		profile : '<p>Welcome to the <b>FIRMS Global Tuna Atlas</b></p><p>The Tuna Atlas application allows exploring Tuna fisheries data at regional and global scales. <a href="https://www.fao.org/fishery/en/collection/firms-tuna-atlas" target="_blank" style="color:#2d8b8c;text-decoration:underline;">More about the FIRMS Global Tuna Atlas</a></p>'+
		'<p><b>Usage</b>: The access to and display of spatial catches is possible through an Internet based map viewer interface through which the user can in two steps Find data sets then Access the selected data.</p>'+
		'<p>Step 1. The <span style="background-color:#3EA8DF;border:2px solid #fff;padding:6px;border-radius:8px;color:white;font-size:80%;">Find</span> button on the top left opens the panel listing all available datasets. Click on the selected dataset then within it, the following options are offered:</p>'+
		'<ul style="font-size:85%;">'+
		'<li>clicking on the <span class="ai ai-doi" style="font-size:120%;color:#908b8b;"></span> icon enables to access the resource with DOI</li>'+
		'<li>clicking on the <span class="glyphicon glyphicon-info-sign" style="color:#908b8b;"></span> icon enables to access the Metadata information</li>'+
		'<li>clicking on the <span class="glyphicon glyphicon-globe" style="color:#908b8b;"></span> icon opens the <span style="background-color:#3EA8DF;border:2px solid #fff;padding:6px;border-radius:8px;color:white;font-size:80%;">Access</span> panel for Querying and Mapping.</li>'+
		'</ul>'+
		'<p>Step 2. the <span style="background-color:#3EA8DF;border:2px solid #fff;padding:6px;border-radius:8px;color:white;font-size:80%;">Access</span> panel enables to query and map or download the selected data: the query is performed by selecting one or more filters over the dataset dimensions (e.g. Fishing fleet, species, fishing gear), the temporal extent,  the catch unit and the aggregation method, where options are between presenting spatial average and cumulated catches across years and quarters.<br> The map is obtained by clicking on the <span style="background-color:#3EA8DF;border:2px solid #fff;padding:4px;border-radius:8px;color:white;font-size:80%;">Query & Map</span> button.</p>'+
		'<p>The legend panel on the right gives information about the map on display including a summary of the access query performed. The map layer can be removed by clicking on the <span class="glyphicon glyphicon-remove-sign" style="color:#908b8b;"></span> icon in front of the layer title.</p>'+
		'<p>Once the resulting map is displayed, the user can access a printable version of the map or download the selected data subset, either as CSV or through dedicated reproducible scripts (R, Jupyter).</p>'+
		'<p style="font-size:80%;"><img alt="European Commission" src="https://ec.europa.eu/info/sites/default/files/ec-logo-horiz-web_en.jpg" height="40px" style="float: left; margin-right: 10px; "></img><em>This work has received funding from the European Union\'s Horizon 2020 research and innovation programme under BlueBRIDGE (Grant Agreement No. 675680) and Blue-Cloud (Grant Agreement No.862409).</em></p>',
		OGC_CSW_BASEURL: "https://www.fao.org/fishery/geonetwork/srv/eng/csw"
	},{	
		language: {
			auto: false,
			default: "en"
		},
		find : {
			filter: ff.And([ ff.IsLike('dc:identifier', '%global%'), ff.IsLike('dc:title', '%tuna%') ]),
			filterByWMS: false,
			datasetInfoHandler : function(metadata){
				var datasetInfoUrl = "https://www.fao.org/fishery/geonetwork/srv/eng/catalog.search#/metadata/" + metadata.fileIdentifier;
				$('#datasetInfo').empty().html('<iframe id="'+metadata.fileIdentifier+'_gn" src="'+datasetInfoUrl+'" style="height: 100%; width: 100%; position: absolute;"> frameborder="0" marginheight="0"></iframe>');
				OFV.openInfoDialog();
			}
		},
		access: {
			time: 'slider',
			values_to_exclude_for: {
				aggregation_method: ['none']
			},
			dashboard: {
				enabled: true
			}
		},
		map : {
			controls : {
				loadingpanel : {widget: 'progressbar'}
			},
			layer_options: {
				opacity: 0.9,
				tiled: true
			},
			zoom: 3,
			baselayergroup : {name: "Base maps", fold: 'open'},
			layergroups : [{name: "Tuna atlas maps", fold: 'open'}],
			mainlayergroup: 0,
			overlays: [
				{
					group: 0, id: "grid1x1", title: "Grid 1x1 (CWP)",
					wmsUrl: "https://www.fao.org/fishery/geoserver/wms", layer: "cwp:cwp-grid-map-1deg_x_1deg,fifao:UN_CONTINENT2",
					visible: false, showLegend: true, opacity: 0.6, tiled: true, cql_filter: undefined
				},
				{
					group: 0, id: "grid5x5", title: "Grid 5x5 (CWP)",
					wmsUrl: "https://www.fao.org/fishery/geoserver/wms", layer: "cwp:cwp-grid-map-5deg_x_5deg,fifao:UN_CONTINENT2",
					visible: false, showLegend: true, opacity: 0.6, tiled: true, cql_filter: undefined
				}	
			],
			popup: {
				enabled: true
			},
			attribution :  '<img src="img/banner/fao_default.png" width="190" height="55" class="ol-powered-by" title="Food and Agriculture Organization of the United Nations" />',

		}
		
	});
	
});
