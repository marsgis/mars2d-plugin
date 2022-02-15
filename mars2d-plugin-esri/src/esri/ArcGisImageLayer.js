import L from "leaflet";
import * as LEsri from "esri-leaflet";
import * as mars2d from "mars2d";

/**
 * @typedef {Object} ArcGisImageLayer.EventType
 * 当前类支持的{@link EventType}事件类型（包括自定义字符串事件名）
 *
 * @property {String} loading 当新功能开始加载时触发。
 * @property {String} load	 当地图当前边界中的所有要素都已加载时触发。
 *
 * @property {String} requeststart	 当对服务的请求开始时触发。
 * @property {String} requestend	 当对服务的请求结束时触发。
 * @property {String} requestsuccess	 当对服务的请求成功时触发。
 * @property {String} requesterror	 当对服务的请求响应错误时触发。
 * @property {String} authenticationrequired	 当对服务的请求失败并需要身份验证时，这将被触发。
 *
 *
 * @example
 * //绑定监听事件
tileLayer.on('load', function (event) {
  console.log('触发了事件',event)
});
 * @see BaseClass#on
 * @see BaseClass#off
 */

/**
 *
 * ArcGIS Server Image服务图层，
 * 【需要引入mars2d-esri 插件库】
 *
 * @param {Object} options 参数对象，包括以下：
 * @param {String} options.url ArcGIS Server服务地址,比如：'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/World/MODIS/ImageServer'
 * @param {String} [options.format='jpegpng'] 图像的输出格式
 * @param {Number} [options.opacity=1] 图层的不透明度。应该是介于0(完全透明)和1(完全不透明)之间的值。
 * @param {String} [options.bandIds] 	如果有多个波段，您可以指定要导出的波段。
 * @param {Number} [options.noData] 	代表无信息的像素值。
 * @param {String} [options.noDataInterpretation] 	noData设置的解释。
 * @param {String} [options.pixelType] 	除非需要，否则在大多数 exportImage 用例中保留pixelType未指定或。
 *
 * @param {Number} [options.minZoom] 图层将显示在地图上的最远缩放级别。
 * @param {Number} [options.maxZoom] 图层将显示在地图上的最近缩放级别。
 * @param {Number} [options.zIndex] 用于图层间排序
 * @param {String} [options.token] 如果您在服务需要传递令牌，它将包含在对服务的所有请求中。
 * @param {String} [options.proxy]  代理服务URL
 * @param {Boolean} [options.useCors=true] 如果此服务在发出 GET 请求时应使用 CORS。
 *
 * @param {String|Number} [options.id = uuid()] 图层id标识
 * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
 * @param {String} [options.name = ''] 图层名称
 *
 * @export
 * @class ArcGisImageLayer
 * @extends {L.esri.ImageMapLayer}
 * @see [支持的事件类型]{@link ArcGisImageLayer.EventType}
 * @see [更多请参考L.esri.ImageMapLayer类API]{@link http://esri.github.io/esri-leaflet/api-reference/layers/image-map-layer.html}
 * @example
let arcGisImageLayer = new ArcGisImageLayer({
  url: 'https://ihttmagery.oregonexplorer.info/arcgis/rest/services/NAIP_2011/NAIP_2011_Dynamic/ImageServer'
})
arcGisImageLayer.setBandIds('3,0,1').addTo(map);
 */
export class ArcGisImageLayer extends LEsri.ImageMapLayer {
  initialize (options) {
		super.initialize(options);

    L.Util.stamp(this);
    this.options.id = mars2d.Util.defaultValue(this.options.id, this.uuid);
    this.options.pid = mars2d.Util.defaultValue(this.options.pid, -1);
    this.options.name = mars2d.Util.defaultValue(this.options.name, "");
	}

  /**
   *  内置唯一标识ID
   *
   * @type {String}
   * @readonly
   */
  get uuid() {
    return this._leaflet_id;
  }

  /**
   * 是否已添加到地图
   *
   * @type {Boolean}
   * @readonly
   *
   */
  get isAdded() {
    return this._map && this._map.hasLayer(this);
  }

  /**
   * 对象的pid标识
   *
   * @type {String|Number}
   */
  get pid() {
    return this.options.pid;
  }
  set pid(pid) {
    this.options.pid = pid;
  }

  /**
   * 对象的id标识
   *
   * @type {String|Number}
   */
  get id() {
    return this.options.id;
  }
  set id(id) {
    this.options.id = id;
  }

  /**
   * 名称 标识
   *
   * @type {String}
   */
  get name() {
    return this.options.name;
  }
  set name(name) {
    this.options.name = name;
  }

  /**
   * 透明度
   *
   * @type {Number}
   */
  get opacity() {
    return this.getOpacity();
  }
  set opacity(value) {
    this.setOpacity(value);
  }

  /**
   * 波段值
   * @type {String|Number[]}
   */
  get bandIds() {
    return this.getBandIds();
  }
  set bandIds(value) {
    this.setBandIds(value);
  }
}

mars2d.layer.ArcGisImageLayer = ArcGisImageLayer;

//注册下
mars2d.LayerUtil.register("arcgis_image", ArcGisImageLayer);

//以下是leaflet的内部方法，mars2d集成直接使用的，编写注释形成API文档

/**
 * 在所有其他叠加层下方重绘此层。
 * @return {ArcGisImageLayer} 当前对象本身,可以链式调用
 *
 * @function bringToBack
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 在所有其他叠加层之上重绘此层。
 * @return {ArcGisImageLayer} 当前对象本身,可以链式调用
 *
 * @function bringToFront
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 绑定Popup弹窗配置
 * @param {Function} content Popup弹窗回调方法
 * @param {Map.PopupOptions} [options] Popup弹窗参数
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 * @example
imageMapLayer.bindPopup(function(err, identifyResults, response){
    var value = results.pixel.properties.value;
    return (value) ? 'Pixel value: ' + value : false;
  });
 *
 * @function bindPopup
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 解除绑定Popup弹窗配置
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function unbindPopup
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 返回当前波段值。
 * @return {String} 波段值
 *
 * @function getBandIds
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 指定要导出的单个波段，或者您可以通过指定波段编号来更改波段组合（红色、绿色、蓝色）。
 * @param {String|Number[]} bandIds 波段值
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function setBandIds
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 返回当前无数据值。
 * @return {String} 无数据值
 *
 * @function getNoData
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 指定单个值或一组值以将其视为无数据。没有数据将值呈现为透明。
 *
 * @param {Number|Number[]} noData 无数据值
 * @param {String} [noDataInterpretation] 可以是esriNoDataMatchAny| esriNoDataMatchAll.
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function setNoData
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 返回当前像素类型。
 * @return {String} 像素类型也称为数据类型
 *
 * @function getPixelType
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 像素类型也称为数据类型，与存储在栅格中的值的类型有关，例如有符号整数、无符号整数或浮点数。可能的值：C128、C64、F32、F64、S16、S32、S8、U1、U16、U2、U32、U4、U8、UNKNOWN。
 *
 * @param {String} pixelType 像素类型也称为数据类型
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function setPixelType
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 请求有关此要素图层的元数据。将使用error和调用回调metadata。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 * @example
featureLayer.metadata(function(error, metadata){
  console.log(metadata);
});
 * @function metadata
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 返回L.esri.Query可用于查询此服务的新对象。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {Object} [L.esri.Query对象]{@link http://esri.github.io/esri-leaflet/api-reference/tasks/query.html}
 * @example
imageService.query()
  .within(latlngbounds)
  .run(function(error, featureCollection, response){
    console.log(featureCollection);
});
 * @function query
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 返回图层的当前渲染规则。
 * @return {Object} 当前渲染规则
 *
 * @function getRenderingRule
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 使用传递的渲染规则重绘图层。
 * @param {Object} renderingRule 当前渲染规则
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function setRenderingRule
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 	返回图层的当前镶嵌规则。
 * @return {Object} 镶嵌规则
 *
 * @function getMosaicRule
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 使用传递的镶嵌规则重绘图层。
 * @param {Object} mosaicRule 镶嵌规则
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function setMosaicRule
 * @memberof ArcGisImageLayer
 * @instance
 */

/**
 * 用于向服务发出新请求并绘制响应。
 * @return {ArcGisImageLayer} 当前对象本身，可以链式调用
 *
 * @function redraw
 * @memberof ArcGisImageLayer
 * @instance
 */
